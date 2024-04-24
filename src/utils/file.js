/**
 * @function loadSvg
 * @description zh-CN: 通过指定路径异步加载SVG文件，并返回其根元素作为DocumentFragment。
 *              en-US: Asynchronously loads an SVG file from the specified path and returns its root element as a DocumentFragment.
 *
 * @param {string} path - zh-CN: SVG文件的URL或路径。
 *                         en-US: The URL or path to the SVG file.
 *
 * @returns {Promise<HTMLElement>} zh-CN: 一个Promise，解析后得到SVG的根元素（即`<svg>`标签）。
 *                                       en-US: A Promise that resolves with the root SVG element (i.e., `<svg>` tag).
 */
export const loadSvg = async (path) => {
    const response = await fetch(path);
    let text = "";
    if (response.ok) {
        text = await response.text();
    } else {
        text = "<svg><text font-size='8'>Err</text></svg>";
        console.log(`Failed to load SVG: ${response.status} ${response.statusText}`);
    }
    const parser = new DOMParser();
    const svgDocument = parser.parseFromString(text, 'image/svg+xml');
    return svgDocument.documentElement;
};
