export const annulusLayout = <T> (
    items: T[],
    getter: (item: T) => number,
    offset?: number
) => {
    const sum = items.reduce(
        (
            sum,
            item
        ) => sum + getter(item),
        0
    );
    let begin = offset || 0;
    return items.map(item => {
        const amount = getter(item) / sum * Math.PI * 2;
        const end = begin + amount;
        const arc = {
            begin,
            end,
            item
        }
        begin = end;
        return arc
    })
}

export const linearScale = (
    domain: [number, number],
    range: [number, number]
) => {
    return (x: number) => {
        const [min, max] = domain;
        const [begin, end] = range;
        return (x - min) / (max - min) * (end - begin) + begin;
    }
}
export const discreteScale = (
    domain: string[],
    range: [number, number]
) => {
    return (x: string) => {
        const index = domain.indexOf(x);
        const [begin, end] = range;
        return [index / domain.length * (end - begin) + begin, (1 + index) / domain.length * (end - begin) + begin];
    }
}

export const unionList = <T, K> (
    items: T[],
    getter: (item: T) => K
) => {
    return Array.from(items.reduce(
        (
            set,
            item
        ) => set.add(getter(item)),
        new Set<K>()
    ))
}
export const summerList = <T> (
    items: T[],
    dimensionGetter: (item: T) => string,
    measureGetter: (item: T) => number
) => {
    return items.reduce((sum,item)=>{
        const currentSum = sum.get(dimensionGetter(item)) || 0;
        const dimension = dimensionGetter(item);
        const measure = measureGetter(item);
        if (sum.has(dimension)) {
            sum.set(dimension, currentSum+measure);
        } else {
            sum.set(dimension, measure);
        }
        return sum;
    },new Map<string,number>())
}

export const stackLayout = <T> (
    items: T[],
    dimensionGetter: (item: T) => string,
    groupGetter: (item: T) => string,
    measureGetter: (item: T) => number,
    dimensionComparator?: (
        a: string,
        b: string
    ) => number,
    groupComparator?: (
        a: string,
        b: string
    ) => number
) => {
    const dimensions = unionList(
        items,
        dimensionGetter
    )
    if (dimensionComparator) {
        dimensions.sort(dimensionComparator);
    } else {
        dimensions.sort();
    }
    const groups = unionList(
        items,
        groupGetter
    );
    if (groupComparator) {
        groups.sort(groupComparator);
    } else {
        groups.sort();
    }
    let initial = new Map<string, Map<string, [[number, number], T]>>(dimensions.map(dimension => {
        const groupMap =  new Map<string, [[number, number], T]>([['total', [[0, 0], null as T]]])
        groups.forEach(group => {
            groupMap.set(group, [[0, 0], null as T])
        })
        return [dimension,groupMap]
    }))
    const seriesMap = items.reduce(
        (
            series,
            item
        ) => {
            const dimension = dimensionGetter(item);
            const group = groupGetter(item);
            const measure = measureGetter(item);
            const groupSeries = series.get(dimension);
            const total = groupSeries!.get('total')![0];
            groupSeries!.set(
                group,
                [[total[1], total[1] + measure], item]
            )
            groupSeries!.set(
                'total',
                [[0, total[1] + measure], item]
            )
            return series
        },
        initial
    )

    return Array.from(seriesMap.entries())
}
export const prioritizerFrom = <T> (priorities: T[]) => {
    return new Map<T, number>(priorities.map((
        item,
        index
    ) => [item, index]))
}
export const compareWithPrioritizer = <T> (
    prioritizer: Map<T, number>,
    a: T,
    b: T
) => {
    const aPriority = prioritizer.get(a);
    const bPriority = prioritizer.get(b);
    if (aPriority !== undefined && bPriority !== undefined) {
        return aPriority - aPriority
    } else {
        throw new Error("元素不在优先级列表中，无法比较")
    }

}

export const axisLayout = (range: [number, number],ticks?: number) => {
    ticks = ticks || 10
    let [begin,end] = [...range]
    if(begin > end)throw new Error("范围区间错误")
    let delta = end-begin
    let step = 0
    let count = [0,0];
    while(delta%1> 0.000001){
        delta*=10
        count[0]+=1
    }
    console.log(delta,count)
    delta=Math.round(delta)
    while (delta<ticks){
        delta*=ticks
        count[1]+=1
    }
    console.log(delta,count,ticks)
    delta = Math.ceil(delta/ticks)*ticks;
    step = delta/Math.pow(10,count[0])/Math.pow(ticks,count[1]+1)
    return Array.from({length:ticks+1},(_,k)=>begin+k*step)
}