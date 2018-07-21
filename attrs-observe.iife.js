
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr(name, ec[name].toString());
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
//# sourceMappingURL=xtal-latx.js.map
const deeply = 'deeply';
const input = 'input';
const observe = 'observe';
const nodes_populated = 'nodes-populated';
class AttrsObserve extends XtallatX(HTMLElement) {
    constructor() {
        super(...arguments);
        this._deeply = false;
    }
    static get is() { return 'attrs-observe'; }
    get deeply() {
        return this._deeply;
    }
    set deeply(val) {
        this.this.attr(deeply, val, '');
    }
    get input() {
        return this._input;
    }
    set input(val) {
        this._input = val;
        if (this._siblingObserver) {
            this.pairDomElementsWithInput(this);
        }
        else {
            this.onPropsChange();
        }
    }
    get observe() {
        return this._observe;
    }
    set observe(val) {
        this.attr(observe, val);
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([deeply, input, observe]);
    }
    connectedCallback() {
        this._upgradeProperties([deeply, input, observe]);
        this._connected = true;
        this.onPropsChange();
    }
    disconnectedCallback() {
        this.disconnect();
    }
    disconnect() {
        if (this._siblingObserver)
            this._siblingObserver.disconnect();
    }
    onPropsChange() {
        if (!this._connected || this._disabled || !this._observe || !this._input)
            return;
        const previousElement = this.getPreviousSib();
        if (!previousElement)
            return;
        this.disconnect();
        const config = { childList: true, subtree: this._deeply };
        this._siblingObserver = new MutationObserver((mutationsList) => {
            this.handleMutations(mutationsList);
        });
        this._siblingObserver.observe(previousElement, { childList: true });
        this.pairDomElementsWithInput(previousElement);
        this.value = previousElement;
        this.de(nodes_populated, {
            value: previousElement,
        });
    }
    handleMutations(mutationsList) {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => this.pairDomElementsWithInput(node));
                this.value = mutation.addedNodes;
                this.de(nodes_populated, {
                    value: mutation.addedNodes,
                });
            }
        });
    }
    pairDomElementsWithInput(el) {
        if (!el.querySelectorAll)
            return;
        const list = el.querySelectorAll(`[${this._observe}]`);
        for (let i = 0, ii = list.length; i < ii; i++) {
            const el = list[i];
            const key = el.getAttribute(this._observe);
            if (!key)
                continue;
            const val = this._input[key];
            const typ = typeof (val);
            switch (typ) {
                case 'undefined':
                    continue;
                case 'string':
                case 'number':
                case 'boolean':
                    if (el.firstChild) {
                        el.firstChild.nodeValue = val;
                    }
                    else {
                        el.innerText = val;
                    }
                    break;
                case 'object':
                    Object.assign(el, val);
                    break;
                case 'function':
                    val(el, i, this);
                    break;
            }
        }
    }
    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case deeply:
                this['_' + name] = newVal !== null;
                break;
            case input:
                this._input = JSON.parse(newVal);
                break;
            case observe:
                this._observe = newVal;
                break;
        }
        super.attributeChangedCallback(name, oldVal, newVal);
        this.onPropsChange();
    }
    getPreviousSib() {
        let prevSibling = this.previousElementSibling;
        while (prevSibling) {
            const tagName = prevSibling.tagName;
            if (!tagName.startsWith('P-') && tagName !== 'SCRIPT')
                return prevSibling;
            prevSibling = prevSibling.previousElementSibling;
        }
        return prevSibling;
    }
}
const nm = AttrsObserve.is;
if (!customElements.get(nm))
    customElements.define(nm, AttrsObserve);
//# sourceMappingURL=attrs-observe.js.map
    })();  
        