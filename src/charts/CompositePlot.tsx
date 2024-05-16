import {PlotProps} from "../models/plot.ts";
import {Application, Graphics, Text} from "pixi.js";
import {
    axisLayout,
    compareWithPrioritizer,
    discreteScale,
    linearScale,
    prioritizerFrom,
    stackLayout, summerList,
    unionList
} from "../models/layout.ts";
import {createEffect} from "solid-js";

export const CompositePlot = (props: PlotProps) => {
    let container: HTMLDivElement | undefined
    const application = new Application({
        antialias: true,
        width: props.config.width,
        height: props.config.height,
        backgroundColor: 'lightgray',
    })

    const dimensions = unionList(props.data.items, item => item.getString(props.data.dimension)).sort()
    const groups = props.data.sort?props.data.sort:unionList(props.data.items, item => item.getString(props.data.group)).sort()
    const summer = summerList(props.data.items,item => item.getString(props.data.dimension), item => item.getNumber(props.data.measure))

    const area = new Graphics();
    const areaBar = new Graphics();
    const areaLine = new Graphics();
    const areaPoint = new Graphics();

    const axes = new Graphics();axes.lineStyle(
        1,
        'black',
        0.5
    );

    const tooltip = new Graphics();
    tooltip.visible = false;
    tooltip.beginFill('white')
    tooltip.drawRoundedRect(0, 0, 150, 45+20*3, 3)
    tooltip.endFill()
    const tooltipDimension = new Text()
    tooltipDimension.style.fontSize = 15
    tooltipDimension.style.fontWeight = 'bold'
    tooltipDimension.anchor.y = 0.5
    tooltipDimension.x = 10
    tooltipDimension.y = 15
    let tooltipY = 15
    const tooltipGroup = new Graphics()
    unionList(props.data.items, item => item.getString(props.data.group)).forEach((_, index) => {
        tooltipY+=20
        const tooltipMeasure = new Text()
        tooltipMeasure.style.fontSize = 13
        tooltipMeasure.style.fontWeight = 'bold'
        tooltipMeasure.anchor.y = 0.5
        tooltipMeasure.x = 10
        tooltipMeasure.y = tooltipY
        tooltipGroup.addChild(tooltipMeasure)
    })
    const tooltipTotal = new Text()
    tooltipTotal.style.fontSize = 12
    tooltipTotal.anchor.y = 0.5
    tooltipTotal.x = 10
    tooltipTotal.y = tooltipY+20
    tooltip.addChild(tooltipDimension)
    tooltip.addChild(tooltipGroup)
    tooltip.addChild(tooltipTotal)

    createEffect(() => {
        application.renderer.resize(
            props.config.width,
            props.config.height
        )
    })

    createEffect(
        () => {
            if ( !container) {
                return
            }
            area.clear()
            area.removeChildren()
            areaBar.clear()
            areaBar.removeChildren()
            areaLine.clear()
            areaLine.removeChildren()
            areaPoint.clear()
            areaPoint.removeChildren()
            axes.clear()
            axes.removeChildren()


            const stack = stackLayout(
                props.data.items,
                item => item.getString(props.data.dimension),
                item => item.getString(props.data.group),
                item => item.getNumber(props.data.measure),
                undefined,
                (
                    a,
                    b
                ) => compareWithPrioritizer(
                    prioritizerFrom(props.data.sort),
                    a,
                    b
                )
            )
            const yLeft = linearScale(
                [0, 500],
                [props.config.height - props.config.margin[2], props.config.margin[0]]
            )
            const yRight = linearScale(
                [0, 1],
                [props.config.height - props.config.margin[2], props.config.margin[0]]
            )
            const xBottom = discreteScale(
                ['01', '02', '03', '04', '05', '06'],
                [props.config.margin[3], props.config.width - props.config.margin[1]]
            )
            let [lineX, lineY] = [0, 0];
            stack.forEach((
                [dimension, groups],
                index
            ) => {
                const barItem = new Graphics()
                barItem.eventMode = 'dynamic'
                const groupList: any[] = []
                Array.from(groups.entries())
                    .forEach(([group, [range,item]]) => {
                        if (group === 'total') {
                            return
                        }
                        barItem.beginFill(props.config.colors[group])
                        barItem.drawRect(
                            xBottom(dimension)[0] + 5,
                            yLeft(range[1]),
                            xBottom(dimension)[1] - xBottom(dimension)[0] - 10,
                            yLeft(range[0]) - yLeft(range[1])
                        )
                        barItem.endFill()
                        groupList.push([group,item])
                    })
                barItem.on('mouseover',()=>{
                    tooltipDimension.text = dimension
                    tooltipGroup.children.forEach((child,index)=>{
                        (child as Text).text = `${groupList[index][0]}: ${groupList[index][1]?groupList[index][1].getNumber(props.data.measure):0} (${groupList[index][1]?(groupList[index][1].getNumber(props.data.measure)/groups.get('total')![0][1]*100).toFixed(2):0.00}%)`
                    })
                    tooltipTotal.text = `总计：${groups.get('total')![1].getNumber(props.data.measure).toFixed(2)}`
                }).on('mousemove',event=>{
                    let [x,y] = [event.global.x + 10,event.global.y + 10]
                    if(container){
                        if(container.getBoundingClientRect().left+event.global.x+150 >= container.getBoundingClientRect().right){
                            x = event.global.x-155
                        }
                        if(container.getBoundingClientRect().top+event.global.y+120 >= container.getBoundingClientRect().bottom){
                            y = event.global.y-120
                        }
                    }
                    tooltip.visible = true
                    tooltip.x = x ;
                    tooltip.y = y;
                }).on('mouseout',()=>{tooltip.visible = false})
                areaBar.addChild(barItem)
                areaPoint.beginFill('green')
                areaPoint.lineStyle(
                    1,
                    'white'
                );
                areaPoint.drawCircle(
                    (xBottom(dimension)[0] + xBottom(dimension)[1]) / 2,
                    yLeft(groups.get('total')![0][1]),
                    3
                )
                areaPoint.endFill()
                const label = new Text(groups.get('total')![1].getNumber(props.data.measure))
                label.x = (xBottom(dimension)[0] + xBottom(dimension)[1]) / 2;
                label.y = yLeft(groups.get('total')![0][1]) - 10;
                label.anchor.set(0.5, 0.5)
                label.style.fontSize = 12;
                areaPoint.addChild(label)
                if (index > 0) {
                    areaLine.lineStyle(
                        2,
                        'black',
                        0.5
                    );
                    areaLine.moveTo(
                        lineX,
                        lineY
                    );
                    areaLine.lineTo(
                        (xBottom(dimension)[0] + xBottom(dimension)[1]) / 2,
                        yLeft(groups.get('total')![0][1])
                    );
                    areaLine.endFill();
                }
                [lineX, lineY] = [(xBottom(dimension)[0] + xBottom(dimension)[1]) / 2, yLeft(groups.get('total')![0][1])]
            })


            axes.moveTo(props.config.margin[3], props.config.margin[0])
            axes.lineTo(props.config.margin[3], props.config.height - props.config.margin[2]);
            axes.lineTo(props.config.width - props.config.margin[1], props.config.height - props.config.margin[2]);
            axes.lineTo(props.config.width - props.config.margin[1], props.config.margin[0]);
            unionList(props.data.items, item => item.getString(props.data.dimension)).forEach(dimension => {
                axes.moveTo(xBottom(dimension)[0], props.config.height - props.config.margin[2])
                axes.lineTo(xBottom(dimension)[0], props.config.height - props.config.margin[2]+6)
            })
            axisLayout([0,500]).forEach((value)=>{
                axes.moveTo(xBottom('01')[0], yLeft(value))
                axes.lineTo(xBottom('01')[0]-6, yLeft(value))
                const t = new Text(`${value}`)
                t.anchor.set(0, 0.5)
                t.style.fontSize = 12;
                t.x = xBottom('01')[0]-20;
                t.y = yLeft(value)
                axes.addChild(t)
            })
            axisLayout([0,1]).forEach((value)=>{
                axes.moveTo(xBottom('06')[1], yRight(value))
                axes.lineTo(xBottom('06')[1]+6, yRight(value))
                const t = new Text(`${value}`)
                t.anchor.set(0, 0.5)
                t.style.fontSize = 12;
                t.x = xBottom('06')[1]+6;
                t.y = yRight(value)
                axes.addChild(t)
            })


            area.addChild(areaBar);
            area.addChild(areaLine);
            area.addChild(areaPoint)
            area.addChild(axes)
            application.stage.addChild(area);
            application.stage.addChild(tooltip);
            container.append(application.view as HTMLCanvasElement);
        }
    );
    return (
        <div ref={container}/>
    );
}