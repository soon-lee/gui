/**
 * @function loadSvgFromFile
 * @description zh-CN: 通过指定路径异步加载SVG文件，并返回其根元素作为DocumentFragment。
 *              en-US: Asynchronously loads an SVG file from the specified path and returns its root element as a DocumentFragment.
 *
 * @param {string} path - zh-CN: SVG文件的URL或路径。
 *                        en-US: The URL or path to the SVG file.
 *
 * @returns {Promise<HTMLElement>} zh-CN: 一个Promise，解析后得到SVG的根元素（即`<svg>`标签）。
 *                                 en-US: A Promise that resolves with the root SVG element (i.e., `<svg>` tag).
 */
export const loadSvgFromFile = async (path) => {
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

/**
 * @function loadThemeFromLocalStorage
 * @description zh-CN: 从本地存储加载主题设置。
 *              en-US: Loads the theme setting from local storage.
 *
 * @returns {string} zh-CN:返回当前主题设置。
 *                   en-US:Returns the current theme setting.
 */
export const loadThemeFromLocalStorage = () => {
    let theme = localStorage.getItem("nsp-ux-theme");
    if (!theme) {
        theme = "light";
    }
    return theme;
}

/**
 * @function changeThemeToLocalStorageAndHtml
 * @description zh-CN: 将指定的主题设置保存到本地存储，并同步更新页面根元素的"data-theme"属性以应用新主题。
 *              en-US: Saves the specified theme setting to local storage and synchronously updates the "data-theme" attribute of the root HTML element to apply the new theme.

 * @param {string} theme - zh-CN: 要保存的主题名称（如 "light" 或 "dark"）。
 *                         en-US: The theme name to save (e.g., "light" or "dark"), which will be applied to the root HTML element's "data-theme" attribute.
 */
export const changeThemeToLocalStorageAndHtml = theme => {
    const cacheTheme = loadThemeFromLocalStorage();
    const htmlTheme = document.documentElement.dataset["theme"];
    if(!htmlTheme||htmlTheme!==theme){
        document.documentElement.dataset["theme"] =  theme;
    }
    if (cacheTheme !== theme) {
        localStorage.setItem("nsp-ux-theme", theme);
    }
}

/**
 * @function loadLocaleFromLocalStorageAndBrowser
 * @description zh-CN: 从本地存储加载语言设置。如果本地存储中没有设置，则使用浏览器的`navigator.language`属性作为默认语言。
 *              en-US: Loads the language setting from local storage. If no setting is found in local storage, falls back to the browser's `navigator.language` property as the default language.

 * @returns {string} - zh-CN: 返回当前语言设置。
 *                     en-US: Returns the current language setting.
 */
export const loadLocaleFromLocalStorageAndBrowser = () => {
    let locale = localStorage.getItem("nsp-ux-locale");
    if (!locale) {
        locale = navigator.language || "zh-CN";
    }
    return locale;
}

/**
 * @function changeLocaleToLocalStorageAndHtml
 * @description zh-CN: 将指定的语言设置保存到本地存储，并同步更新页面根元素的"lang"属性以应用新语言。
 *              en-US: Saves the specified language setting to local storage and synchronously updates the "lang" attribute of the root HTML element to apply the new language.

 * @param {string} locale - zh-CN: 要保存的语言代号（如 "zh-CN" 或 "en-US"）。
 *                          en-US: The language code to save (e.g., "zh-CN" or "en-US"), which will be applied to the
 *                         root HTML element's "lang" attribute.
 */
export const changeLocaleToLocalStorageAndHtml = locale => {
    const cacheLocale = loadLocaleFromLocalStorageAndBrowser();
    const htmlLocale = document.documentElement.getAttribute("lang");
    if(!htmlLocale||htmlLocale!==locale){
        document.documentElement.setAttribute("lang", locale);
    }
    if (cacheLocale !== locale) {
        localStorage.setItem("nsp-ux-locale", locale);
    }
}



