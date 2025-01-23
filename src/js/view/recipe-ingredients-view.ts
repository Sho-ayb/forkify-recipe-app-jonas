import { AbstractView } from "./abstract-view";
import { AppState, Recipe, Ingredient } from "js/model/interfaces";

export class RecipeIngredientsView extends AbstractView<
  HTMLElement,
  HTMLElement
> {
  private recipe: Recipe;

  constructor(hostEl: HTMLElement, recipe: Recipe) {
    // super("recipe__ingredients-template", hostEl, "recipe-ingredients", false);

    super("", hostEl, "recipe-ingredients", false);

    this.recipe = recipe;

    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    console.log("The ingredients view has been rendered");

    const template = document.getElementById(
      "recipe__ingredients-template",
    ) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;

    const ul = content.querySelector(
      ".recipe__ingredient-list",
    )! as HTMLUListElement;

    this.recipe.ingredients.forEach((ing) => {
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
      <span class="recipe__quantity">${ing.quantity === null ? "" : ing.quantity}</span>
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>
    
    `;
  }

  update(state: AppState): void {
    console.log("This is the update method in recipe ingredients view.", state);
  }
}
