skrollr-menu 1.0.3
==================

skrollr plugin for hash navigation.


Documentation
=============

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

	//Multiply your data-[offset] values so they match those set in skrollr.init
	scale: 2,

	//How long the animation should take in ms.
	duration: function(currentTop, targetTop) {
		//By default, the duration is hardcoded at 500ms.
		return 500;

		//But you could calculate a value based on the current scroll position (`currentTop`) and the target scroll position (`targetTop`).
		//return Math.abs(currentTop - targetTop) * 10;
	},

	//If you pass a handleLink function you'll disable `data-menu-top` and `data-menu-offset`.
	//You are in control where skrollr will scroll to. You get the clicked link as a parameter and are expected to return a number.
	handleLink: function(link) {
		return 400;//Hardcoding 400 doesn't make much sense.
	},

	//By default skrollr-menu will only react to links whose href attribute contains a hash and nothing more, e.g. `href="#foo"`.
	//If you enable `complexLinks`, skrollr-menu also reacts to absolute and relative URLs which have a hash part.
	//The following will all work (if the user is on the correct page):
	//http://example.com/currentPage/#foo
	//http://example.com/currentDir/currentPage.html?foo=bar#foo
	///?foo=bar#foo
	complexLinks: false,

	//This event is triggered right before we jump/animate to a new hash.
	change: function(newHash, newTopPosition) {
		//Do stuff
	},

	//Add hash link (e.g. `#foo`) to URL or not.
	updateUrl: false //defaults to `true`.
});
```

And in order to fix the problem with the wrong offset, you are able to specify the target scroll position right at the link, e.g.

```html
<a href="#section-about" data-menu-top="500">About</a>
```

This link will cause the page to scroll to `500`. But you should let the the href point to the actual target because if skrollr or js are disabled, the links will still work.

As of skrollr-menu `0.1.10` you can also use percentage offsets by appending a `p` to the number. E.g. `data-menu-top="75p"` will scroll down 75% of the viewport height.


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

Ignore links
------------

If you want skrollr-menu to ignore some of the hash links add an empty `data-menu-ignore` attribute.


Programmatically triggering a click
-----------------------------------

If you want to click one of the menu links programmatically, simply pass the link DOM element to the `skrollr.menu.click` function. Skrollr menu has to be initialized first!

```js
var link = document.querySelector('a');
skrollr.menu.click(link);
```


Per-link duration
-----------------

Instead of using the `duration` option, you can also specify a duration per-link by using the `data-menu-duration` attribute.

```html
<a href="#awesome" data-menu-duration="5000">#awesome over 5 seconds</a>
```


Changelog
=========

1.0.3 (2015-06-19)
------------------

* Fixed issue with clicking elements which get removed from the DOM (#77)

1.0.2 (2015-04-06)
------------------

* Added `updateUrl` option (#75).

1.0.1 (2015-01-24)
-------------------

* Added `data-menu-ignore` support (#7, #64).

1.0.0 (2015-01-16)
-------------------

* Added a `change` event which triggers before jumping to a new position / changing the hash (#61).
* Call this 1.0.0 already...

0.1.15 (2014-11-06)
-------------------

* Added `data-menu-duration` attribute (#57).

0.1.14 (2014-10-03)
-------------------

* Added the `complexLinks` option (#55).

0.1.13 (2014-09-26)
-------------------

* Fixed issue with jumping to hash when page was loaded, but no link to the hash exists #(54)

0.1.12 (2014-05-10)
-------------------

* Added `skrollr.menu.click`

0.1.11 (2014-03-14)
-----

* Fixed links not working inside SVG elements (#37)

0.1.10 (2013-11-21)
-----

* Added support for percentage offsets in `data-menu-top` (#20)

0.1.9 (2013-11-19)
-----

* Added `scale` option (#23)

0.1.8 (2013-10-28)
-----

* Added `handleLink` function option (#24)

0.1.7 (2013-10-18)
-----

* Use `skrollr.addEvent` instead of `addEventListener` in order to have the events removed when skrollr gets destroyed (#21)

0.1.6 (2013-10-13)
-----

* Don't jump to the hash on page load, only after init is called (#8, #12, #19)

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
