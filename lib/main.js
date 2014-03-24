// Imports
var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
// var url = require("sdk/url");
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;

// Constants
var pageConstants = [
    // [0] Site Name,   [1] Regular Expression (Page Matching),   [2] Domain Matcher (with wildcard),   [3] Pagemod Script
    ["furaffinity", new RegExp("^https?:\/\/(?:[^.]+\.)?furaffinity\.net\/view\/[0-9]+"), "*.furaffinity", "furaffinity.js"],
    ["deviantart", new RegExp("^https?:\/\/(?:[^.]+\.)?deviantart\.com\/art\/"), "*.deviantart", "deviantart.js"],
    ["inkbunny", new RegExp("^https?:\/\/inkbunny\.net\/submissionview\.php\/"), "*.inkbunny", "inkbunny.js"],
    ["sofurry", new RegExp("^https?:\/\/www\.sofurry\.com\/view\/"), "*.sofurry", "sofurry.js"]
];

// Useful Functions
String.prototype.normaliseSpace = function() {
	return this.replace(/^\s*|\s(?=\s)|\s*$/g, "");
}

// var windowObject = window.content;
// console.log(browser.contentDocument)

// Globals
// Are we on an appropriate page?
var contentAvail = false;
var contentSource = "";
var currentWorker = null

// Widget (Icon in the add-ons bar)
var weasylWidget = widgets.Widget({
	id: "weasyl-link",
	label: "Crosspost to Weasyl",
	// contentURL: "https://www.weasyl.com/static/images/favicon.png",
	contentURL: data.url("favicon_grey.png"),
	onClick: function() {
		if (contentAvail == true) {
			switch (contentSource) {
				case "furaffinity": getPageContent(currentWorker); break;
				case "deviantart": break;
				case "inkbunny": break;
				case "sofurry": break;
			}
		}
	}
});

// Page Mods
pageMod.PageMod({
	include: "*.furaffinity.net",
	contentScriptFile: [data.url('jquery-2.0.3.min.js'), data.url("furaffinity.js")],
	onAttach: function(worker) {
		console.log("Setting pageMod worker now...")
		currentWorker = worker
	}
});

function getPageContent(worker) {
	console.log("Communicating with script...")
	worker.port.emit("getContent");
	worker.port.on("gotContent", function(url) {
		console.log("Opening new tab: " + url)
		tabs.open(url)
	});
}

// Event listeners to detect page change
tabs.on('ready', testCurrentPage);
tabs.on('activate', testCurrentPage);

/*
Checks if the current page is one of the supported sites, sets variables
as appropriate and changes the Weasyl icon greyscale <--> coloured.

Note, there is probably a better way of handling this, by only
letting the page-mod trigger if we're on an art page... not sure how
*/
function testCurrentPage() {
	var currentURL = tabs.activeTab.url;
	// console.log('Testing URL: ' + currentURL);
	var result = false;
	var currentSite = "";

	for (var i = 0; i < pageConstants.length; i++) {
		// console.log(' -> Is it ' + pageConstants[i][0] + '? ' + result);
		if (pageConstants[i][1].test(currentURL) == true) {
			result = true;
			currentSite = pageConstants[i][0]
			break;
		}
	}

	if (result == true) {
		console.log('We are here: ' + currentSite);
		contentAvail = true;
		contentSource = currentSite;
		weasylWidget.contentURL = data.url("favicon_colour.png");
		// console.log('   DEBUG: ' + weasylWidget.contentURL);
	} else {
		contentAvail = false;
		contentSource = "";
		console.log('=== ACTIVATE GREYSCALE ===');
		weasylWidget.contentURL = data.url("favicon_grey.png");
	}
	// console.log('DEBUG 2: ' + weasylWidget.contentURL);
	// console.log('BOOP' + currentURL)
}
