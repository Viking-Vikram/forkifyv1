import previewView from "./previewView.js";

class BookmarksView extends previewView {
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
	_message = " ";

	addHandlerRender(handler) {
		window.addEventListener("load", handler);
	}
}

export default new BookmarksView();
