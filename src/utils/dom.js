/**
 * @function createFragment
 * @description zh-CN: 创建一个包含指定子节点的文档片段（DocumentFragment）。
 *              en-US: Create a DocumentFragment containing the specified child nodes.
 *
 * @param {Node[]} children - zh-CN: 要添加到文档片段的子节点数组。
 *                            en-US: An array of child nodes to be added to the DocumentFragment.
 *
 * @returns {DocumentFragment} zh-CN: 包含指定子节点的新文档片段。
 *                             en-US: A new DocumentFragment containing the specified child nodes.
 */
export const createFragment = (children) => {
    const fragment = new DocumentFragment();
    children.forEach((child) => {
        fragment.append(child);
    });
    return fragment;
};

/**
 * @function createStyle
 * @description zh-CN: 通过指定的CSS文本创建一个新的`<style>`元素，并返回该元素。
 *              en-US: Creates a new `<style>` element with the specified CSS text and returns it.
 *
 * @param {string} text - zh-CN: 要应用到新创建的`<style>`元素的CSS文本。
 *                         en-US: CSS text to be applied to the newly created `<style>` element.
 *
 * @returns {HTMLStyleElement} zh-CN: 新创建并包含指定CSS文本的`<style>`元素。
 *                              en-US: The newly created `<style>` element containing the specified CSS text.
 */
export const createStyle = (text) => {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css"); // 注意：此处应该是"type"，不是"types"
    style.textContent = text;
    return style;
};
export const changeTheme = theme=>{
    document.documentElement.setAttribute("data-theme",theme);
}