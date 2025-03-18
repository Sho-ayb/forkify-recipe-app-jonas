import { AbstractView } from "./abstract-view";

import { AppState, Ingredient, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";

export class RecipeDetailsView extends AbstractView<HTMLElement, HTMLElement> {
  private currentRecipe: Recipe | undefined;
  private state: State | undefined;
  private originalServings!: number | undefined;
  private originalIngredients!: Ingredient[] | undefined;
  // Elements in recipe details
  private increaseBtn: HTMLButtonElement | null = null;
  private decreaseBtn: HTMLButtonElement | null = null;
  private toggleIconBtn: HTMLButtonElement | null = null;
  // Prop for storing the boolean value returned from state.toggleBookmark
  private isBookmarked: Boolean = false;
  constructor(hostEl: HTMLElement, state: State | undefined) {
    super("recipe__details-template", hostEl, "recipe-details", false);
    this.state = state;
    this.configure();
  }
  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);

    this.currentRecipe = this.state?.getState().recipe;
    this.isBookmarked = this.currentRecipe?.bookmarked!;

    if (this.currentRecipe) {
      this.originalServings = this.currentRecipe?.servings;
      this.originalIngredients = this.currentRecipe?.ingredients;
    }

    // Render the initial view
    this.renderContent();
    // Initialise elements
    this.initialiseElements();
    // Setup event listeners
    this.setupEventListeners();
  }
  renderContent(): void {
    console.log("The details view has been rendered");
    if (!this.currentRecipe) return;
    const recipe = this.currentRecipe;
    const markup = `
    
    <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="assets/img/icons.svg#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${recipe?.cooking_time}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="assets/img/icons.svg#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${recipe?.servings}</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--decrease-servings">
          <svg>
            <use href="assets/img/icons.svg#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="assets/img/icons.svg#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>
    <div class="recipe__user-generated [ hidden ]">
      <svg>
        <use href="assets/img/icons.svg#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round bookmark" data-recipe-id="${recipe?.id}">
      <svg class="">
        <use href="assets/img/icons.svg#icon-bookmark${this.isBookmarked ? "-fill" : ""}"></use>
      </svg>
    </button>
  </div>

    `;
    this.element.insertAdjacentHTML("beforeend", markup);
  }
  update(state: AppState): void {
    console.log("RecipeDetailsView update method called"); // ADDED
    console.log("Current isBookmarked value:", this.isBookmarked); // ADDED
    // Since the state has changed we need to update the props
    this.currentRecipe = state.recipe;
    this.originalIngredients = this.currentRecipe?.ingredients;
    this.originalServings = this.currentRecipe?.servings;
    this.isBookmarked = this.currentRecipe?.bookmarked!;
    this.updateBookmarkIcon(this.isBookmarked);
  }
  private handleIncreaseServings(): void {
    if (this.currentRecipe) {
      this.updateServings(this.currentRecipe?.servings + 1);
    }
  }
  private handleDecreaseServings(): void {
    if (this.currentRecipe && this.currentRecipe.servings > 1) {
      this.updateServings(this.currentRecipe?.servings - 1);
    }
  }
  private updateServings(newServings: number): void {
    console.log("Serving is now:", newServings);
    if (
      !this.currentRecipe ||
      !this.originalServings ||
      !this.originalIngredients
    )
      return;
    // Calculate the ratio before update the
    // original servings with the new servings value
    const ratio = newServings / this.originalServings;
    console.log("Ratio:", ratio);
    // // Update the servings value in recipe object
    // this.currentRecipe.servings = newServings;
    const updatedRecipe = Object.assign(Object.assign({}, this.currentRecipe), {
      servings: newServings,
      ingredients: this.originalIngredients?.map((ing) =>
        Object.assign(Object.assign({}, ing), {
          quantity:
            ing.quantity !== null
              ? Math.round(ing.quantity * ratio * 100) / 100
              : null,
        }),
      ),
    });
    // Here we should update the elements that have been changed
    // Invoking updateValues instead of renderContent to render only
    // the elements that have changed values
    this.updateValues(updatedRecipe);
  }
  // Creating a method to update only the elements that have their
  // values changed
  private updateValues(updatedRecipe: Recipe): void {
    this.state?.setCurrentRecipe(updatedRecipe);
  }
  private handleToggleEvent(event: Event): void {
    event.preventDefault();
    if (this.state && this.currentRecipe) {
      this.isBookmarked = this.state.toggleBookmark(this.currentRecipe.id);
      console.log(
        "this is isbookmarked in recipe details handle toggle event method: ",
        this.isBookmarked,
      );
    } else {
      console.warn("State is undefined. Cannot toggle bookmark.");
    }
  }
  private updateBookmarkIcon(isBookmarked: Boolean): void {
    if (!this.toggleIconBtn) {
      console.warn("Toggle button icon not found.");
      return;
    }
    console.log("this.toggleIconBtn:", this.toggleIconBtn); // ADDED
    const useElement = this.toggleIconBtn.querySelector("use");
    console.log("useElement:", useElement); // Existing log
    if (useElement) {
      const newHref = isBookmarked
        ? "assets/img/icons.svg#icon-bookmark-fill"
        : "assets/img/icons.svg#icon-bookmark";
      useElement.setAttribute("href", newHref);
      console.log("New href set on button use element", useElement); // Existing log
      console.log(
        "useElement href after setAttribute:",
        useElement.getAttribute("href"),
      ); // ADDED
    } else {
      console.warn("Could not find use element inside button.");
    }
  }
  initialiseElements(): void {
    this.increaseBtn = this.element.querySelector(".btn--increase-servings");
    this.decreaseBtn = this.element.querySelector(".btn--decrease-servings");
    this.toggleIconBtn = this.element.querySelector(".bookmark");
  }
  setupEventListeners(): void {
    // Attaching event listeners to buttons
    if (this.increaseBtn) {
      this.increaseBtn?.addEventListener(
        "click",
        this.handleIncreaseServings.bind(this),
      );
    }
    if (this.decreaseBtn) {
      this.decreaseBtn?.addEventListener(
        "click",
        this.handleDecreaseServings.bind(this),
      );
    }
    if (this.toggleIconBtn) {
      this.toggleIconBtn.addEventListener("click", (event) => {
        // To prevent a page reload when the button is clicked
        event.preventDefault();
        console.log("Toggle button has been clicked");
        console.log("Toggle button after click event: ", this.toggleIconBtn);
        this.handleToggleEvent(event);
      });
    }
  }
}
