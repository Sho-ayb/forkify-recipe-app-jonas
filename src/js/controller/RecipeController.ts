import { State } from "../model/state";
import { SearchListView } from "../view/search-list-view";

export class RecipeController {
  private searchListView: SearchListView | undefined;
  private state: State;

  constructor(state: State) {
    this.state = state;
    this.initialiseView();
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

      this.searchListView = new SearchListView(hostEl, recipes);

      this.renderSearchResults();
    }
  }

  private renderSearchResults(): void {
    this.searchListView?.renderContent();
  }
}
