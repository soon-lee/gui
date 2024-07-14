import {createEffect, createSignal, onCleanup, onMount} from "solid-js";
import {EChartOption, ECharts, init as echartsInit,} from "echarts";
import {styled} from "solid-styled-components";

const AutoResizeChart = (props: {option: EChartOption}) => {

    const [container, setContainer] = createSignal<HTMLDivElement | null>(null);
    const [chart, setChart] = createSignal<ECharts | null>(null);
    const resizeObserver = new ResizeObserver(()=>{
        chart()?.resize();
    });

    const Wrapper = styled.div`
        width: 100%;
        height: 100%;
    `;
    onMount(()=>{
        if(container()){
            resizeObserver.observe(container()!);
            setChart(echartsInit(container()!, 'dark',{width: 'auto', height: 'auto'}));
        }
    });

    createEffect(()=>{
        chart()?.setOption(props.option);
    })

    onCleanup(()=>{
        resizeObserver.disconnect();
        chart()?.dispose();
    });

    return (<Wrapper ref={setContainer}></Wrapper>);
}
export default AutoResizeChart;