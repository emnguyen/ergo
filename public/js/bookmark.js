/*
 * File: bookmark.js
 * Description: Javascript for the Bookmarks page.
 */

/* Global variables */
var bookmark; // Save bookmark to delete

/* Name: deleteBookmark
 * Description: Uses POST to delete a bookmark from data.json.
 * Parameters: None
 * Return: None
 */
function deleteBookmark() {
	var bookmarkLink = $(bookmark).find('.bookmark-link');
	var name = $(bookmarkLink).text();
	var bookmarkUrl = $(bookmarkLink).attr('href');
    
    $.post('/delete-bookmark', {"name" : name, "url" : bookmarkUrl}, function(data) {
   	});  

    window.location.href = "/bookmarks";
}

/* Name: loadBookmark
 * Description: Loads bookmark.
 * Parameters: None
 * Return: None
 */
function loadBookmark(bookmark) {
	//stop();
	localStorage.setItem("bookmark", $(bookmark).text());
	window.location.href = $(bookmark).attr("href");
}

/*
 * Main function
 */
var main = function () {
	// Toggle edit button
	$('.edit-button').click(function(e) {
		e.preventDefault();
		$(this).text(function(i, text) {
			return text === "Edit" ? "Done" : "Edit";
		});

		$('.bookmark-options').toggle();
	});

	// Show delete confirmation
	$('.delete-bookmark').click(function() {
		// Retrieve bookmark
		bookmark = $(this).closest('.bookmark');
		var name = $(bookmark).find('.bookmark-link').text();
		// Show modal
		$('.delete-target').text(name);
		$('#confirm-delete').modal('show');
	});

	// Override bookmark links
	$('.bookmark-link').click(function(e) {
		e.preventDefault();
		loadBookmark($(this));
	});
};

$(document).ready(main);