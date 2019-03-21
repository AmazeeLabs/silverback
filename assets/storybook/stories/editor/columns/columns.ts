import {
    css,
    LitElement,
    TemplateResult,
    html,
    customElement
} from "lit-element";

export default class Columns extends LitElement {
    static get styles() {
        return css`
        :host {
          display: flex;
          width: 100%;
        }
        div:not(:last-child) {
          width: 100%;
          margin-right: 2em;
        }
        `;
    }

    protected render(): TemplateResult | void {
        return html`
        <div><slot name="left"/></div>
        <div><slot name="right"/></div>
        `;
    }
}

customElement('sb-columns')(Columns);
