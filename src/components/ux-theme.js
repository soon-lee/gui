import { createFragment, createStyle} from "../utils/dom.js";
import {changeThemeToLocalStorageAndHtml, loadThemeFromLocalStorage} from "../utils/inout.js";
import {UxIcon} from "./ux-icon.js";

export class UxTheme extends HTMLElement {
    constructor(props) {
        super();
        this.attachShadow({mode: "open"});
        this.dataset["theme"] = props&&props["theme"] || loadThemeFromLocalStorage();
        changeThemeToLocalStorageAndHtml(this.dataset["theme"]);
    }

    async places() {
        const style = `
        :host{
            display: block;
            width: 30px;
            height: 30px;
        }
        `;
        this.uxIcon = new UxIcon({icon: this.dataset["theme"]});
        this.shadowRoot.append(createFragment([
            createStyle(style),
            this.uxIcon
        ]));
    }

    listeners() {
        this.uxIcon.addEventListener("click", () => {
            this.dataset["theme"] = this.dataset["theme"] === "light"?"dark":"light";
            this.uxIcon.dataset["icon"] = this.dataset["theme"];
            this.uxIcon.changeIcon(this.dataset["theme"]).then(()=>{
                changeThemeToLocalStorageAndHtml(this.dataset["theme"]);
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