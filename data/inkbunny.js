// Parse InkBunny page and return URL for Weasyl cross-post
function parse($) {
	var titlePos = $('div.welcomeanon_userdetails').length ? 2 : 1; //check user login state
	var title = $('div.content td:nth-child(2) div', $('div.elephant').get(titlePos)).get(0).innerText;
	var tags = $('div div:nth-child(1) a span', $('#kw_scroll').next());
	// Fix this
	// var tags = $.map(tags.get(),
	//                  function (x) { return x.innerText.replace(/ /g, '_'); });
	var description = $('div.elephant_bottom.elephant_white div.content div').get(0).innerText;
	var image = $('div.widget_imageFromSubmission img').eq(0);
	var imageLink = image.parent('a');
	var imageURL = imageLink.length ? imageLink.attr('href') : image.attr('src');

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
	console.log("Fetching InkBunny Content...")
	url = parse($)
	self.port.emit("gotContent", url)
});
