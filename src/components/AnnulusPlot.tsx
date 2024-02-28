import {PlotProps} from "../models/plot.ts";
import {Application, Graphics,Text} from "pixi.js";
import {annulus, dimensions, discrete} from "../models/layout.ts";
import {createEffect, createSignal, onMount} from "solid-js";

export const AnnulusPlot = ({data,config}:PlotProps) => {
    console.log(config)
    let container: HTMLDivElement | undefined;
    const application =new Application({
        antialias: true,
        width: config.width,
        height: config.height,
        backgroundColor: 'lightgray',
    })
    createEffect(()=>{
        // if(container){
        //     application.renderer.resize(container.clientWidth,container.clientHeight)
        // }
console.log(config)
        application.renderer.resize(config.width,config.height)
    })

    const area = new Graphics();
    const tooltip = new Graphics();
    tooltip.visible = false;
    tooltip.beginFill('white')
    tooltip.drawRoundedRect(10,10,120,40,3)
    tooltip.endFill()
    const tooltipDimension = new Text()
    tooltipDimension.style.fontSize = 15
    tooltipDimension.style.fontWeight = 'bold'
    tooltipDimension.anchor.y = 0.5
    tooltipDimension.x = 20
    tooltipDimension.y = 20
    const tooltipMeasure = new Text()
    tooltipMeasure.style.fontSize = 13
    tooltipMeasure.style.fontWeight = 'bold'
    tooltipMeasure.anchor.y = 0.5
    tooltipMeasure.x = 20
    tooltipMeasure.y = 35
    const tooltipRate = new Text()
    tooltipRate.style.fontSize = 12
    tooltipRate.anchor.y = 0.5
    tooltipRate.x = 70
    tooltipRate.y = 35
    tooltip.addChild(tooltipDimension)
    tooltip.addChild(tooltipMeasure)
    tooltip.addChild(tooltipRate)

    const attach = new Graphics()

    // const marking = new Graphics()

    const dimensionList = dimensions(data);

    const legendLayout = discrete(dimensionList,[config.left,config.width-config.right])

    createEffect(
        () => {

            if (!container) return
            // container.setAttribute('width', `${config.width}px`)
            // container.setAttribute('height', `${config.height}px`)

            annulus(data).map(item=>{
                const angle = (item.endAngle+item.beginAngle)/2
                const g = new Graphics();
                g.eventMode = "dynamic"
                g.beginFill(config.colors[item.dimension])
                g.arc(100,100,40,item.beginAngle,item.endAngle,false)
                g.arc(100,100,15,item.endAngle,item.beginAngle,true)
                g.closePath()
                if(item.endAngle-item.beginAngle>0.3){
                    const label = new Text(item.dimension)
                    label.anchor.set(0.5,0.5)
                    label.x = 100+27*Math.cos(angle)
                        label.y = 100+27*Math.sin(angle)
                    label.style.fontSize = 10
                    g.addChild(label)
                }
                g.onmouseover = (event) => {
                    tooltip.visible = true
                    tooltip.x = event.global.x+10;
                    tooltip.y = event.global.y+10;
                    tooltipDimension.text = item.dimension
                    tooltipMeasure.text = item.measure
                    tooltipRate.text = `(${(item.data.getNumber(data.rate)*100).toFixed(2)}%)`

                }
                g.onmousemove = (event) => {
                    tooltip.visible = true
                    tooltip.x = event.global.x+10;
                    tooltip.y = event.global.y+10;
                }
                g.onmouseout = () => {
                    tooltip.visible = false
                }
                area.addChild(g);
                attach.moveTo(100+40*Math.cos(angle),100+40*Math.sin(angle))
                attach.lineStyle({width:1,color:config.colors[item.dimension]})
                attach.lineTo(100+50*Math.cos(angle),100+50*Math.sin(angle))
                const mark = new Text(item.measure)
                mark.anchor.set(Math.cos(angle)>0?0:Math.cos(angle)<0?1:0.5,0.5)
                mark.style.fontSize = 10
                mark.x = 100+50*Math.cos(angle)
                mark.y = 100+50*Math.sin(angle)
                if(Math.abs(Math.cos(angle))<0.9){
                    attach.lineTo(100+70*Math.cos(angle),100+50*Math.sin(angle))
                    mark.x =100+70*Math.cos(angle)
                        mark.y = 100+50*Math.sin(angle)
                }
                attach.addChild(mark)
            })

            dimensionList.forEach(item=>{
                attach.beginFill(config.colors[item])
                attach.drawRoundedRect(legendLayout(item)[0],10,20,15,3)
                attach.endFill()
                const t = new Text(item)
                t.x = legendLayout(item)[0]+25;
                t.y = 10
                t.style.fontSize = 12
                t.style.lineHeight = 15
                attach.addChild(t)
            })

            application.stage.addChild(area);
            application.stage.addChild(attach);
            application.stage.addChild(tooltip);
            container.append(application.view as HTMLCanvasElement);
        }
    );
    return <div ref={container} />;
};