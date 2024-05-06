import { PlotProps} from "../models/plot.ts";
import {Application, Graphics, Text} from "pixi.js";
import {annulusLayout, discreteScale, unionList} from "../models/layout.ts";
import {createEffect, createSignal} from "solid-js";

export const AnnulusPlot = (props: PlotProps) => {
    let container: HTMLDivElement | undefined;
    const application = new Application({
        antialias: true, width: props.config.width, height: props.config.height, backgroundColor: 'lightgray'
    })
    const [circle, setCircle] = createSignal([0, 0, 0])
    const [bound, setBound] = createSignal([0, 0, 0, 0])
    createEffect(() => {
        area.clear()
        area.removeChildren()
        attach.removeChildren()
        attach.clear()
        application.renderer.resize(props.config.width, props.config.height)
        const [top, right, bottom, left] = [props.config.margin[0], props.config.width - props.config.margin[1], props.config.height - props.config.margin[2], props.config.margin[3]]
        const [width, height] = [right - left, bottom - top]
        setBound([top, right, bottom, left])
        setCircle([(left + right) / 2, (top + bottom) / 2, Math.min(width, height) / 2 - 10])
    })

    const area = new Graphics();

    const attach = new Graphics()

    const tooltip = new Graphics();
    tooltip.visible = false;
    tooltip.beginFill('white')
    tooltip.drawRoundedRect(0, 0, 120, 45, 3)
    tooltip.endFill()
    const tooltipDimension = new Text()
    tooltipDimension.style.fontSize = 15
    tooltipDimension.style.fontWeight = 'bold'
    tooltipDimension.anchor.y = 0.5
    tooltipDimension.x = 10
    tooltipDimension.y = 15
    const tooltipMeasure = new Text()
    tooltipMeasure.style.fontSize = 13
    tooltipMeasure.style.fontWeight = 'bold'
    tooltipMeasure.anchor.y = 0.5
    tooltipMeasure.x = 10
    tooltipMeasure.y = 30
    const tooltipRate = new Text()
    tooltipRate.style.fontSize = 12
    tooltipRate.anchor.y = 0.5
    tooltipRate.x = 60
    tooltipRate.y = 30
    tooltip.addChild(tooltipDimension)
    tooltip.addChild(tooltipMeasure)
    tooltip.addChild(tooltipRate)

    const dimensionList = unionList(props.data.items, item => item.getString(props.data.dimension));


    createEffect(() => {

        if (!container) return
        application.stage.removeChildren()

        annulusLayout(props.data.items, item => item.getNumber(props.data.measure)).forEach(({ begin, end, item }) => {
            const angle = (begin + end) / 2
            const g = new Graphics();
            g.eventMode = "dynamic"
            g.beginFill(props.config.colors[item.getString(props.data.dimension)])
            g.arc(circle()[0], circle()[1], circle()[2], begin, end, false)
            g.arc(circle()[0], circle()[1], circle()[2] * 0.6, end, begin, true)
            g.closePath()
            if (circle()[2] * 0.6*Math.sin(angle/2)*2 > 8) {
                const label = new Text(item.getString(props.data.dimension))
                label.anchor.set(0.5, 0.5)
                label.x = circle()[0] + circle()[2]*0.7 * Math.cos(angle)
                label.y = circle()[1] + circle()[2]*0.7 * Math.sin(angle)
                label.style.fontSize = 10
                g.addChild(label)
            }
            g.onmouseover = () => {
                tooltipDimension.text = item.getString(props.data.dimension)
                tooltipMeasure.text = item.getNumber(props.data.measure)
                tooltipRate.text = `(${(item.getNumber(props.data.rate) * 100).toFixed(2)}%)`

            }
            g.onmousemove = (event) => {
                let [x,y] = [event.global.x + 10,event.global.y + 10]
                if(container){
                    if(container.getBoundingClientRect().left+event.global.x+120 >= container.getBoundingClientRect().right){
                        x = event.global.x-125
                    }
                    if(container.getBoundingClientRect().top+event.global.y+60 >= container.getBoundingClientRect().bottom){
                        y = event.global.y-60
                    }
                }
                tooltip.visible = true
                tooltip.x = x ;
                tooltip.y = y;
            }
            g.onmouseout = () => {
                tooltip.visible = false
            }
            area.addChild(g);
            attach.moveTo(circle()[0] + circle()[2] * Math.cos(angle), circle()[1] + circle()[2] * Math.sin(angle))
            attach.lineStyle({width: 1, color: props.config.colors[item.getString(props.data.dimension)]})
            attach.lineTo(circle()[0] + circle()[2]*1.1 * Math.cos(angle), circle()[1] + circle()[2]*1.1 * Math.sin(angle))
            const mark = new Text(item.getNumber(props.data.measure))
            mark.anchor.set(Math.cos(angle) > 0 ? 0 : Math.cos(angle) < 0 ? 1 : 0.5, 0.5)
            mark.style.fontSize = 10
            mark.x = circle()[0] + circle()[2]*1.1 * Math.cos(angle)
            mark.y = circle()[1] + circle()[2]*1.1 * Math.sin(angle)
            if (Math.abs(Math.cos(angle)) < 0.9) {
                attach.lineTo(circle()[0] + circle()[2]*1.2 * Math.cos(angle), circle()[1] + circle()[2]*1.1 * Math.sin(angle))
                mark.x = circle()[0] + circle()[2]*1.2 * Math.cos(angle)
                mark.y = circle()[1] + circle()[2]*1.1 * Math.sin(angle)
            }
            attach.addChild(mark)
        })

        const legendLayout = discreteScale(dimensionList, [bound()[3], bound()[1]])

        dimensionList.forEach(item => {
            attach.beginFill(props.config.colors[item])
            attach.drawRoundedRect((legendLayout(item)[0]+legendLayout(item)[1])/2-25, 10, 20, 15, 3)
            attach.endFill()
            const t = new Text(item)
            t.x = (legendLayout(item)[0]+legendLayout(item)[1])/2 ;
            t.y = 10
            t.style.fontSize = 12
            t.style.lineHeight = 15
            attach.addChild(t)
        })
        if(circle()[2] >100){
            const totalLabel = new Text('总计')
            totalLabel.style.fontSize = 12
            totalLabel.anchor.set(0.5, 0.5)
            totalLabel.x = circle()[0];
            totalLabel.y = circle()[1]-40;
            const totalValue = new Text(props.data.dimension)
            totalValue.style.fontSize = 16
            totalValue.anchor.set(0.5, 0.5)
            totalValue.x = circle()[0];
            totalValue.y = circle()[1]-20;
            attach.addChild(totalLabel)
            attach.addChild(totalValue)
            const rateLabel = new Text('通过率')
            rateLabel.style.fontSize = 12
            rateLabel.anchor.set(0.5, 0.5)
            rateLabel.x = circle()[0];
            rateLabel.y = circle()[1]+20;
            const rateValue = new Text(props.data.rate)
            rateValue.style.fontSize = 16
            rateValue.anchor.set(0.5, 0.5)
            rateValue.x = circle()[0];
            rateValue.y = circle()[1]+40;
            attach.addChild(rateLabel)
            attach.addChild(rateValue)
        }

        application.stage.addChild(area);
        application.stage.addChild(attach);
        application.stage.addChild(tooltip);
        container.append(application.view as HTMLCanvasElement);
    });

    return (<div ref={container}/>);
};