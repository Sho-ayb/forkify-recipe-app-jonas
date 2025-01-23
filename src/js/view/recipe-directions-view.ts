import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";

export class RecipeDirectionsView extends AbstractView<
  HTMLElement,
  HTMLElement
> {
  private recipe: Recipe;

  constructor(hostEl: HTMLElement, recipe: Recipe) {
    super("recipe__directions-template", hostEl, "recipe-directions", false);

    this.recipe = recipe;

    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    console.log("The directions view has been rendered");

    const markup = `
    
    <p class="recipe__directions-text">
    This recipe was carefully designed and tested by

    <span class="recipe__directions-text--publisher"
      >${this.recipe.publisher}</span
    >. Please check out directions at their website.
  </p>
  <a
    href="${this.recipe.source_url}"
    class="recipe__directions--btn [ u-flex-inline ]"
    target="_blank"
  >
    <span>Directions</span>
    <svg class="search__icon">
      <use href="assets/img/icons.svg#icon-arrow-right"></use>
    </svg>
  </a>
    
    `;

    this.element.insertAdjacentHTML("beforeend", markup);
  }

  update(state: AppState): void {
    this.renderContent();
  }
}
