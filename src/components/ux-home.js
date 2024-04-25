import {createALink, createFragment, createSpan, createStyle} from "../utils/dom.js";
import {UxIcon} from "./ux-icon.js";
import {loadSvgFromFile} from "../utils/inout.js";

export class UxHome extends HTMLElement{
    constructor(props) {
        super();
        this.attachShadow({mode:"open"});
        this.dataset["home"] = props&&props["home"] || "/";
    }
    connectedCallback(){
        this.places().then();
    }
    async places(){
        const a = document.createElement("a");
        a.href = this.dataset["home"];
        a.append(new UxIcon());
        a.append(document.createElement("span"))
        const style = `
        :host{
            cursor: pointer;
            display: block;
            width: 120px;
            height: 32px;
        }
        a{
            text-decoration: none;
            display: inline-flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-text);
            font-size: var(--font-size);
            font-weight: bolder;
        }
        a:hover{
            color: var(--color-text-tertiary);
            svg{
                opacity: 0.8;
            }
        }
        svg{
            width: 30px;
            height: 30px;
        }
        `;
        this.shadowRoot.append(createFragment([
            createStyle(style),
            createALink(this.dataset["home"],"hover",[
                await loadSvgFromFile("/assets/images/icons/javascript.svg"),
                createSpan("Javascript")
            ])
        ]));
    }
}
customElements.define("ux-home",UxHome);