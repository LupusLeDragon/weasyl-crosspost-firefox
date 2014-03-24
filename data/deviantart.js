// Parse DeviantArt page and return URL for Weasyl cross-post
function parse($) {
	var title = $('div.dev-title-container h1 a').get(0).innerText;
	var description = $('div.dev-description').get(0).innerText;
	var imageURL = $('img.dev-content-full').attr('src');
	
	var url = "https://www.weasyl.com/submit/visual?" + $.param({
			title: title,
			description: description,
			baseURL: document.location,
			imageURL: imageURL,
		}, true);

	return url
}

self.port.on("getContent", function fetch() {
	console.log("Fetching DeviantArt Content...")
	url = parse($)
	self.port.emit("gotContent", url)
});

