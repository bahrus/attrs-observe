(function(){var disabled="disabled";var deeply="deeply",input="input",observe="observe",AttrsObserve=function(_XtallatX){babelHelpers.inherits(AttrsObserve,_XtallatX);function AttrsObserve(){var _this3;babelHelpers.classCallCheck(this,AttrsObserve);_this3=babelHelpers.possibleConstructorReturn(this,(AttrsObserve.__proto__||Object.getPrototypeOf(AttrsObserve)).apply(this,arguments));_this3._deeply=!1;return _this3}babelHelpers.createClass(AttrsObserve,[{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties([deeply,input,observe]);this._connected=!0;this.onPropsChange()}},{key:"disconnectedCallback",value:function disconnectedCallback(){this.disconnect()}},{key:"disconnect",value:function disconnect(){if(this._siblingObserver)this._siblingObserver.disconnect()}},{key:"onPropsChange",value:function onPropsChange(){var _this4=this;if(!this._connected||this._disabled||!this._observe||!this._input)return;var previousElement=this.getPreviousSib();if(!previousElement)return;this.disconnect();({childList:!0,subtree:this._deeply});this._siblingObserver=new MutationObserver(function(mutationsList){_this4.handleMutations(mutationsList)});this._siblingObserver.observe(previousElement,{childList:!0});this.pairDomElementsWithInput(previousElement)}},{key:"handleMutations",value:function handleMutations(mutationsList){var _this5=this;mutationsList.forEach(function(mutation){if(mutation.addedNodes){mutation.addedNodes.forEach(function(node){return _this5.pairDomElementsWithInput(node)})}})}},{key:"pairDomElementsWithInput",value:function pairDomElementsWithInput(el){if(!el.querySelectorAll)return;for(var list=el.querySelectorAll("[".concat(this._observe,"]")),i=0,ii=list.length;i<ii;i++){var _el=list[i],key=_el.getAttribute(this._observe);if(!key)continue;var val=this._input[key],typ=babelHelpers.typeof(val);switch(typ){case"undefined":continue;case"string":case"number":case"boolean":if(_el.firstChild){_el.firstChild.nodeValue=val}else{_el.innerText=val}break;case"object":Object.assign(_el,val);break;case"function":val(_el,i,this);break;}}}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case deeply:this["_"+name]=null!==newVal;break;case input:this._input=JSON.parse(newVal);break;case observe:this._observe=newVal;break;}babelHelpers.get(AttrsObserve.prototype.__proto__||Object.getPrototypeOf(AttrsObserve.prototype),"attributeChangedCallback",this).call(this,name,oldVal,newVal);this.onPropsChange()}},{key:"getPreviousSib",value:function getPreviousSib(){var prevSibling=this.previousElementSibling;while(prevSibling){var tagName=prevSibling.tagName;if(!tagName.startsWith("P-")&&"SCRIPT"!==tagName)return prevSibling;prevSibling=prevSibling.previousElementSibling}return prevSibling}},{key:"deeply",get:function get(){return this._deeply},set:function set(val){this.this.attr(deeply,val,"")}},{key:"input",get:function get(){return this._input},set:function set(val){this._input=val;if(this._siblingObserver){this.pairDomElementsWithInput(this)}else{this.onPropsChange()}}},{key:"observe",get:function get(){return this._observe},set:function set(val){this.attr(observe,val)}}],[{key:"is",get:function get(){return"attrs-observe"}},{key:"observedAttributes",get:function get(){return babelHelpers.get(AttrsObserve.__proto__||Object.getPrototypeOf(AttrsObserve),"observedAttributes",this).concat([deeply,input,observe])}}]);return AttrsObserve}(function(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){var _this;babelHelpers.classCallCheck(this,_class);_this=babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this._evCount={};return _this}babelHelpers.createClass(_class,[{key:"attr",value:function attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}},{key:"incAttr",value:function incAttr(name){var ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail){var eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this2=this;props.forEach(function(prop){if(_this2.hasOwnProperty(prop)){var value=_this2[prop];delete _this2[prop];_this2[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){this.attr(disabled,val,"")}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}(HTMLElement)),nm=AttrsObserve.is;if(!customElements.get(nm))customElements.define(nm,AttrsObserve)})();