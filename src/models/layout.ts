import {PlotData, PlotItem} from "./plot.ts";

export class AnnulusPlotItem{
    beginAngle: number;
    endAngle: number;
    dimension: string;
    measure: string;
    data: PlotItem;
    constructor (beginAngle: number, endAngle: number, dimension: string, measure: string, data: PlotItem) {
        this.beginAngle = beginAngle;
        this.endAngle = endAngle;
        this.dimension = dimension;
        this.measure = measure;
        this.data = data;
    }
}

export const annulus = (data: PlotData, offset?: number) => {
    let begin = offset || 0;
    return data.items.map(item => {
        const amount = item.getNumber(data.rate) * Math.PI * 2;
        const end = begin + amount;
        const arc = new AnnulusPlotItem(
            begin,
                 end,
                 item.getString(data.dimension),
                 item.getString(data.measure),
                 item
        )
        begin = end;
        return arc
    })
}

export const linear = (domain:[number,number],range:[number,number])=>{
    return (x:number) => {
        const [min,max] = domain;
        const [begin,end] = range;
        return (x-min)/(max-min)*(end-begin)+begin;
    }
}
export const discrete = (domain:string[],range:[number,number])=>{
    return (x:string) => {
        const index = domain.indexOf(x);
        const [begin,end] = range;
        return [index/domain.length*(end-begin)+begin,(1+index)/domain.length*(end-begin)+begin];
    }
}

export const dimensions = (data: PlotData)=>{
    return Array.from(data.items.reduce((set,item)=>set.add(item.getString(data.dimension)),new Set<string>()))
}