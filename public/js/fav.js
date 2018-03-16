/*
 * File: fav.js
 * Description: Javascript for the Favorites page.
 */

// Save bookmark to delete
var bookmark;

function deleteBookmark() {
	var bookmarkLink = $(bookmark).find('.fav-link');
	var name = $(bookmarkLink).text();
	var bookmarkUrl = $(bookmarkLink).attr('href');
    
    $.post('/delete-fav', {"name" : name, "url" : bookmarkUrl}, function(data) {
   	});  

    window.location.href = "/bookmarks";
}

function loadFav(fav) {
	stop();
	localStorage.setItem("fav", $(fav).text());

	window.location.href = $(fav).attr("href");
}

/*
 * Main function
 */
var main = function () {
	$('.edit-button').click(function(e) {
		e.preventDefault();
		$(this).text(function(i, text) {
			return text === "Edit" ? "Done" : "Edit";
		});

		$('.bookmark-options').toggle();
	});

	// Show delete confirmation
	$('.delete-fav').click(function() {
		bookmark = $(this).closest('.favorite');
		var name = $(bookmark).find('.fav-link').text();
		$('.delete-target').text(name);

		$('#confirm-delete').modal('show');
	});


	$('.fav-link').click(function(e) {
		e.preventDefault();
		loadFav($(this));
	});
};

$(document).ready(main);