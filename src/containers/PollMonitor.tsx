import {AnnulusPlot} from "../charts/AnnulusPlot.tsx";
import {PlotConfig, PlotData, PlotItem} from "../models/plot.ts";
import {CompositePlot} from "../charts/CompositePlot.tsx";
import {createEffect, createSignal } from "solid-js";

export const PollMonitor = () => {
    let container: HTMLDivElement | undefined = undefined;
    const annulusInItems = [{label: 'label1', value: 2}, {label: 'label2', value: 15}, {label: 'label3', value: 38}]
    const sum = annulusInItems.reduce((sum, item) => sum + item.value, 0)
    const annulusItems = annulusInItems.map(item => new PlotItem({
        label: item.label, value: item.value, rate: item.value / sum
    }))

    const compositeInItems = [{time: '01', label: 'label1', value: 2}, {
        time: '01',
        label: 'label2',
        value: 15
    }, {time: '02', label: 'label1', value: 33}, {time: '02', label: 'label2', value: 31}, {
        time: '02', label: 'label3', value: 318
    }, {time: '03', label: 'label2', value: 43}, {time: '03', label: 'label3', value: 44}, {
        time: '04',
        label: 'label1',
        value: 27
    }, {time: '04', label: 'label2', value: 66}, {
        time: '04', label: 'label3', value: 231
    }, {time: '05', label: 'label1', value: 164}, {time: '05', label: 'label2', value: 79}, {
        time: '05', label: 'label3', value: 167
    }, {time: '06', label: 'label1', value: 77}, {time: '06', label: 'label3', value: 11}]
    const summers = compositeInItems.reduce((summer, item) => {
        const sum = summer.get(item.time)
        if (sum) {
            summer.set(item.time, sum + item.value)
        } else {
            summer.set(item.time, item.value)
        }
        return summer
    }, new Map<string, number>())
    const compositeItems = compositeInItems.map(item => new PlotItem({
        time: item.time, label: item.label, value: item.value, rate: item.value / (summers.get(item.time) || 0)
    }))
    const [annulusData] = createSignal(new PlotData({
        items: annulusItems,
        dimension: "label",
        measure: "value",
        rate: "rate"
    }))
    const [annulusConfig, setAnnulusConfig] = createSignal(new PlotConfig({
        width: 300, height: 200, margin: [30,  20,  0,  20], colors: {
            label1: "#ae2400", label2: "#5fd", label3: "#c36"
        }
    }))
    const [compositeData] = createSignal(new PlotData({
        items: compositeItems,
        dimension: "time",
        group: "label",
        measure: "value",
        rate: "rate",
        sort: ["label3", "label2", "label1"]
    }))
    const [compositeConfig,setCompositeConfig] = createSignal(new PlotConfig({
        width: 300, height: 200, margin: [30,  40,  40,  40], colors: {
            label1: "#ae2400", label2: "#5fd", label3: "#c36"
        }
    }))

    createEffect(() => resizePlot())

    const resizeAnnulus = () => setAnnulusConfig(prevState => {
        if (container) {
            return new PlotConfig({
                ...prevState,
                width: container.clientWidth, height: container.clientHeight * 0.4
            })
        } else {
            return prevState
        }
    })
    const resizeComposite = () => setCompositeConfig(prevState => {
        if (container) {
            return new PlotConfig({
                ...prevState,
                width: container.clientWidth, height: container.clientHeight * 0.4
            })
        } else {
            return prevState
        }
    })
    const resizePlot = () => {
        resizeAnnulus()
        resizeComposite()
    }

    createEffect(()=>{
        window.addEventListener("resize", resizePlot)
        return ()=>window.removeEventListener("resize", resizePlot)
    })

    return (<div ref={container} class='poll-monitor'>
            <AnnulusPlot data={annulusData()} config={annulusConfig()}/>
            <CompositePlot data={compositeData()} config={compositeConfig()}/>
        </div>);
}