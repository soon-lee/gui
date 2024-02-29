/**
 * 范围接口
 */
interface Range {
    //范围的开始值
    begin:number;
    //范围的中间值
    middle:number;
    //范围的结束值
    end:number;
}

/**
 * 范围布局项接口
 */
interface RangeLayoutItem<T>{
    //范围的开始位置
    begin:number;
    //范围的结束位置
    end:number;
    //布局项
    item:T;
}


/**
 * @description 计算并返回一个环形布局信息的数组。
 * @template T - 布局元素的数据类型
 * @param {T[]} items - 需要进行环形布局的元素列表
 * @param {(item: T) => number} getMeasure - 用于获取每个元素测量值的回调函数
 * @param {number} [offset=0] - 可选偏移量，默认为0
 * @returns {RangeLayoutItem<T>[]} - 包含每个元素起始和结束角度的布局信息数组
 */
export const annulus = <T>(items: T[], getMeasure: (item: T) => number, offset?: number): RangeLayoutItem<T>[] => {
  // 计算所有元素的测量值总和
  const sum = items.reduce((sum, item) => sum + getMeasure(item), 0);
  let begin = offset || 0;
  return items.map(item => {
    // 计算当前元素所占弧度
    const amount = getMeasure(item) / sum * Math.PI * 2;
    // 计算元素的结束角度
    const end = begin + amount;
    // 创建包含当前元素布局信息的对象
    const layouts: RangeLayoutItem<T> = { begin, end, item };
    // 更新下一个元素的起始角度
    begin = end;
    return layouts;
  });
}



/**
 * @description 创建一个线性比例尺函数，用于将输入值从一个指定的区间（domain）映射到另一个指定的区间（range）。
 *
 * @param {number[]} domain - 输入值的有效区间，格式为 `[min, max]`。
 * @param {number[]} range - 输出值的有效区间，格式为 `[begin, end]`。
 *
 * @returns {Function} 线性比例尺函数，接受一个 `number` 类型的输入值 `x`，并返回相应的映射输出值。
 */
export const linearScale = (domain: [number, number], range: [number, number]): Function => {
    return (x: number) => {
        const [min, max] = domain;
        const [begin, end] = range;
        // 计算线性映射后的值
        return (x - min) / (max - min) * (end - begin) + begin;
    }
}

/**
 * @description 创建一个离散映射函数，将输入字符串数组（domain）中的元素映射到指定的数值区间（range）。
 *
 * @param {string[]} domain - 字符串数组，代表输入值的有效集合。
 * @param {number[]} range - 输出值的有效区间，格式为 `[begin, end]`。
 *
 * @returns {Function} 离散映射函数，接受一个 `string` 类型的输入值 `x`，并返回一个包含起始、中间和结束位置的对象 `Range`。
 */
export const discreteScale = (domain: string[], range: [number, number]): Function => {
    return (x: string) => {
        // 获取输入值在domain数组中的索引
        const index = domain.indexOf(x);
        const [begin, end] = range;

        // 计算映射后的起始、中间和结束位置
        const ranger: Range = {
            begin: index / domain.length * (end - begin) + begin,
            middle: (1 + 2 * index) / domain.length / 2 * (end - begin) + begin,
            end: (1 + index) / domain.length * (end - begin) + begin
        };

        // 返回包含三个位置信息的对象
        return ranger;
    }
}


/**
 * @description 计算并返回一个数组，该数组包含从给定的items数组中通过getKey函数计算出的所有唯一标识符。
 *
 * @template T - 输入数组（items）中的元素类型
 * @template K - 通过getKey函数从T类型的元素中提取出的唯一键的类型
 * @param {T[]} items - 需要进行去重处理的元素数组
 * @param {(item: T) => K} getKey - 提取元素唯一标识符的回调函数
 * @returns {K[]} - 包含所有唯一标识符的数组
 */
export const union = <T, K>(items: T[], getKey: (item: T) => K): K[] => {
    // 使用Set数据结构来过滤掉重复的键值
    return Array.from(items.reduce((picker, item) => picker.add(getKey(item)), new Set<K>()));
}
