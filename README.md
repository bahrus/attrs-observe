# \<attrs-observe\>

Observe and act on the presence of an attribute

attrs-observe is a vanilla-ish web component whose primary purpose is to populate DOM with dynamic data.  You may be shocked to learn that this isn't the first such library that does this.  The size of this one is ~1.4kb minified and gzipped.  

From the point of view of using what's built into the browser, as far as dynamically populating DOM from data, skipping an early Microsoft expiriment, there's:

1)  [XSLT](https://www.w3schools.com/xml/xsl_intro.asp), supported by all browsers (including Chrome, Version 1!).
2)  The slot mechanism that comes with Shadow DOM.
3)  Hopefully soon, [template instantiation](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Template-Instantiation.md), which would likely diminish the benifit of this web component.

## Simple data populating:

```html
<div>
I am <span c="whatAmI"></span>
</div>
<attrs-observe observe="c" input='{"whatAmI": "the walrus"}'></attrs-observe>
```

produces:

```html
I am <span c="whatAmI">the walrus</span>
```


## Property setting

```html
    <div>
        <label for="joker">Don't you think the joker laughs at you</label><input id="joker" type="checkbox" c="well?">
    </div>
    <attrs-observe observe="c" input='{"well?": {"checked": true}}'></attrs-observe>
```

The input attribute / property of attrs-observe does not need to be set via an inline attribute as shown in the two previous examples.  It can be set via a framework or by some other web component.

If the input property changes, it will be reapplied to all the elements with the observed attribute.

produces a checked input.

##  Functional 

```html
<div>
I am the <span c="whatAmI"></span>
</div>
<script nomodule>
({
    whatAmI: s =>{
        s.style.color = 'yellow';
        s.innerText = 'Eggman';
    }
})
</script>
<p-d-x on="eval" to="{input.whatAmI:whatAmI"></p-d-x>
<attrs-observe observe="c"></attrs-observe>
```

Produces  

```html
<div>
    I am the <span c="whatAmI" style="color: yellow;">Eggman</span>
</div>
```

One can specify whether to monitor for new nodes recursively thoughout the DOM tree by specifying deeply:

```html
<attrs-observe observe="c" deeply></attrs-observe>
```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
