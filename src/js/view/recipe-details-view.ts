import { AbstractView } from "./abstract-view";

import { AppState, Ingredient, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";

export class RecipeDetailsView extends AbstractView<HTMLElement, HTMLElement> {
  private recipe: Recipe;
  private originalServings: number;
  private originalIngredients: Ingredient[];

  constructor(hostEl: HTMLElement, recipe: Recipe, state: State | undefined) {
    super("recipe__details-template", hostEl, "recipe-details", false);

    this.recipe = recipe;
    this.originalServings = this.recipe.servings;
    this.originalIngredients = this.recipe.ingredients;

    this.configure();
  }

  configure(): void {
    // Render the initial view
    this.renderContent();
    // Setup event listeners
    this.setupEventListeners();
  }

  renderContent(): void {
    console.log("The details view has been rendered");

    const markup = `
    
    <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="assets/img/icons.svg#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${this.recipe.cooking_time}</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="assets/img/icons.svg#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">4</span>
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
    <button class="btn--round bookmark">
      <svg class="">
        <use href="assets/img/icons.svg#icon-bookmark"></use>
      </svg>
    </button>
  </div>

    `;

    this.element.insertAdjacentHTML("beforeend", markup);
  }

  update(state: AppState): void {}

  private setupEventListeners(): void {
    const increaseBtn = this.element.querySelector(".btn--increase-servings");
    const decreaseBtn = this.element.querySelector(".btn--decrease-servings");

    // Attaching event listeners to buttons
    increaseBtn?.addEventListener(
      "click",
      this.handleIncreaseServings.bind(this),
    );

    decreaseBtn?.addEventListener(
      "click",
      this.handleDecreaseServings.bind(this),
    );
  }

  private handleIncreaseServings(): void {
    this.updateServings(this.recipe.servings + 1);
  }

  private handleDecreaseServings(): void {
    if (this.recipe.servings > 1) {
      this.updateServings(this.recipe.servings - 1);
    }
  }

  private updateServings(newServings: number): void {
    console.log("Serving is now:", newServings);

    // Calculate the ratio before update the
    // original servings with the new servings value

    const ratio = newServings / this.originalServings;

    console.log("Ratio:", ratio);

    // Update the servings value in recipe object
    this.recipe.servings = newServings;

    // Update the ingredients
    this.recipe.ingredients = this.originalIngredients.map((ing) => ({
      ...ing,
      quantity:
        ing.quantity !== null
          ? Math.round(ing.quantity * ratio * 100) / 100
          : null,
    }));

    console.log(this.recipe.ingredients);

    // Here we should update the elements that have been changed
    // Invoking updateValues instead of renderContent to render only
    // the elements that have changed values

    this.updateValues();
  }

  // Creating a method to update only the elements that have their
  // values changed

  private updateValues(): void {
    const servingsEl = this.element.querySelector(".recipe__info-data--people");

    console.log(servingsEl);

    if (servingsEl) {
      servingsEl.textContent = this.recipe.servings.toString();
    }

    // Creating a custom event that will bubble up to recipeView
    // we can handle the event by invoking the update on
    // recipe ingredients view

    const event = new CustomEvent("servingsUpdated", {
      detail: this.recipe,
      bubbles: true,
    });

    this.element.dispatchEvent(event);
  }
}
