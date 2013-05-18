skrollr-menu 0.1.0
============

skrollr plugin for hash navigation.


Documentation
=====

In case you want to use hash links, e.g. `<a href="#section-about">About</a>` you need to know the following:

* If you animate `top`, `margin-top` or anything that moves the element up/down, the browser won't be able to jump to the correct position and you may end up somewhere else
* If you're using skrollr on mobile they won't work at all, because we're not using native scrolling there

**But** we've got you covered.  Download the `dist/skrollr.menu.min.js` file and include it right after the `skrollr.min.js` file. Then you need to call `skrollr.menu.init(s)` passing the skrollr instance as first parameter and optionally some options. Here's a full example.

```js
var s = skrollr.init(/*other stuff*/);

//The options (second parameter) are all optional. The values shown are the default values.
skrollr.menu.init(s, {
	animate: true, //skrollr will smoothly animate to the new position using `animateTo`.
	duration: 500, //How long the animation should take in ms.
	easing: 'sqrt' //The easing function to use.
});
```

And in order to fix the problem with the wrong offset, you are able to specify the target scroll position right at the link, e.g.

```html
<a href="#section-about" data-menu-top="500">About</a>
```

This link will cause the page to scroll to `500`. But you should let the the href point to the actual target because if skrollr or js are disabled, the links will still work.


Changelog
====

0.1.0 (2013-05-18)
-----

* Moved skrollr-menu to a dedicated repo