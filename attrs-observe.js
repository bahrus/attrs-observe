import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

/**
 * `attrs-observe`
 * Observe presence of list of attributes
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class AttrsObserve extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'attrs-observe',
      },
    };
  }
}

window.customElements.define('attrs-observe', AttrsObserve);
