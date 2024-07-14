export const getLocalLocale = () => {
    return localStorage.getItem('nsp-i18n-locale') || 'zh-Hans';
}
export const setLocalLocale = (locale: string) => {
    localStorage.setItem('nsp-i18n-locale', locale);
}