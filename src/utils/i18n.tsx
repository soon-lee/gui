import {createContext, createSignal} from 'solid-js';

// 创建国际化上下文
const I18nContext = createContext();

// 国际化Hook
export async function  useI18n(lang = 'en') {
    const [locale, setLocale] = createSignal(lang);

    // 加载语言文件的逻辑，这里简化处理，实际应用中可能需要异步加载
    let translations: { [x: string]: any; };
    const response = await fetch(`/assets/i18n/default.json`);
    if (response.ok) {
        translations = await response.json();
    } else {
        console.error('Failed to load translations');
    }

    function t(key: string, replacements = {}) {
        const text = translations[key];
        if (!text) return key; // 如果找不到对应的键，则返回键名本身
        return Object.entries(replacements).reduce(
            (str, [k, v]) => str.replace(new RegExp(`{${k}}`, 'g'), v),
            text
        );
    }

    return { locale, setLocale, t };
}

// 创建Provider组件
export function I18nProvider(props) {
    const i18n = useI18n(props.lang);
    return <I18nContext.Provider value={i18n}>{props.children}</I18nContext.Provider>;
}
