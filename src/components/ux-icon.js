import {createFragment, createStyle} from "../utils/dom.js";
import {loadSvgFromFile} from "../utils/inout.js";

export class UxIcon extends HTMLElement {
    static cacheIcon = {};

    constructor(props) {
        super();
        this.attachShadow({mode: "open"});
        this.dataset["icon"] = props && props["icon"] || "";
    }

    connectedCallback() {
        this.places().then(() => {
            this.listeners();
        });
    }

    async fromCacheIcon(icon) {
        let exists = false;
        for (const key of Object.keys(UxIcon.cacheIcon)) {
            if (key === icon) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            UxIcon.cacheIcon[icon] = await loadSvgFromFile(`/assets/images/icons/${icon}.svg`);
        }
        return UxIcon.cacheIcon[icon];
    }

    async changeIcon(icon){
        const cacheIcon = await this.fromCacheIcon(icon);
        this.shadowRoot.replaceChild(cacheIcon,this.svgIcon);
        this.svgIcon = cacheIcon;
    }

    async places() {
        const style = `
        :host{
            border: 1px solid var(--color-text-secondary);
            border-radius: var(--border-radius);
            background-color: var(--color-bg-container);
            display: block;
            width: calc(100% - 2px);
            height: calc(100% - 2px);
        }
        :host(:hover){
            border-color: var(--color-text);
        }
        svg{
            width: calc(100% - 10px);
            height: calc(100% - 10px);
            padding: 5px;
            path{
                fill: var(--color-text-secondary);
            }
        }
        svg:hover{
            path{
                fill: var(--color-text);
            }
        }
        `;
        this.svgIcon = await this.fromCacheIcon(this.dataset["icon"]);
        this.shadowRoot.append(createFragment([
            createStyle(style),
            this.svgIcon
        ]));
    }

    listeners() {

    }
}

customElements.define("ux-icon", UxIcon);