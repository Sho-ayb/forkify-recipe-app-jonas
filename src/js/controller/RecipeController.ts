import { State } from "../model/state";
import { RecipeService } from "js/service/service";
import { SearchListView } from "../view/search-list-view";

export class RecipeController {
  private searchListView: SearchListView | undefined;
  private state: State;
  private service: RecipeService;

  constructor(state: State, service: RecipeService) {
    this.state = state;
    this.service = service;
    this.initialiseView();
    this.setupEventListener();
  }

  private initialiseView(): void {
    const hostEl = document.querySelector(
      ".recipe__search-list",
    ) as HTMLDivElement;

    if (hostEl) {
      // To ensure that the searchResults object is not empty
      const searchResults = this.state.getState().searchResults;
      // Extract the recipes array from the above object
      const recipes = searchResults?.data?.recipes || [];

      // Create the search list view
      this.searchListView = new SearchListView(hostEl, recipes);
      // Subscribe to observer
      this.state.subscribe(this.searchListView);
      // Invoke method to render the intitial search results
      this.searchListView?.renderContent();
    }
  }

  private renderSearchResults(): void {
    const appState = this.state.getState();
    // Create a deep copy so object will have a difference reference
    const newRecipes = JSON.parse(
      JSON.stringify(appState.searchResults?.data.recipes || []),
    );

    console.log(newRecipes);
    console.log(appState.searchResults);

    if (
      JSON.stringify(this.searchListView?.recipeResults) !==
      JSON.stringify(newRecipes)
    ) {
      console.log("updating the search list view");
      this.searchListView?.update(appState);
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
    const searchResults = await this.service.searchRecipes(query);
    console.log(searchResults);

    // Save the new query to the state
    this.state.setSearchResults(searchResults);

    // Render the search results
    this.renderSearchResults();
  }
}
