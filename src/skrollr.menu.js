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

	var MENU_TOP_ATTR = 'data-menu-top';
	var MENU_OFFSET_ATTR = 'data-menu-offset';

	var skrollr = window.skrollr;
	var history = window.history;
	var supportsHistory = !!history.pushState;

	/*
		Since we are using event bubbling, the element that has been clicked
		might not acutally be the link but a child.
	*/
	var findParentLink = function(element) {
		//Yay, it's a link!
		if(element.tagName === 'A') {
			return element;
		}

		//We reached the top, no link found.
		if(element === document) {
			return false;
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

	var getLinkTargetTop = function(link)
	{
		var href = link.getAttribute('href');
		var targetTop;

		var menuTop = 0;

		if(!_handleLink) //If there's a data-menu-top attribute and no handleLink function, it overrides the actuall anchor offset.
			menuTop = link.getAttribute(MENU_TOP_ATTR);
		else //If there's a handleLink function, it overrides the data-menu-top attribute
			menuTop = _handleLink(link);

		if(menuTop !== null) {
			targetTop = +menuTop;
		} else {
			var scrollTarget = document.getElementById(href.substr(1));

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
		return targetTop;
	}
	/*
		Handles the click on a link. May be called without an actual click event.
		When the fake flag is set, the link won't change the url and the position won't be animated.
	*/
	var handleLink = function(link, fake) {
		//Don't use the href property (link.href) because it contains the absolute url.
		var href = link.getAttribute('href');

		//Check if it's a hashlink.
		if(!/^#/.test(href)) {
			return false;
		}

		//Now get the targetTop to scroll to.
		var targetTop = getLinkTargetTop();

		if(supportsHistory && !fake) {
			history.pushState({top: targetTop}, '', href);
		}

		//Now finally scroll there.
		if(_animate && !fake) {
			_skrollrInstance.animateTo(targetTop, {
				duration: _duration(_skrollrInstance.getScrollTop(), targetTop),
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

			if(link) {
				handleLink(link, true);
			}
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
		_activeSubstract = options.activeSubstract || 0;

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

	skrollr.menu.getActiveHref = function()
	{
		var links = [];
		Array.prototype.forEach.call(document.getElementsByTagName('a'), function(link) {
			if(link.getAttribute('data-skrollr-menu') !== null) {
				var targetTop = getLinkTargetTop(link);

				if(!links[targetTop]) links[targetTop] = {targetTop:targetTop, href:link.getAttribute('href')};
			}
		});

		links.sort(function(a, b) {
			return a.targetTop - b.targetTop;
		});

		var activeLinkHref = null;
		var currentPosition = _skrollrInstance.getScrollTop();
		var substractIsFunction = (typeof _activeSubstract === 'function');

		Array.prototype.forEach.call(links, function(link) {
			if(currentPosition >= (link.targetTop - ((substractIsFunction) ? _activeSubstract.call(link) : _activeSubstract))) {
				activeLinkHref = link.href;
			}
		});

		return activeLinkHref;
	};

	//Private reference to the initialized skrollr.
	var _skrollrInstance;

	var _easing;
	var _duration;
	var _animate;
	var _handleLink;
	var _activeSubstract;

	//In case the page was opened with a hash, prevent jumping to it.
	//http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
	defer(function() {
		if(window.location.hash) {
			window.scrollTo(0, 0);
		}
	});
}(document, window));