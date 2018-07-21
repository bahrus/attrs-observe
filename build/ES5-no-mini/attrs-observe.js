import { XtallatX } from "./node_modules/xtal-latx/xtal-latx.js";
var deeply = 'deeply';
var input = 'input';
var observe = 'observe';
var nodes_populated = 'nodes-populated';

var AttrsObserve =
/*#__PURE__*/
function (_XtallatX) {
  babelHelpers.inherits(AttrsObserve, _XtallatX);

  function AttrsObserve() {
    var _this;

    babelHelpers.classCallCheck(this, AttrsObserve);
    _this = babelHelpers.possibleConstructorReturn(this, (AttrsObserve.__proto__ || Object.getPrototypeOf(AttrsObserve)).apply(this, arguments));
    _this._deeply = false;
    return _this;
  }

  babelHelpers.createClass(AttrsObserve, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this._upgradeProperties([deeply, input, observe]);

      this._connected = true;
      this.onPropsChange();
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.disconnect();
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      if (this._siblingObserver) this._siblingObserver.disconnect();
    }
  }, {
    key: "onPropsChange",
    value: function onPropsChange() {
      var _this2 = this;

      if (!this._connected || this._disabled || !this._observe || !this._input) return;
      var previousElement = this.getPreviousSib();
      if (!previousElement) return;
      this.disconnect();
      var config = {
        childList: true,
        subtree: this._deeply
      };
      this._siblingObserver = new MutationObserver(function (mutationsList) {
        _this2.handleMutations(mutationsList);
      });

      this._siblingObserver.observe(previousElement, {
        childList: true
      });

      this.pairDomElementsWithInput(previousElement);
      this.value = previousElement;
      this.de(nodes_populated, {
        value: previousElement
      });
    }
  }, {
    key: "handleMutations",
    value: function handleMutations(mutationsList) {
      var _this3 = this;

      mutationsList.forEach(function (mutation) {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach(function (node) {
            return _this3.pairDomElementsWithInput(node);
          });
          _this3.value = mutation.addedNodes;

          _this3.de(nodes_populated, {
            value: mutation.addedNodes
          });
        }
      });
    }
  }, {
    key: "pairDomElementsWithInput",
    value: function pairDomElementsWithInput(el) {
      if (!el.querySelectorAll) return;
      var list = el.querySelectorAll("[".concat(this._observe, "]"));

      for (var i = 0, ii = list.length; i < ii; i++) {
        var _el = list[i];

        var key = _el.getAttribute(this._observe);

        if (!key) continue;
        var val = this._input[key];
        var typ = babelHelpers.typeof(val);

        switch (typ) {
          case 'undefined':
            continue;

          case 'string':
          case 'number':
          case 'boolean':
            if (_el.firstChild) {
              _el.firstChild.nodeValue = val;
            } else {
              _el.innerText = val;
            }

            break;

          case 'object':
            Object.assign(_el, val);
            break;

          case 'function':
            val(_el, i, this);
            break;
        }
      }
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldVal, newVal) {
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

      babelHelpers.get(AttrsObserve.prototype.__proto__ || Object.getPrototypeOf(AttrsObserve.prototype), "attributeChangedCallback", this).call(this, name, oldVal, newVal);
      this.onPropsChange();
    }
  }, {
    key: "getPreviousSib",
    value: function getPreviousSib() {
      var prevSibling = this.previousElementSibling;

      while (prevSibling) {
        var tagName = prevSibling.tagName;
        if (!tagName.startsWith('P-') && tagName !== 'SCRIPT') return prevSibling;
        prevSibling = prevSibling.previousElementSibling;
      }

      return prevSibling;
    }
  }, {
    key: "deeply",
    get: function get() {
      return this._deeply;
    },
    set: function set(val) {
      this.this.attr(deeply, val, '');
    }
  }, {
    key: "input",
    get: function get() {
      return this._input;
    },
    set: function set(val) {
      this._input = val;

      if (this._siblingObserver) {
        this.pairDomElementsWithInput(this);
      } else {
        this.onPropsChange();
      }
    }
  }, {
    key: "observe",
    get: function get() {
      return this._observe;
    },
    set: function set(val) {
      this.attr(observe, val);
    }
  }], [{
    key: "is",
    get: function get() {
      return 'attrs-observe';
    }
  }, {
    key: "observedAttributes",
    get: function get() {
      return babelHelpers.get(AttrsObserve.__proto__ || Object.getPrototypeOf(AttrsObserve), "observedAttributes", this).concat([deeply, input, observe]);
    }
  }]);
  return AttrsObserve;
}(XtallatX(HTMLElement));

var nm = AttrsObserve.is;
if (!customElements.get(nm)) customElements.define(nm, AttrsObserve); //# sourceMappingURL=attrs-observe.js.map