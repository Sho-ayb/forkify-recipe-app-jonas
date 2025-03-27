import { AbstractView } from "./abstract-view";
import { AppState, SearchRecipe } from "js/model/interfaces";
import { State } from "js/model/state";
export class SearchListView extends AbstractView<
  HTMLDivElement,
  HTMLUListElement
> {
  private recipeResults!: SearchRecipe[];
  private resultsPerPage!: number;
  private currentPage!: number;
  private state: State;

  constructor(hostEl: HTMLDivElement, state: State) {
    super("recipe__search-results-template", hostEl, "recipe-results", true);

    this.state = state;
    this.configure();
  }

  configure(): void {
    // Subscribe this class to the state object
    this.state.subscribe(this);
    this.recipeResults = [];
    this.resultsPerPage = 10;
    this.currentPage = 1;
    this.setupPagination();
    this.renderContent();
  }

  renderContent(): void {
    // Render the paginated results and buttons
    this.renderPaginationResults();
    this.updatePaginationButtons();
  }

  update(state: AppState): void {
    console.log("Search list view component: ", state);
    this.recipeResults = state.searchResults?.data?.recipes || [];
    console.log(
      "This should be the recipe results from update method in search list view component: ",
      this.recipeResults,
    );
    // Reset to the first page whenever there is an update
    this.currentPage = 1;
    // Render the search results and pagination buttons
    this.renderContent();
  }

  private setupPagination(): void {
    const paginationContainer = document.querySelector(".pagination");

    if (!paginationContainer) return;

    // Clear existing listeners to prevent multiple attachments
    // paginationContainer.innerHTML = "";

    // Add event listeners to pagination buttons
    paginationContainer.addEventListener("click", (event: Event) => {
      console.log("button clicked");
      const target = event.target as HTMLElement;
      const prevBtn = target.closest(
        ".pagination__btn--prev",
      ) as HTMLButtonElement;
      const nextBtn = target.closest(
        ".pagination__btn--next",
      ) as HTMLButtonElement;

      if (prevBtn) {
        this.currentPage = this.currentPage - 1;
        this.renderPaginationResults();
        this.updatePaginationButtons();
      }

      if (nextBtn) {
        this.currentPage = this.currentPage + 1;
        this.renderPaginationResults();
        this.updatePaginationButtons();
      }
    });
  }

  private renderPaginationResults(): void {
    const start = (this.currentPage - 1) * this.resultsPerPage;
    const end = this.currentPage * this.resultsPerPage;

    const paginationResults = this.recipeResults.slice(start, end);

    // Render the paginated results using the existing method
    this.renderPaginatedContent(paginationResults);
  }

  // Dedicated class within this class to handle paginated results
  private renderPaginatedContent(results: SearchRecipe[]): void {
    this.element.innerHTML = "";

    const markup = results
      .map((recipe) => {
        return `
            
          <li class="preview" data-id="${recipe.id}">
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
      })
      .join("");
    this.element.insertAdjacentHTML("beforeend", markup);
  }

  private updatePaginationButtons(): void {
    const paginationContainer = document.querySelector(".pagination");

    if (!paginationContainer) return;

    const prevBtn = paginationContainer.querySelector(
      ".pagination__btn--prev",
    )! as HTMLButtonElement;
    const nextBtn = paginationContainer.querySelector(
      ".pagination__btn--next",
    )! as HTMLButtonElement;
    const totalPages = Math.ceil(
      this.recipeResults.length / this.resultsPerPage,
    );

    // If no results hide both buttons and set default text
    if (totalPages === 0) {
      if (prevBtn) {
        prevBtn.querySelector("span")!.textContent = `Page ${this.currentPage}`;
        prevBtn.style.visibility = "hidden";
      }

      if (nextBtn) {
        nextBtn.querySelector("span")!.textContent = `Page ${this.currentPage}`;
        nextBtn.style.visibility = "hidden";
      }

      return;
    }

    if (prevBtn) {
      prevBtn.querySelector("span")!.textContent =
        `Page ${this.currentPage - 1}`;
      prevBtn.style.visibility = this.currentPage === 1 ? "hidden" : "visible";
    }

    if (nextBtn) {
      nextBtn.querySelector("span")!.textContent =
        `Page ${this.currentPage + 1}`;
      nextBtn.style.visibility =
        this.currentPage === totalPages ? "hidden" : "visible";
    }
  }
}
