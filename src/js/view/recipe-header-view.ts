import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";

export class RecipeHeaderView extends AbstractView<HTMLElement, HTMLElement> {
  private currentRecipe: Recipe | undefined;
  private state: State | undefined;

  constructor(hostEl: HTMLElement, state: State | undefined) {
    super("recipe__header-template", hostEl, "recipe-header", false);

    this.state = state;

    this.configure();
    this.renderContent();
  }

  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);

    // pass the current recipe from state to recipe prop
    this.currentRecipe = this.state?.getState().recipe;
  }

  renderContent(): void {
    console.log("Recipe header view rendered");

    const recipe = this.currentRecipe;

    this.element.innerHTML = "";

    const markup = `
    
    <img
    src="${recipe?.image_url}"
    alt="${recipe?.title}"
    class="recipe__img"
  />

  <figcaption class="recipe__title-container">
    <h1 class="recipe__title">
      <span>${recipe?.title}</span>
    </h1>
  </figcaption>
    
    `;

    this.element.insertAdjacentHTML("beforeend", markup);
  }

  //  Includes state as the arg even if method not used to mantain consistency with the
  // Abstract class
  update(state: AppState): void {}
}
