import {createFragment, createStyle} from "../utils/dom.js";
import {loadSvg} from "../utils/file.js";

export class UxIcon extends HTMLElement {
    static cacheIcon = {};

    constructor(props) {
        super();
        this.attachShadow({mode: "open"});
        this.addEventListener("newUxIcon", event => {
            !this.dataset["icon"] && (this.dataset["icon"] = event["detail"] && event["detail"]["icon"] || "");
        });
        this.dispatchEvent(new CustomEvent("newUxIcon", {
            detail: {icon: props && props["icon"]}
        }));
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
            UxIcon.cacheIcon[icon] = await loadSvg(`/assets/images/icons/${icon}.svg`);
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
            padding: 5px;
            border: 1px solid var(--color-text-base);
            border-radius: var(--border-radius);
            background-color: var(--color-bg-container);
            display: block;
            box-sizing: border-box;
            width: 30px;
            height: 30px;
        }
        svg{
            width: 100%;
            height: 100%;
            path{
                fill: var(--color-text-base);
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