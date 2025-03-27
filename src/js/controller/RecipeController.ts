import { State } from "../model/state";
import { RecipeService } from "js/service/service";
import { SearchListView } from "../view/search-list-view";
import { RecipeView } from "../view/recipe-view";
import { BookmarksView } from "../view/bookmarks-view";
import { ModalBookmarksView } from "../view/modal-bookmarks-view";

import { Recipe } from "js/model/interfaces";

export class RecipeController {
  private state: State;
  private service: RecipeService;
  private currentRecipe: Recipe | undefined;

  constructor(state: State, service: RecipeService) {
    this.state = state;
    this.service = service;
    this.init();
    this.setupEventListener();
  }

  private init(): void {
    // Query selecting the host elements
    const searchHostEl = document.querySelector(
      ".recipe__search-list",
    ) as HTMLDivElement;
    const recipeHostEl = document.querySelector(".recipe") as HTMLDivElement;
    const headerBookmarkHostEl = document.querySelector(
      ".bookmarks",
    ) as HTMLDivElement;
    const modalBookmarkHostEl = document.querySelector(
      ".modal__content",
    ) as HTMLDivElement;

    // Initialise the search list view
    if (searchHostEl) {
      new SearchListView(searchHostEl, this.state);
    }

    // Initialise the initial recipe view, invokes the renderContent method
    // this.recipe will be initially undefined so message element is rendered to the DOM.

    if (recipeHostEl) {
      new RecipeView(recipeHostEl, this.state);
    }

    // Initialise the headers bookmarks view
    if (headerBookmarkHostEl) {
      new BookmarksView(
        headerBookmarkHostEl,
        this.state,
        this.handleRecipeSelection.bind(this),
      );
    }

    // Initialise the modal bookmarks view
    if (modalBookmarkHostEl) {
      new ModalBookmarksView(modalBookmarkHostEl, this.state);
    }
  }

  private setupEventListener(): void {
    console.log("setupevent listener in recipe controller");

    const searchBtn = document.querySelector(
      ".header__search-form-btn",
    ) as HTMLFormElement;

    searchBtn?.addEventListener("click", (event: Event) => {
      event.preventDefault();
      this.handleFormSubmit(event);
    });

    const searchResults = document.querySelector(".results");

    searchResults?.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;

      const recipeItem = target.closest(".preview") as HTMLElement;

      if (recipeItem) {
        const recipeId = recipeItem.dataset.id;
        if (recipeId) {
          this.handleRecipeSelection(recipeId);
        }
      }
    });
  }

  private handleFormSubmit(event: Event): void {
    event.preventDefault();
    console.log("handleformsubmit");
    const searchInput = document.querySelector(
      ".header__search-form-input",
    ) as HTMLInputElement;
    const query = searchInput?.value;
    this.performSearch(query);
  }

  private async performSearch(query: string): Promise<void> {
    try {
      const searchResults = await this.service.searchRecipes(query);
      console.log("Search results: ", searchResults);

      // Save the new query to the state
      this.state.setSearchResults(searchResults);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error: ", error.message);
      }
    }
  }

  private async handleRecipeSelection(recipeId: string): Promise<void> {
    try {
      const recipeResult = await this.service.getRecipe(recipeId);

      console.log("Recipe result from the forkify api: ", recipeResult);

      // Check if the recipeId is in the bookmarks array in the state
      const isAlreadyBookmarked = this.state
        .getState()
        .bookmarks.some((bookmark) => bookmark.id === recipeId);

      // Conditionally set the 'bookmarked' property based on whether it's already bookmarked
      const newRecipeObj: Recipe = {
        ...recipeResult,
        bookmarked: isAlreadyBookmarked, // Set bookmarked based on state
      };

      console.log("New recipe obj with bookmarked prop: ", newRecipeObj);

      // Assigning this new recipe obj to this.currentRecipe private prop
      this.currentRecipe = newRecipeObj;

      console.log(
        "handle recipe selectionin recipe controller: ",
        this.currentRecipe,
      );

      if (this.currentRecipe) {
        // Set the current recipe to the state object
        this.state.setCurrentRecipe(this.currentRecipe);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error: ", error.message);
      }
    }
  }
}
