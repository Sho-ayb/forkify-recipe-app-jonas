import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";

export class RecipeDirectionsView extends AbstractView<
  HTMLElement,
  HTMLElement
> {
  private currentRecipe: Recipe | undefined;
  private state: State | undefined;

  constructor(hostEl: HTMLElement, state: State | undefined) {
    super("recipe__directions-template", hostEl, "recipe-directions", false);

    this.state = state;

    this.configure();
  }

  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);
    this.currentRecipe = this.state?.getState().recipe;
    // Render the initial view
    this.renderContent();
  }

  renderContent(): void {
    console.log("The directions view has been rendered");

    const recipe = this.currentRecipe;

    const markup = `
    
    <p class="recipe__directions-text">
    This recipe was carefully designed and tested by

    <span class="recipe__directions-text--publisher"
      >${recipe?.publisher}</span
    >. Please check out directions at their website.
  </p>
  <a
    href="${recipe?.source_url}"
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
