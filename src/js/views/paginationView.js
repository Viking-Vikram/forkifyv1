import view from "./view.js";
import icons from "url:../../img/icons.svg";

class PaginationView extends view {
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", function (e) {
			const btn = e.target.closest(".btn--inline");
			if (!btn) return;
			const goToPage = +btn.dataset.goto;
			handler(goToPage);
		});
	}

	_generateMarkup() {
		// console.log(this._data);
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// console.log(numPages);
		const _curPage = this._data.page;
		// console.log(_curPage);

		// 1)first page,more pages exist
		if (this._data.page === 1 && numPages > 1)
			return this._generateNextBtn(_curPage);

		// 2)last page,no more pages
		if (this._data.page === numPages && numPages > 1)
			return this._generatePrevBtn(_curPage);

		// 3)other page
		if (this._data.page < numPages)
			return [
				this._generatePrevBtn(_curPage),
				this._generateNextBtn(_curPage),
			].join("");

		// 4)page 1,no other pages
		return ` `;
	}

	_generatePrevBtn(_curPage) {
		return `
  <button data-goto="${
			_curPage - 1
		}" class="btn--inline  pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page  ${_curPage - 1}</span>
          </button>
  `;
	}

	_generateNextBtn(_curPage) {
		return `
  <button data-goto="${
			_curPage + 1
		}" class="btn--inline  pagination__btn--next">
            <span>Page  ${_curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
  `;
	}
}
export default new PaginationView();
