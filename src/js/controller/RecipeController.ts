import { State } from "../model/state";
import { RecipeService } from "js/service/service";
import { SearchListView } from "../view/search-list-view";
import { RecipeView } from "../view/recipe-view";
import { SearchRecipe, Recipe } from "js/model/interfaces";
import { error } from "console";

export class RecipeController {
  private searchListView: SearchListView | undefined;
  private recipeView: RecipeView | undefined;
  private state: State;
  private service: RecipeService;
  private recipes: SearchRecipe[] = [];
  private recipe: Recipe | undefined;

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

    console.log(recipeHostEl);

    // Initialise the search list view
    if (searchHostEl) {
      // Gets search results object
      const searchResults = this.state.getState().searchResults;
      // Extract the recipes array from the above object
      this.recipes = searchResults?.data?.recipes || [];

      // Create the search list view
      this.searchListView = new SearchListView(searchHostEl, this.recipes);
      // Subscribe to observer
      this.state.subscribe(this.searchListView);
      // Invoke method to render the intitial search results
      this.searchListView?.renderContent();
    }

    // Initialise the initial recipe view, invokes the renderContent method
    // this.recipe will be initially undefined so message element is rendered to the DOM.

    if (recipeHostEl) {
      // Will be undefined
      this.recipe = this.state.getState().recipe;
      // Create the recipe view
      this.recipeView = new RecipeView(recipeHostEl, this.recipe, this.state);
      // Subscribe to the observer
      this.state.subscribe(this.recipeView);
    }
  }

  private setupEventListener(): void {
    console.log("setupevent listener");

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

      console.log(recipeResult);

      // Set the current recipe to the state object
      this.state.setCurrentRecipe(recipeResult);

      // const appState = this.state.getState();

      // console.log(appState.recipe);

      // // Render the the views
      // this.recipeView?.update(appState);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error: ", error.message);
      }
    }
  }
}
