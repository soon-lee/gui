import './App.css';
import {createSignal} from "solid-js";
import {EChartOption} from "echarts";
import AutoResizeChart from "@components/AutoResizeChart.tsx";
import {useI18n} from "@utils/i18n.tsx";

const App = () => {

    const {translate,setLocale} = useI18n();
    const [option, setOption] = createSignal<EChartOption>({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    })

    return (
        <>
            <AutoResizeChart option={option()}/>
            <select value="" onChange={(e)=>{
                setLocale(e.currentTarget.value);
                console.log(translate('locale.zh-Hans'), translate('locale.en-US'))
            }}>
                <option value="zh-Hans">{translate('locale.zh-Hans')}</option>
                <option value="en-US">{translate('locale.en-US')}</option>
            </select>
        </>
    );
};

export default App;
