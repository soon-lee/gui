import {PlotProps} from "../models/plot.ts";
import {Application, Graphics, Text} from "pixi.js";
import {linear} from "../models/layout.ts";
import {createEffect} from "solid-js";

export const CompositePlot = ({data, config}: PlotProps) => {
    let container: HTMLDivElement | undefined
    const application = new Application({
        antialias: true,
        width: config.width,
        height: config.height,
        backgroundColor: 'white',
    })

    createEffect(
        () => {
            if ( !container) {
                return
            }
            const g1 = new Graphics();
            const sorter = new Map<string, number>(data.sort.map((
                item,
                index
            ) => [item, index + 1]))
            const stacks = data.items.sort((
                a,
                b
            ) => a.getString(data.dimension) > b.getString(data.dimension) ? 1 : a.getString(data.dimension) === b.getString(data.dimension) ? 0 : -1)
                               .sort((
                                   a,
                                   b
                               ) => (sorter.get(a.getString(data.group)) as number) - (sorter.get(b.getString(data.group)) as number))
                               .reduce(
                                   (
                                       stack,
                                       item
                                   ) => {
                                       const dimension = item.getString(data.dimension);
                                       const group = item.getString(data.group);
                                       const measure = item.getNumber(data.measure);
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
                                       Array.from(data.items.reduce(
                                           (
                                               del,
                                               item
                                           ) => del.add(item.getString(data.dimension)),
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
                [180, 20]
            )
            let [lineX, lineY] = [0, 0];
            Array.from(stacks.entries())
                 .forEach((
                     [, groups],
                     index
                 ) => {
                     Array.from(groups.entries())
                          .forEach(([group, [begin, end]]) => {
                              if (group === 'total') {
                                  return
                              }
                              g1.beginFill(config.colors[group])
                              g1.drawRect(
                                  20 + index * 15,
                                  yLeft(end),
                                  8,
                                  yLeft(begin) - yLeft(end)
                              )
                              g1.endFill()
                          })
                     g1.beginFill('green')
                     g1.drawCircle(
                         20 + index * 15,
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
                             20 + index * 15,
                             yLeft((groups.get('total') as [number, number])[1])
                         );
                         g1.endFill();
                     }
                     [lineX, lineY] = [20 + index * 15, yLeft((groups.get('total') as [number, number])[1])]
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