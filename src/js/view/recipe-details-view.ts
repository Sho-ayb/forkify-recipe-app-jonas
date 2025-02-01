import { AbstractView } from "./abstract-view";

import { AppState, Ingredient, Recipe } from "js/model/interfaces";

import { BookmarkToggleEvent } from "../../events";

import { State } from "js/model/state";

export class RecipeDetailsView extends AbstractView<HTMLElement, HTMLElement> {
  private currentRecipe: Recipe | undefined;
  private state: State | undefined;
  private originalServings!: number | undefined;
  private originalIngredients!: Ingredient[] | undefined;

  constructor(hostEl: HTMLElement, state: State | undefined) {
    super("recipe__details-template", hostEl, "recipe-details", false);

    this.state = state;

    this.configure();
  }

  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);

    this.currentRecipe = this.state?.getState().recipe;

    if (this.currentRecipe) {
      this.originalServings = this.currentRecipe?.servings;
      this.originalIngredients = this.currentRecipe?.ingredients;
    }

    // Render the initial view
    this.renderContent();
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
    <button class="btn--round bookmark">
      <svg class="">
        <use href="assets/img/icons.svg#icon-bookmark"></use>
      </svg>
    </button>
  </div>

    `;

    this.element.insertAdjacentHTML("beforeend", markup);
  }

  update(state: AppState): void {
    this.currentRecipe = state.recipe;
    this.renderContent();
  }

  private setupEventListeners(): void {
    const increaseBtn = this.element.querySelector(".btn--increase-servings");
    const decreaseBtn = this.element.querySelector(".btn--decrease-servings");
    const toggleIconBtn = this.element.querySelector(".bookmark");

    // Attaching event listeners to buttons

    if (increaseBtn) {
      increaseBtn?.addEventListener(
        "click",
        this.handleIncreaseServings.bind(this),
      );
    }

    if (decreaseBtn) {
      decreaseBtn?.addEventListener(
        "click",
        this.handleDecreaseServings.bind(this),
      );
    }

    if (toggleIconBtn) {
      toggleIconBtn.addEventListener("click", () => {
        const customEvent = new CustomEvent("bookmarkToggle", {
          bubbles: true,
          detail: { button: toggleIconBtn as HTMLElement },
        }) as BookmarkToggleEvent;

        // Despatch the event when it has been triggered
        this.element.dispatchEvent(customEvent);
      });
    }
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

    const updatedRecipe: Recipe = {
      ...this.currentRecipe,
      servings: newServings,
      ingredients: this.originalIngredients?.map((ing) => ({
        ...ing,
        quantity:
          ing.quantity !== null
            ? Math.round(ing.quantity * ratio * 100) / 100
            : null,
      })),
    };

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
}
