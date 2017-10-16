// ==UserScript==
// @name         Seriesfeed Episode Inverter
// @namespace    https://www.seriesfeed.com
// @version      1.0
// @description  Allows you to invert the episode list on a series.
// @updateURL 	 https://github.com/TomONeill/seriesfeed-episode-inverter/raw/master/seriesfeed-episode-inverter-latest.user.js
// @match        https://*.seriesfeed.com/**/episodes
// @match        https://*.seriesfeed.com/**/episodes/*
// @match        https://www.seriesfeed.com/series/schedule/history
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2017+, Tom
// ==/UserScript==
/* jshint -W097 */
/*global $, console, GM_getValue, GM_setValue */
'use strict';

$(function() {
	let sortButton;

	if (window.location.href.indexOf("episodes") > -1) {
		const onClick = () => {
			const shouldDescend = GM_getValue("seriesShouldDescend");
			GM_setValue("seriesShouldDescend", !shouldDescend);
			sortEpisodes(!shouldDescend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .row .col-xs-12.col-sm-6.col-md-4").prepend(sortButton);

		const shouldDescend = GM_getValue("seriesShouldDescend");
		if (shouldDescend) {
			invertEpisodes();
			updateButton(sortButton, 'up', "aflopend");
		} else {
			updateButton(sortButton, 'down', "oplopend");
		}
	}

	function sortEpisodes(shouldDescend) {
		invertEpisodes();

		if (shouldDescend) {
			updateButton(sortButton, 'up', "aflopend");
		} else {
			updateButton(sortButton, 'down', "oplopend");
		}
	}

	function invertEpisodes() {
		const episodes = $('#afleveringen tbody');
		episodes.each(function(element, index) {
			const array = $.makeArray($("tr", this).detach());
			array.reverse();
			$(this).append(array);
		});
	}

	function updateButton(button, anglePosition, text) {
		button.html('<i class="fa fa-angle-' + anglePosition + '"></i>' + text);
	}

	function buttonFactory(onClick) {
		const button = $('<button class="btn btn-default"></button>');
		button.on('click', onClick);

		return button;
	}

	if (window.location.href.indexOf("series/schedule") > -1) {
		const onClick = () => {
			const shouldAscend = GM_getValue("watchlistShouldAscend");
			GM_setValue("watchlistShouldAscend", !shouldAscend);
			sortEpisodes(shouldAscend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .rightButtons").prepend(sortButton);

		const watchlistShouldAscend = GM_getValue("watchlistShouldAscend");
		if (watchlistShouldAscend) {
			invertEpisodes();
			updateButton(sortButton, 'down', "oplopend");
		} else {
			updateButton(sortButton, 'up', "aflopend");
		}
	}
});