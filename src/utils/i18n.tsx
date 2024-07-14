import {createContext, createSignal, JSXElement, useContext} from "solid-js";

import zhHansTranslation from '@assets/locales/zh-Hans.json'
import enUSTranslation from '@assets/locales/en-US.json'
import {getLocalLocale, setLocalLocale} from "@utils/storage.ts";

interface I18nContextType {
    locale: ()=>string;
    setLocale: (locale: string) => void;
    translations: { [key: string]: any };
}

const I18nContext = createContext<I18nContextType>();

export const I18nProvider = (props: { children: JSXElement }) => {

    const [locale, setLocale] = createSignal<string>(getLocalLocale());
    const [translations] = createSignal({
        'zh-Hans': zhHansTranslation,
        'en-US': enUSTranslation,
    });

    return (
        <I18nContext.Provider value={{locale: locale, setLocale, translations: translations()}}>
            {props.children}
        </I18nContext.Provider>
    );

}
export const useI18n = () => {
    const context = useContext(I18nContext) || {
        locale: ()=>'zh-Hans',
        setLocale: () => {
        },
        translations: {},
    };
    const translate = (key: string) => {
        return context.translations[context.locale()][key] || key;
    }
    return {
        translate, setLocale: (locale: string) => {
            context.setLocale(locale);
            setLocalLocale(locale);
        }
    };
}