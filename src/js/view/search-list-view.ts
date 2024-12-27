import { AbstractView } from "./abstract-view";
import { AppState, SearchRecipe } from "js/model/interfaces";

export class SearchListView extends AbstractView<
  HTMLDivElement,
  HTMLUListElement
> {
  recipeResults: SearchRecipe[];
  private resultsPerPage!: number;
  private currentPage!: number;

  constructor(hostEl: HTMLDivElement, recipes: SearchRecipe[]) {
    super("recipe__search-results-template", hostEl, "recipe-results", true);

    this.recipeResults = recipes;
    this.configure();
  }

  configure(): void {
    this.resultsPerPage = 10;
    this.currentPage = 1;
  }

  update(state: AppState): void {
    this.recipeResults = state.searchResults?.data.recipes || [];
    this.renderContent();
  }

  renderContent(): void {
    this.element.innerHTML = "";

    this.recipeResults.forEach((recipe) => {
      const markup = `
            
          <li class="preview">
          <a
            class="preview__link preview__link--active [ u-flex-row ]"
            href="#${recipe.id}"
          >
            <figure class="preview__fig">
              <img
                src="${recipe.image_url}"
                alt="${recipe.title}"
              />
            </figure>
            <div class="preview__data">
              <h4 class="preview__title">${recipe.title}</h4>
              <p class="preview__publisher">${recipe.publisher}</p>
              <div class="preview__user-generated">
                <svg class="[ hidden ]">
                  <use href="assets/img/icons.svg#icon-user"></use>
                </svg>
              </div>
            </div>
          </a>
        </li>
            `;

      this.element.insertAdjacentHTML("beforeend", markup);
    });
  }
}
