import {createFragment, createStyle} from "../utils/dom.js";

export class UxCatalog extends HTMLElement {
    constructor(props) {
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.places();
    }
    places(){
        const style = ``;
        this.shadowRoot.append(createFragment([
            createStyle(style),

        ]));
    }
}

customElements.define("ux-catalog", UxCatalog);