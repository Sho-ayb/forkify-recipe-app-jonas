import { AppState, Recipe, SearchResult, Observer } from "./interfaces";

export class State {
  private state: AppState;

  private observers: Observer[];

  private bookmarks: Recipe[];

  constructor() {
    this.bookmarks = this.loadBookmarks();
    this.state = {
      bookmarks: this.bookmarks,
      searchResults: {} as SearchResult,
      recipe: undefined as Recipe | undefined,
    };

    this.observers = [];
  }

  //   Subscribe to observers
  public subscribe(observer: Observer): void {
    this.observers.push(observer);
  }

  //   Get the latest state

  public getState(): AppState {
    return this.state;
  }

  //   Add a bookmark to the bookmarks array
  public addBookmark(recipe: Recipe): void {
    this.state.bookmarks.push(recipe);
    this.notify();
    this.saveToLocalStorage();
  }

  //   Remove a bookmark from the bookmarks array

  public removeBookmark(recipeId: string): void {
    this.state.bookmarks = this.state.bookmarks.filter(
      (recipe) => recipe.id !== recipeId,
    );
    this.notify();
    this.saveToLocalStorage();
  }

  // Update the search results array

  public setSearchResults(result: SearchResult): void {
    this.state.searchResults = result;
    this.notify();
  }

  //   Set the current recipe

  public setCurrentRecipe(recipe: Recipe): void {
    this.state.recipe = recipe;
    this.notify();
  }

  //   Update the subscribers of state change

  private notify(): void {
    this.observers.forEach((observer) => observer.update(this.state));
  }

  //   Save bookmarks to local storage

  private saveToLocalStorage(): void {
    localStorage.setItem("bookmarks", JSON.stringify(this.state.bookmarks));
  }

  //   Load bookmarks from local storage

  private loadBookmarks(): Recipe[] {
    const bookmarks = localStorage.getItem("bookmarks");
    this.bookmarks = bookmarks ? JSON.parse(bookmarks) : [];
    return this.bookmarks;
  }
}
