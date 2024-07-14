### 技术栈

| 技术栈                     | 作用            | 选择原因          | 其他            |
|-------------------------|---------------|---------------|---------------|
| Bun                     | JavaScript运行时 | 快             | Node、Deno     |
| Rsbuild                 | Web构建工具       | rust，构建快      | Vite          |
| Solid                   | Web框架         | 社区不活跃但高效率     | React、Vue     |
| TypeScript              | 程序语言          | 类型安全          | 不推荐Javascript |
| echarts                 | 可视化图表库        | 开源            | d3、g2         |
| solid-styled-components | CSS-in-js     | 样式在js中，动态样式简单 | emotion       |

### 配置favicon、路径别名

- 配置favicon
  `rsbuild.config.ts`中`html.favicon`配置favicon路径
- 配置路径别名
    - 在`rsbuild.config.ts`中`resolve.alias`配置路径别名
      ```rsbuild.config.ts
      source:{
        alias: {
          '@assets': './src/assets',
          '@components': './src/components',
          '@utils': './src/utils'
        },
      },
      ```
  - 在`tsconfig.json`中`compilerOptions.paths`配置路径别名
    ```tsconfig.json
    {
      "compilerOptions": {
        "paths": {
          "@assets/*": ["./src/assets/*"],
          "@components/*": ["./src/components/*"],
          "@utils/*": ["./src/utils/*"]
        }
      }
    }
    ```
### AutoResizeChart组件
自适应占满父组件，创建ECharts图表实例
`chart`为Echarts图表实例
`container`为Echarts图表实例父容器
`resizeObserver`用来监视父容器尺寸变化，并调用resize调整Echarts图表实例尺寸
在`onMounted`中创建Echarts图表实例，初始化图表
在`onCleanUp`中销毁Echarts图表实例，关闭`resizeObserver`
其中通过`props.options`传入Echarts图表配置项`

### i18n配置
1. 声明i18n结构类型
    ```ts
    interface I18nContextType {
        locale: ()=>string; // Accessor<>()，响应式获取当前语言
        setLocale: (locale: string) => void; // Setter<>()，响应式更新当前语言
        translations: { [key: string]: any }; // Accessor<>()，响应式获取当前语言翻译资源
    }
    ```
2. 创建i18n实例
使用`createContect`来声明i18n实例，可以不初始化
3. 创建i18n provider
`locale`保存语言，默认从`localStorage`中获取，然后是缺省语言`zh-Hans`
`setLocale`更新语言同时更新`translations`语言翻译资源
`translations`保存语言翻译资源
4. 导出i18n实例
`setLocale`用于更新语言同时同步到`localStorage`
`translate`用于翻译，如果翻译资源不存在，则返回原字符串
