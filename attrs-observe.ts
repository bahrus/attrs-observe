import {XtallatX} from 'xtal-latx/xtal-latx.js';

const deep = 'deep';
const input = 'input';
const observe = 'observe';
class AttrsObserve extends XtallatX(HTMLElement){
    static get is(){return 'attrs-observe';}
    _deep = false;
    get deep(){
        return this._deep;
    }
    set deep(val){
        this.this.attr(deep, val, '');
    }
    _input!: {[key: string]: any};
    get input(){
        return this._input;
    }
    set input(val){
        this._input = val;
        this.onPropsChange();
    }
    _observe!: string;
    get observe(){
        return this._observe;
    }
    set observe(val){
        this.attr(observe, val);
    }
    static get observedAttributes(){
        return super.observedAttributes.concat([deep, input, observe]);
    }
    _connected!: boolean;
    connectedCallback(){
        this._upgradeProperties([deep, input, observe]);
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
        const config = { childList: true, subtree: this._deep} as MutationObserverInit;
        this._siblingObserver =  new MutationObserver((mutationsList: MutationRecord[]) =>{
            this.handleMutations(mutationsList);
        });
        this._siblingObserver.observe(previousElement,  { childList: true});
        this.pairDomElementsWithInput(previousElement);
    }
    handleMutations(mutationsList: MutationRecord[]){
        mutationsList.forEach(mutation =>{
            if(mutation.addedNodes){
                mutation.addedNodes.forEach(node => this.pairDomElementsWithInput(node as HTMLElement));
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
                    (<any>el)[key] = val;
                    break;
                case 'function':
                    val(el, i, this);
                    break;
            }
            
        }
    }
    attributeChangedCallback(name: string, oldVal: string, newVal: string){
        switch(name){
            case deep:
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