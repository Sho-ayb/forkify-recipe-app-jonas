import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";

export class RecipeHeaderView extends AbstractView<HTMLElement, HTMLElement> {
  private recipe: Recipe;

  constructor(hostEl: HTMLElement, recipe: Recipe) {
    super("recipe__header-template", hostEl, "recipe-header", false);

    this.recipe = recipe;

    this.configure();
    this.renderContent();
  }

  configure(): void {}

  renderContent(): void {
    console.log("Recipe header view rendered");

    this.element.innerHTML = "";

    const markup = `
    
    <img
    src="${this.recipe.image_url}"
    alt="${this.recipe.title}"
    class="recipe__img"
  />

  <figcaption class="recipe__title-container">
    <h1 class="recipe__title">
      <span>${this.recipe.title}</span>
    </h1>
  </figcaption>
    
    `;

    this.element.insertAdjacentHTML("beforeend", markup);
  }

  //  Includes state as the arg even if not used to mantain consistency with the
  // Abstract class
  update(state: AppState): void {
    this.renderContent();
  }
}
