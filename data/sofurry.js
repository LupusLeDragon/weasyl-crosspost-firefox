// Parse SoFurry page and return URL for Weasyl cross-post
function parse($) {
	var title = $('#sfContentTitle').get(0).innerText;
	var tagContainers = $('#submission_tags div.section-content');
	// TODO: Fix this:   Message: TypeError: x.innerText is undefined
	// var tags = $.map($('a', tagContainers.get(0)).get(),
	//                  function (x) { return x.innerText.replace(/ /g, '_'); });
	var description = $('#sfContentDescription').get(0).innerText;
	var imageURL = $('#sfContentImage a').attr('href');

	var url = "https://www.weasyl.com/submit/visual?" + $.param({
			title: title,
			// tags: tags,
			description: description,
			baseURL: document.location,
			imageURL: imageURL,
		}, true);

	return url
}

self.port.on("getContent", function fetch() {
	console.log("Fetching SoFurry Content...")
	url = parse($)
	self.port.emit("gotContent", url)
});

