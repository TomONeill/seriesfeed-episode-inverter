// ==UserScript==
// @name         Seriesfeed Episode Inverter
// @namespace    https://www.seriesfeed.com
// @version      1.2
// @description  Invert the broadcast schedule, watchlist and episode list on a series.
// @updateURL 	 https://github.com/TomONeill/seriesfeed-episode-inverter/raw/master/seriesfeed-episode-inverter-latest.user.js
// @match        https://*.seriesfeed.com/**/episodes
// @match        https://*.seriesfeed.com/**/episodes/*
// @match        https://www.seriesfeed.com/series/schedule
// @match        https://www.seriesfeed.com/series/schedule/*
// @match        https://www.seriesfeed.com/series/schedule/history
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @author       Tom
// @copyright    2017+, Tom
// ==/UserScript==
/* jshint -W097 */
/*global $, console */
'use strict';

$(function() {
	let sortButton;

	if (window.location.href.indexOf("episodes") > -1) {
		const onClick = () => {
			const shouldDescend = localStorage.getItem("seriesShouldDescend") === "true";
			localStorage.setItem("seriesShouldDescend", !shouldDescend);
			sortEpisodes(!shouldDescend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .row .col-xs-12.col-sm-6.col-md-4").prepend(sortButton);

		const shouldDescend = localStorage.getItem("seriesShouldDescend") === "true";
		if (shouldDescend) {
			invertEpisodes();
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
		}
	}

	function sortEpisodes(shouldDescend) {
		invertEpisodes();

		if (shouldDescend) {
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
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

	function updateButton(rotateIcon180, text) {
		const icon = sortButton.find('i');
		if (rotateIcon180) {
			icon.css({ transform: 'rotate(180deg)' });
		} else {
			icon.css({ transform: 'rotate(0)' });
		}
		sortButton.find('span').text(text);
	}

	function buttonFactory(onClick) {
		const button = $('<button/>').addClass('btn btn-default');
		const icon = $('<i/>').addClass('fa fa-angle-up');
		const text = $('<span/>');
		button
			.append(icon)
			.append(text)
			.click(onClick);

		icon
			.css({
			    transform: 'rotate(0)',
			    transition: 'transform .3s ease'
		    });

		return button;
	}

	if (window.location.href.indexOf("series/schedule") > -1 && window.location.href.indexOf("series/schedule/history") <= -1) {
		const onClick = () => {
			const shouldDescend = localStorage.getItem("scheduleShouldDescend") === "true";
			localStorage.setItem("scheduleShouldDescend", !shouldDescend);
			sortEpisodes(!shouldDescend);
		};
		sortButton = buttonFactory(onClick);
		sortButton.addClass('largeFilter').css({ float: 'right' });
		$(".largeFilter").css({ display: 'inline-block', width: '400px' });
		$(".largeFilter").after(sortButton);

		const scheduleShouldDescend = localStorage.getItem("scheduleShouldDescend") === "true";
		if (scheduleShouldDescend) {
			invertEpisodes();
			updateButton(false, "aflopend");
		} else {
			updateButton(true, "oplopend");
		}
	}

	if (window.location.href.indexOf("series/schedule/history") > -1) {
		const onClick = () => {
			const shouldAscend = localStorage.getItem("watchlistShouldAscend") === "true";
			localStorage.setItem("watchlistShouldAscend", !shouldAscend);
			sortEpisodes(shouldAscend);
		};
		sortButton = buttonFactory(onClick);
		$(".container .rightButtons").prepend(sortButton);

		const watchlistShouldAscend = localStorage.getItem("watchlistShouldAscend") === "true";
		if (watchlistShouldAscend) {
			invertEpisodes();
			updateButton(true, "oplopend");
		} else {
			updateButton(false, "aflopend");
		}
	}
});