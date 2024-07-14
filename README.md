# gui

可视化的Web和本地实现

### 分支说明

使用分支实现功能

#### main 分支

组件或图表的设计
考虑各种GUI技术，划分为web、native、mix三类。
结合前端和后端开发，从平台、程序语言或运行时、构建工具、(可视化)框架、可视化库等来描述项目的构成，每个叶子分支为单独的项目。
web方面，主要是Javascript语言，主要运行时有Bun、Deno、Node，框架有Solid、Vanilla、React、Vue、Angular，构建工具有Rsbuild、Vite、Webpack等，可视化图表库有echarts、d3、antv等，底层的图形库有pixi。
native方面，考虑c、java、rust、go，本地GUI框架、构建工具、可视化库等和程序语言耦合较深，选择性由程序生态决定，搭配较为固定。
mix大致是基于浏览器内核，服务使用本地语言、GUI使用web技术，或者部分本地语言提供和web的运行时绑定。


| 平台     | 语言/运行时        | 构建工具         |           框架            | 库       |
|--------|---------------|--------------|-------------------------|---------|
| web    | bun、deno、node | rsbuild、vite | solid、react、vue、vanilla | echarts |
| native | c             | cmake        |           gtk           |         |
| native | java          | maven、groovy |          swing          |         |
| native | rust          | cargo        |       iced、druid        |         |
| native | go            | go           |          fyne           |         |
| native | dart          | flutter      |         flutter         |         |
| mix    | electron      | npm          | solid、react、vue、vanilla |         |
| mix    | rust          | cargo        |          tauri          |         |

#### web 分支

1. solid 分支 使用Solid.js框架
2. react 分支 使用React.js框架
3. vue3 分支 使用Vue3.js框架
4. vanilla 分支 使用原生

#### native 分支

1. c 分支 使用C语言，GUI选择GTK
2. rust 分支 使用Rust语言，GUI选择Tauri
3. go 分支 使用Go语言，GUI选择fyne
