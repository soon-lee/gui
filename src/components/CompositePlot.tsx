import {PlotProps} from "../models/plot.ts";
import {Application, Graphics, Text} from "pixi.js";
import {discrete, linear} from "../models/layout.ts";
import {createEffect} from "solid-js";

export const CompositePlot = (props: PlotProps) => {
    let container: HTMLDivElement | undefined
    const application = new Application({
        antialias: true,
        width: props.config.width,
        height: props.config.height,
        backgroundColor: 'lightgray',
    })

    createEffect(()=>{
        console.log('composite',props.config.width, props.config.height)
        application.renderer.resize(props.config.width, props.config.height)
    })

    createEffect(
        () => {
            if ( !container) {
                return
            }
            application.stage.removeChildren()
            const g1 = new Graphics();
            const sorter = new Map<string, number>(props.data.sort.map((
                item,
                index
            ) => [item, index + 1]))
            const stacks = props.data.items.sort((
                a,
                b
            ) => a.getString(props.data.dimension) > b.getString(props.data.dimension) ? 1 : a.getString(props.data.dimension) === b.getString(props.data.dimension) ? 0 : -1)
                                .sort((
                                    a,
                                    b
                                ) => (sorter.get(a.getString(props.data.group)) as number) - (sorter.get(b.getString(props.data.group)) as number))
                                .reduce(
                                    (
                                        stack,
                                        item
                                    ) => {
                                        const dimension = item.getString(props.data.dimension);
                                        const group = item.getString(props.data.group);
                                        const measure = item.getNumber(props.data.measure);
                                        const g = stack.get(dimension)
                                        if (g) {
                                            const total = g.get('total')
                                            if (total) {
                                                g.set(
                                                    group,
                                                    [total[1], total[1] + measure]
                                                )
                                                g.set(
                                                    'total',
                                                    [total[0], total[1] + measure]
                                                )
                                            } else {
                                                g.set(
                                                    group,
                                                    [0, measure]
                                                )
                                                g.set(
                                                    'total',
                                                    [0, measure]
                                                )
                                            }
                                        } else {
                                            stack.set(
                                                dimension,
                                                new Map<string, [number, number]>([[group, [0, measure
                                                ]], ['total', [0, 0]]])
                                            )
                                        }
                                        return stack;
                                    },
                                    new Map<string, Map<string, [number, number]>>(
                                        Array.from(props.data.items.reduce(
                                            (
                                                del,
                                                item
                                            ) => del.add(item.getString(props.data.dimension)),
                                            new Set<string>()
                                        ))
                                             .sort((
                                                 a,
                                                 b
                                             ) => a > b ? 1 : a === b ? 0 : -1)
                                             .map(item => {
                                                 return [item, new Map<string, [number, number]>([['total', [0, 0]]])]
                                             })
                                    )
                                )
            const yLeft = linear(
                [0, 500],
                [props.config.height-props.config.margin[2], props.config.margin[0]]
            )
            const xBottom = discrete(
                ['01', '02', '03', '04', '05', '06'],
                [props.config.margin[3], props.config.width-props.config.margin[1]]
            )
            let [lineX, lineY] = [0, 0];
            Array.from(stacks.entries())
                 .forEach((
                     [dimension, groups],
                     index
                 ) => {
                     Array.from(groups.entries())
                          .forEach(([group, [begin, end]]) => {
                              if (group === 'total') {
                                  return
                              }
                              g1.beginFill(props.config.colors[group])
                              g1.drawRect(
                                  xBottom(dimension)[0]+5,
                                  yLeft(end),
                                  xBottom(dimension)[1]-xBottom(dimension)[0]-10,
                                  yLeft(begin) - yLeft(end)
                              )
                              g1.endFill()
                          })
                     g1.beginFill('green')
                     g1.drawCircle(
                         (xBottom(dimension)[0]+xBottom(dimension)[1])/2,
                         yLeft((groups.get('total') as [number, number])[1]),
                         5
                     )
                     g1.endFill()
                     if (index > 0) {
                         g1.lineStyle(
                             1,
                             'black',
                             0.5
                         );
                         g1.moveTo(
                             lineX,
                             lineY
                         );
                         g1.lineTo(
                             (xBottom(dimension)[0]+xBottom(dimension)[1])/2,
                             yLeft((groups.get('total') as [number, number])[1])
                         );
                         g1.endFill();
                     }
                     [lineX, lineY] = [(xBottom(dimension)[0]+xBottom(dimension)[1])/2, yLeft((groups.get('total') as [number, number])[1])]
                 })
            const g3 = new Graphics();
            g3.visible = false;
            g3.beginFill('green')
            g3.drawRoundedRect(
                10,
                10,
                120,
                80,
                3
            )

            g3.endFill()
            const t1 = new Text('dfjlsf')
            t1.x = 10
            t1.y = 10
            g3.addChild(t1)

            application.stage.addChild(g1);
            application.stage.addChild(g3);
            container.append(application.view as HTMLCanvasElement);
        }
    );
    return (
        <div ref={container}/>
    );
}