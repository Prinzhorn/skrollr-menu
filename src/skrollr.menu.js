 /*!
 * Plugin for skrollr.
 * This plugin makes hashlinks scroll nicely to their target position.
 *
 * Alexander Prinzhorn - https://github.com/Prinzhorn/skrollr
 *
 * Free to use under terms of MIT license
 */
(function(document, window) {
	'use strict';

	var DEFAULT_DURATION = 500;
	var DEFAULT_EASING = 'sqrt';
	var DEFAULT_SCALE = 1;

	var MENU_TOP_ATTR = 'data-menu-top';
	var MENU_OFFSET_ATTR = 'data-menu-offset';
	var MENU_DURATION_ATTR = 'data-menu-duration';

	var skrollr = window.skrollr;
	var history = window.history;
	var supportsHistory = !!history.pushState;

	/*
		Since we are using event bubbling, the element that has been clicked
		might not acutally be the link but a child.
	*/
	var findParentLink = function(element) {
		//We reached the top, no link found.
		if(element === document) {
			return false;
		}

		//Yay, it's a link!
		if(element.tagName.toUpperCase() === 'A') {
			return element;
		}

		//Maybe the parent is a link.
		return findParentLink(element.parentNode);
	};

	/*
		Handle the click event on the document.
	*/
	var handleClick = function(e) {
		//Only handle left click.
		if(e.which !== 1 && e.button !== 0) {
			return;
		}

		var link = findParentLink(e.target);

		//The click did not happen inside a link.
		if(!link) {
			return;
		}

		if(handleLink(link)) {
			e.preventDefault();
		}
	};

	/*
		Handles the click on a link. May be called without an actual click event.
		When the fake flag is set, the link won't change the url and the position won't be animated.
	*/
	var handleLink = function(link, fake) {
		var hash;

		//When complexLinks is enabled, we also accept links which do not just contain a simple hash.
		if(_complexLinks) {
			//The link points to something completely different.
			if(link.hostname !== window.location.hostname) {
				return false;
			}

			//The link does not link to the same page/path.
			if(link.pathname !== document.location.pathname) {
				return false;
			}

			hash = link.hash;
		} else {
			//Don't use the href property (link.href) because it contains the absolute url.
			hash = link.getAttribute('href');
		}

		//Not a hash link or one containing data-ignore-skrollr attribute
		if(!/^#/.test(hash) || link.dataset.ignoreSkrollr) {
			return false;
		}

		//Now get the targetTop to scroll to.
		var targetTop;

		var menuTop;

		//If there's a handleLink function, it overrides the actual anchor offset.
		if(_handleLink) {
			menuTop = _handleLink(link);
		}
		//If there's a data-menu-top attribute and no handleLink function, it overrides the actual anchor offset.
		else {
			menuTop = link.getAttribute(MENU_TOP_ATTR);
		}

		if(menuTop !== null) {
			//Is it a percentage offset?
			if(/p$/.test(menuTop)) {
				targetTop = (menuTop.slice(0, -1) / 100) * document.documentElement.clientHeight;
			} else {
				targetTop = +menuTop * _scale;
			}
		} else {
			var scrollTarget = document.getElementById(hash.substr(1));

			//Ignore the click if no target is found.
			if(!scrollTarget) {
				return false;
			}

			targetTop = _skrollrInstance.relativeToAbsolute(scrollTarget, 'top', 'top');

			var menuOffset = scrollTarget.getAttribute(MENU_OFFSET_ATTR);

			if(menuOffset !== null) {
				targetTop += +menuOffset;
			}
		}

		if(supportsHistory && !fake) {
			history.pushState({top: targetTop}, '', hash);
		}

		var menuDuration = parseInt(link.getAttribute(MENU_DURATION_ATTR), 10);
		var animationDuration = _duration(_skrollrInstance.getScrollTop(), targetTop);

		if(!isNaN(menuDuration)) {
			animationDuration = menuDuration;
		}

		//Trigger the change if event if there's a listener.
		if(_change) {
			_change(hash, targetTop);
		}

		//Now finally scroll there.
		if(_animate && !fake) {
			_skrollrInstance.animateTo(targetTop, {
				duration: animationDuration,
				easing: _easing
			});
		} else {
			defer(function() {
				_skrollrInstance.setScrollTop(targetTop);
			});
		}

		return true;
	};

	var jumpStraightToHash = function() {
		if(window.location.hash && document.querySelector) {
			var link = document.querySelector('a[href="' + window.location.hash + '"]');

			if(!link) {
				// No link found on page, so we create one and then activate it
				link = document.createElement('a');
				link.href = window.location.hash;
			}

			handleLink(link, true);
		}
	};

	var defer = function(fn) {
		window.setTimeout(fn, 1);
	};

	/*
		Global menu function accessible through window.skrollr.menu.init.
	*/
	skrollr.menu = {};
	skrollr.menu.init = function(skrollrInstance, options) {
		_skrollrInstance = skrollrInstance;

		options = options || {};

		_easing = options.easing || DEFAULT_EASING;
		_animate = options.animate !== false;
		_duration = options.duration || DEFAULT_DURATION;
		_handleLink = options.handleLink;
		_scale = options.scale || DEFAULT_SCALE;
		_complexLinks = options.complexLinks === true;
		_change = options.change;

		if(typeof _duration === 'number') {
			_duration = (function(duration) {
				return function() {
					return duration;
				};
			}(_duration));
		}

		//Use event bubbling and attach a single listener to the document.
		skrollr.addEvent(document, 'click', handleClick);

		if(supportsHistory) {
			skrollr.addEvent(window, 'popstate', function(e) {
				var state = e.state || {};
				var top = state.top || 0;

				defer(function() {
					_skrollrInstance.setScrollTop(top);
				});
			}, false);
		}

		jumpStraightToHash();
	};

	//Expose the handleLink function to be able to programmatically trigger clicks.
	skrollr.menu.click = function(link) {
		//We're not assigning it directly to `click` because of the second ("private") parameter.
		handleLink(link);
	};

	//Private reference to the initialized skrollr.
	var _skrollrInstance;

	var _easing;
	var _duration;
	var _animate;
	var _handleLink;
	var _scale;
	var _complexLinks;
	var _change;

	//In case the page was opened with a hash, prevent jumping to it.
	//http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
	defer(function() {
		if(window.location.hash) {
			window.scrollTo(0, 0);
		}
	});
}(document, window));
