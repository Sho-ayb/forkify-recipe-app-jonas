import { AbstractView } from "./abstract-view";
import { AppState, Recipe, Ingredient } from "js/model/interfaces";
import { State } from "js/model/state";

// Importing a helper function to return the fractional part to a better format: 1/2, 1/4, 3/4
import { decimalToFraction } from "../utils/helpers";

export class RecipeIngredientsView extends AbstractView<
  HTMLElement,
  HTMLElement
> {
  private currentRecipe: Recipe | undefined;
  private state: State | undefined;

  constructor(hostEl: HTMLElement, state: State | undefined) {
    // The template element will remain empty since clone the template in the
    // render content method in order to insert each list item in to unordered list
    super("", hostEl, "recipe-ingredients", false);

    this.state = state;

    this.configure();
  }
  
  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);
    
    // Get the current recipe
    this.currentRecipe = this.state?.getState().recipe;
    // Render the initial view
    this.renderContent();
  }

  renderContent(): void {
    console.log("The ingredients view has been rendered");

    const template = document.getElementById(
      "recipe__ingredients-template",
    ) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;

    const ul = content.querySelector(
      ".recipe__ingredient-list",
    )! as HTMLUListElement;

    this.currentRecipe?.ingredients.forEach((ing) => {
      const markup = this.generateMarkup(ing);

      ul.insertAdjacentHTML("beforeend", markup);
    });

    this.element.appendChild(content);
  }

  private generateMarkup(ing: Ingredient): string {
    return `

    <li class="recipe__ingredient [ u-flex-row ]">
    <div class="recipe__icon-container">
      <svg class="recipe__icon">
        <use href="assets/img/icons.svg#icon-check"></use>
      </svg>
      </div>
      <div class="recipe__description">
      <span class="recipe__quantity">${ing.quantity === null ? "" : decimalToFraction(ing.quantity)}</span>
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    
    `;
  }

  update(state: AppState): void {
    console.log("This is the update method in recipe ingredients view.", state);
    this.renderContent();
  }
}
