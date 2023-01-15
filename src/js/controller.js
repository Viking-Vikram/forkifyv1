// import { search } from "core-js/fn/symbol";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { MODAL_CLOSE_SEC } from "./config";
import * as model from "./model.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import paginationView from "./views/paginationView.js";
import bookmarksView from "./views/bookmarksView.js";
import addRecipeView from "./views/addRecipeView.js";

const recipeContainer = document.querySelector(".recipe");

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// if (module.hot) {
// 	module.hot.accept();
// }

const controlRecipe = async function () {
	try {
		const id = window.location.hash.slice(1);

		recipeView.renderSpinner();

		if (!id) return;
		// 0)Update results view to mark selected search result
		resultsView.update(model.getSearchResultsPage());
		bookmarksView.update(model.state.bookmarks);

		// 1) loading recipe
		await model.loadRecipe(id);
		// const { recipe } = model.state;

		// 2) redering recipe
		recipeView.render(model.state.recipe);
		console.log(model.state.recipe);
	} catch (err) {
		console.log(err.message);
		recipeView.renderError();
	}
};

const controlSearchResults = async function () {
	try {
		resultsView.renderSpinner();
		//1) get search query
		const query = searchView.getQuery();
		if (!query) return;

		//2) load search results
		await model.loadSearchResults(query);

		//3)  render search results
		resultsView.render(model.getSearchResultsPage());

		// 4)render pagination buttons
		paginationView.render(model.state.search);
	} catch (err) {
		console.log(err);
	}
};

const controlPagination = function (goToPage) {
	//1)  render new search results
	resultsView.render(model.getSearchResultsPage(goToPage));

	// 2)render new pagination buttons
	paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
	model.updateServings(updateTo);
	recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
	// 1) add/remove bookmarks
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	// 2) update recipe view
	// console.log(model.state.recipe);
	recipeView.update(model.state.recipe);

	// render bookmarks
	bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
	bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
	try {
		// render spinner
		addRecipeView.renderSpinner();

		// upload new recipe data
		// console.log(newRecipe);
		await model.uploadRecipe(newRecipe);
		console.log(model.state.recipe);

		// render uploaded recipe
		recipeView.render(model.state.recipe);

		// success message
		addRecipeView.renderSuccess();

		// render bookmarkView
		bookmarksView.render(model.state.bookmarks);

		// change id in URL
		window.history.pushState(null, "", `#${model.state.recipe.id}`);
		// window.history.back();
		// window.history.forward();

		// close form
		setTimeout(function () {
			addRecipeView._toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (err) {
		console.error(err.message);
		addRecipeView.renderError(err.message);
	}
};

const init = function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipe);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmarks);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
