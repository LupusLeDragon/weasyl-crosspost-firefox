// Parse FurAffinity page and return URL for Weasyl cross-post
function parse($) {
	// console.log("IN THE DEEP")
	var title = $('table.maintable table.maintable td.cat b').get(0).innerText;
	// TODO: Fix tag harvesting, the jQuery code doesn't work for some reason
	// meta.tags = $.map($('#keywords a').get(),
	// 					function (part) { return part.innerText.replace(/ /g, '_'); });
	// tags = document.querySelector('#keywords').textContent;
	// console.log($('#keywords a').get())
	var description = $('table.maintable td.alt1[width="70%"]').text();
	var imageURL = $('a:contains("Download")').attr('href');
	
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
	console.log("Fetching FurAffinity Content...")
	url = parse($)
	self.port.emit("gotContent", url)
});
