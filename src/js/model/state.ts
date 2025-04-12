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

  //   Returns the latest state

  public getState(): AppState {
    return this.state;
  }

  //   Add a bookmark to the bookmarks array
  public addBookmark(recipe: Recipe): void {
    this.state.bookmarks.push(recipe);
    this.saveToLocalStorage();
    this.notify();
  }

  //   Remove a bookmark from the bookmarks array

  public removeBookmark(recipeId: string): void {
    this.state.bookmarks = this.state.bookmarks.filter(
      (recipe) => recipe.id !== recipeId,
    );

    // need to reset the bookmarked value to false
    if (this.state.recipe?.id === recipeId) {
      this.state.recipe.bookmarked = false;
    }

    // Will save the filtered bookmarks to local storage
    this.saveToLocalStorage();

    // Notifies all observers - most importantly recipe details view
    // of the state change and the update method will execute

    this.notify();
  }

  // Update the search results array

  public setSearchResults(result: SearchResult): void {
    this.state = {
      ...this.state,
      searchResults: result,
    };

    this.notify();
  }

  //   Set the current recipe

  public setCurrentRecipe(recipe: Recipe): void {
    // Using a spread operator creates a shallow copy: a brand new
    // object for immutability from the original state.
    this.state = {
      ...this.state,
      recipe: recipe,
    };
    this.notify();
  }

  // Toggle the bookmark

  // A method for toggling the recipe from the bookmarks array
  // This method should be invoked when the bookmarks toggle button is clicked
  // Returns the status of the bookmark

  public toggleBookmark(recipeId: string): void {
    // Get the recipe
    const recipe = this.state.recipe;

    console.log("Recipe from state class: ", recipe);

    // Check if the recipe exists
    if (!recipe) {
      console.warn("No recipe loaded. Cannot bookmark.");
      return;
    }

    // Check if the current recipe exists in the bookmarks array, returns boolean value
    const isCurrentlyBookmarked = this.isBookmarked(recipeId);

    // If truthy remove the recipe from the bookmarks array otherwise add to the array
    // Update the state object

    // Create a new array to hold the bookmarks
    let newBookmarks: Recipe[];

    if (isCurrentlyBookmarked) {
      // Filter out the bookmark from this.state.bookmarks array

      newBookmarks = this.state.bookmarks.filter(
        (bookmark) => bookmark.id !== recipeId,
      );

      console.log("Filtered bookmarks", newBookmarks);
    } else {
      // Add to bookmark

      newBookmarks = [...this.state.bookmarks, { ...recipe, bookmarked: true }];

      console.log("Recipe added to new bookmarks", newBookmarks);
    }

    // Create a new recipe object with updated bookmarked status

    const updatedRecipe: Recipe = {
      ...recipe,
      bookmarked: !isCurrentlyBookmarked,
    };

    // Mutate the state to include the new updated recipe and bookmarks

    this.state = {
      ...this.state,
      recipe: updatedRecipe,
      bookmarks: newBookmarks,
    };

    // Saving the newBookmarks to the this.bookmarks array
    this.bookmarks = newBookmarks;
    console.log(isCurrentlyBookmarked, this.bookmarks);

    // Save the bookmarks now to local storage or remove the bookmark

    this.saveToLocalStorage();
    // And notify all observers of the change
    this.notify();
  }

  //   Update the subscribers of state change

  private notify(): void {
    console.log("State has changed. Notifying observers");
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

    console.log("this.bookmarks in loadbookmarks method", this.bookmarks);

    return this.bookmarks;
  }

  // Helper method for checking if the current recipe is bookmarked, returns a boolean value

  private isBookmarked(recipeId: string): boolean {
    console.log(recipeId);

    console.log(
      "The current bookmarks array from isBookmarked method: ",
      this.bookmarks,
    );

    const isBookmarked = this.state.bookmarks.some(
      (bookmark) => bookmark.id === recipeId,
    );

    console.log("isBookmarked variable value is: ", isBookmarked);

    return isBookmarked;
  }
}
