import {createFragment, createStyle} from "../utils/dom.js";
import {changeLocaleToLocalStorageAndHtml, loadLocaleFromLocalStorageAndBrowser} from "../utils/inout.js";
import {UxIcon} from "./ux-icon.js";

export class UxLocale extends HTMLElement {
    static LOCALE_WORD_MAP = {
        "zh-CN": "中文（简体）",
        "en-US": "English(US)",
        "es-ES": "Español(ES)",
        "ar-AE": "بالعربية(AE)",
        "fr-FR": "Français(FR)",
        "ru-RU": "Русский язык(RU)",
        "hi-IN": "इंडी(IN)"
    }

    constructor(props) {
        super();
        this.attachShadow({mode: "open"});
        this.dataset["locale"] = props && props["locale"] || loadLocaleFromLocalStorageAndBrowser();
        changeLocaleToLocalStorageAndHtml(this.dataset["locale"]);
    }

    connectedCallback() {
        this.places();
    }

    places() {
        const style = `
        :host{
            display: block;
            width: 124px;
            height: 32px;
            position: relative;
            font-size: var(--font-size-small);
            font-weight: bolder;
        }
        ux-icon{
            width: 30px;
            height: 30px;
            margin: 0 47px;
        }
        ul{
            position: absolute;
            padding: 0;
            margin: 0;
            border: 1px solid var(--color-text-secondary);
            border-radius: var(--border-radius);
        }
        ul:hover{
            border-color: var(--color-text);
        }
        .hidden{
            display: none;
        }
        li{
            display: block;
            padding: 5px;
            margin: 5px;
            color: var(--color-text-secondary);
            position: relative;
            transition: background-color 0.2s ease;
            white-space: nowrap;
        }
        .active{
            color: var(--color-text);
        }
        li:hover{
            color: var(--color-text);
        }
        li::before{
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--color-text-tertiary);
            pointer-events: none;
            border-radius: var(--border-radius);
            opacity: 0;
        }
        li:hover::before{
            opacity: var(--opacity);
        }
        `;
        const icon = new UxIcon({icon: "i18n"});
        const ul = document.createElement("ul");
        ul.classList.toggle("hidden");
        Object.keys(UxLocale.LOCALE_WORD_MAP).forEach((key, index) => {
            const li = document.createElement("li");
            li.dataset["locale"] = key;
            li.textContent = UxLocale.LOCALE_WORD_MAP[key];
            li.addEventListener("click", this.listeners("li-click", li));
            if (key === this.dataset["locale"]) {
                this.activeLocale = li;
                this.activeLocale.classList.toggle("active");
            }
            ul.append(li);
        });
        icon.addEventListener("mouseover", this.listeners("ul-hover", ul));
        icon.addEventListener("mouseout", this.listeners("ul-hover", ul));
        ul.addEventListener("mouseover", this.listeners("ul-hover", ul));
        ul.addEventListener("mouseout", this.listeners("ul-hover", ul));
        this.shadowRoot.append(createFragment([
            createStyle(style),
            icon,
            ul
        ]));
    }

    listeners(call, bind) {
        switch (call) {
            case "ul-hover":
                return () => {
                    bind.classList.toggle("hidden");
                }
            case "li-click":
                return () => {
                    changeLocaleToLocalStorageAndHtml(bind.dataset["locale"]);
                    this.activeLocale.classList.toggle("active");
                    bind.classList.toggle("active");
                    this.activeLocale = bind;
                    bind.parentElement.classList.toggle("hidden");
                }
        }
    }
}

customElements.define("ux-locale", UxLocale);