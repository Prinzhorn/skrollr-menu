skrollr-menu 0.1.5
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
	//skrollr will smoothly animate to the new position using `animateTo`.
	animate: true,

	//The easing function to use.
	easing: 'sqrt',

	//How long the animation should take in ms.
	duration: function(currentTop, targetTop) {
		//By default, the duration is hardcoded at 500ms.
		return 500;

		//But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
		//return Math.abs(currentTop - targetTop) * 10;
	},
});
```

And in order to fix the problem with the wrong offset, you are able to specify the target scroll position right at the link, e.g.

```html
<a href="#section-about" data-menu-top="500">About</a>
```

This link will cause the page to scroll to `500`. But you should let the the href point to the actual target because if skrollr or js are disabled, the links will still work.


Offsets
-----

When you don't want the target element to be perfectly aligned with the top of the viewport (that's what the browser does), then you can use `data-menu-offset` on the target element to specify an offset from the top.

For example when you have a fixed navigation with a height of `100px`, then you probably want skrollr-menu to put the element at least 100px from the top in order to not disappear behind the nav.

```html
<section id="kittens" data-menu-offset="-100">
    <h1>If it fits, I sits</h1>
    <p>Some text about felines (the internet loves felines).</p>
</section>
```

Note how the offset is negative, because we want to scroll down `100px` **less** than normal. Or in other words, we want to stop `100px` **before** the element. Positive values work the opposite way (scroll farther than usual).


Changelog
====

0.1.5 (2013-07-13)
-----

* The `duration` option now also accepts a function to dynamically calculate the duration based on how far the animation will scroll (#9).

0.1.4 (2013-06-23)
-----

* When clicking on a link, change the hash in the url (#3). With back-button functionality.
* Also, when entering the website with a hash inside the url, jump to it.

0.1.3 (2013-05-21)
-----

* Only listen to left click (#2).
* Added `data-menu-offset` (see documentation).

0.1.2 (2013-05-21)
-----

* Made the plugin work again (stupid regression from 0.1.1).

0.1.1 (2013-05-18)
-----

* Handle the case when the clicked link doesn't have a `href` attribute at all.

0.1.0 (2013-05-18)
-----

* Moved skrollr-menu to a dedicated repo
