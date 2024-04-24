import {changeTheme, createFragment, createStyle} from "../utils/dom.js";
import {UxIcon} from "./ux-icon.js";

export class UxTheme extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
    }

    async places() {
        const style = `
        `;
        this.uxIcon = new UxIcon({icon: "light"});
        this.shadowRoot.append(createFragment([
            createStyle(style),
            this.uxIcon
        ]));
    }

    listeners() {
        this.uxIcon.addEventListener("click", () => {
            this.uxIcon.dataset["icon"] = (this.uxIcon.dataset["icon"] === "dark" ? "light" : "dark");
            this.uxIcon.changeIcon(this.uxIcon.dataset["icon"]).then(()=>{
                changeTheme(this.uxIcon.dataset["icon"]);
            });
        });
    }

    connectedCallback() {
        this.places().then(() => {
            this.listeners();
        })
    }
}

customElements.define("ux-theme", UxTheme);