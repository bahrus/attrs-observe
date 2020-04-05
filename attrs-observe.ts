import {define} from 'trans-render/define.js';
import {hydrate} from 'trans-render/hydrate.js';
import {XtallatX} from 'xtal-element/xtal-latx.js';

const deeply = 'deeply';
const input = 'input';
const observe = 'observe';
const nodes_populated = 'nodes-populated';
class AttrsObserve extends XtallatX(HTMLElement){
    static get is(){return 'attrs-observe';}
    _deeply = false;
    get deeply(){
        return this._deeply;
    }
    set deeply(val){
        this.this.attr(deeply, val, '');
    }
    _input!: {[key: string]: any};
    get input(){
        return this._input;
    }
    set input(val){
        this._input = val;
        if(this._siblingObserver){
            this.pairDomElementsWithInput(<any>this as HTMLElement);
        }else{
            this.onPropsChange();
        }
        
    }
    _observe!: string;
    get observe(){
        return this._observe;
    }
    set observe(val){
        this.attr(observe, val);
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([deeply, input, observe]);
    }
    _connected!: boolean;
    connectedCallback(){
        this._upgradeProperties([deeply, input, observe]);
        this._connected = true;
        this.onPropsChange();
    }
    disconnectedCallback(){
        this.disconnect();
    }
    disconnect(){
        if(this._siblingObserver) this._siblingObserver.disconnect();
    }
    _siblingObserver!: MutationObserver;
    onPropsChange(){
        if(!this._connected || this._disabled || !this._observe || !this._input) return;
        const previousElement = this.getPreviousSib();
        if(!previousElement) return;
        this.disconnect();
        const config = { childList: true, subtree: this._deeply} as MutationObserverInit;
        this._siblingObserver =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            this.handleMutations(mutationsList);
        });
        this._siblingObserver.observe(previousElement,  { childList: true});
        this.pairDomElementsWithInput(previousElement);
        this.value = previousElement;
        this.de(nodes_populated, {
            value: previousElement,
        });
    }
    handleMutations(mutationsList: MutationRecord[]){
        mutationsList.forEach(mutation =>{
            if(mutation.addedNodes){
                mutation.addedNodes.forEach(node => this.pairDomElementsWithInput(node as HTMLElement));
                this.value = mutation.addedNodes;
                this.de(nodes_populated, {
                    value: mutation.addedNodes,
                });
            }
        })
    }

    pairDomElementsWithInput(el: HTMLElement){
        if(!el.querySelectorAll) return;
        const list = el.querySelectorAll(`[${this._observe}]`);
        for(let i = 0, ii = list.length; i < ii; i++){
            const el = list[i] as HTMLElement;
            const key = el.getAttribute(this._observe);
            if(!key) continue;
            const val = this._input[key];
            const typ = typeof(val);
            switch(typ){
                case 'undefined':
                    continue;
                case 'string':
                case 'number':
                case 'boolean':
                    if(el.firstChild) {
                        el.firstChild.nodeValue = val;
                    }else{
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
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
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

    getPreviousSib() : HTMLElement{
        let prevSibling = <any>this.previousElementSibling as HTMLElement;
        while(prevSibling){
            const tagName = prevSibling.tagName;
            if(!tagName.startsWith('P-') && tagName!=='SCRIPT') return prevSibling;
            prevSibling = prevSibling.previousElementSibling as HTMLElement;
        }
        return <any>prevSibling as HTMLElement;
    }
}
const nm = AttrsObserve.is;
if(!customElements.get(nm)) customElements.define(nm, AttrsObserve);