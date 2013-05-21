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
		if((e.which || e.button) !== 1) {
			return;
		}

		var link = findParentLink(e.target);

		//The click did not happen inside a link.
		if(!link) {
			return;
		}

		//Don't use the href property (link.href) because it contains the absolute url.
		var href = link.getAttribute('href');

		//Check if it's a hashlink.
		if(!/^#/.test(href)) {
			return;
		}

		//Now get the targetTop to scroll to.
		var targetTop;

		//If there's a data-menu-top attribute, it overrides the actuall anchor offset.
		var menuTop = link.getAttribute(MENU_TOP_ATTR);

		if(menuTop !== null) {
			targetTop = +menuTop;
		} else {
			var scrollTarget = document.getElementById(href.substr(1));

			//Ignore the click if no target is found.
			if(!scrollTarget) {
				return;
			}

			targetTop = _skrollrInstance.relativeToAbsolute(scrollTarget, 'top', 'top');

			var menuOffset = scrollTarget.getAttribute(MENU_OFFSET_ATTR);

			if(menuOffset !== null) {
				targetTop += +menuOffset;
			}
		}

		//Now finally scroll there.
		if(_animate) {
			_skrollrInstance.animateTo(targetTop, {
				duration: _duration,
				easing: _easing
			});
		} else {
			_skrollrInstance.setScrollTop(targetTop);
		}

		e.preventDefault();
	};

	/*
		Global menu function accessible through window.skrollr.menu.init.
	*/
	skrollr.menu = {};
	skrollr.menu.init = function(skrollrInstance, options) {
		_skrollrInstance = skrollrInstance;

		options = options || {};

		_duration = options.duration || DEFAULT_DURATION;
		_easing = options.easing || DEFAULT_EASING;
		_animate = options.animate !== false;

		//Use event bubbling and attach a single listener to the document.
		skrollr.addEvent(document, 'click', handleClick);
	};

	//Private reference to the initialized skrollr.
	var _skrollrInstance;

	var _easing;
	var _duration;
	var _animate;

	//In case the page was opened with a hash, prevent jumping to it.
	//http://stackoverflow.com/questions/3659072/jquery-disable-anchor-jump-when-loading-a-page
	window.setTimeout(function() {
		if(window.location.hash) {
			window.scrollTo(0, 0);
		}
	}, 1);
}(document, window));