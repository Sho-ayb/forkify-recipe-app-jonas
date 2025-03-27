import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";
import { RecipeHeaderView } from "./recipe-header-view";
import { RecipeDetailsView } from "./recipe-details-view";
import { RecipeIngredientsView } from "./recipe-ingredients-view";
import { RecipeDirectionsView } from "./recipe-directions-view";

export class RecipeView extends AbstractView<HTMLDivElement, HTMLElement> {
  private messageEl: HTMLDivElement;
  private state: State | undefined;
  private currentRecipe: Recipe | undefined;
  private recipeHeaderView: RecipeHeaderView | null = null;
  private recipeDetailsView: RecipeDetailsView | null = null;
  private recipeIngredientsView: RecipeIngredientsView | null = null;
  private recipeDirectionsView: RecipeDirectionsView | null = null;

  constructor(hostEl: HTMLDivElement, state?: State | undefined) {
    super("recipe__container-template", hostEl, "recipe-result", false);

    // Initialis the state and create the message element
    this.state = state;
    this.messageEl = this.createMessageElement();

    // Initialise the configure method
    this.configure();
  }

  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);
    this.currentRecipe = this.state?.getState().recipe;
    // Render the initial view - displays the message
    this.renderContent(false);
  }

  renderContent(reinitialise: Boolean = true): void {
    // Get the current recipe from the state
    this.currentRecipe = this.state?.getState().recipe;
    console.log("renderContent currentRecipe", this.currentRecipe);

    if (reinitialise) {
      // To clear the view before insertion
      this.clearView();
      // Gets rid of the initial message
      this.messageEl.style.display = "none";

      // Re-clone the template content
      if (this.templateEl && this.templateEl.content.firstChild) {
        const cloneNode = this.templateEl.content.cloneNode(
          true,
        ) as DocumentFragment;

        this.element = cloneNode.firstElementChild as HTMLElement;
      }

      this.attach(true);
    } else {
      this.messageEl.style.display = "block";
      // Append the message elemenet to the host element
      this.hostEl.appendChild(this.messageEl);
    }
  }

  update(state: AppState): void {
    console.log("Recipe view is updating with the state", state);
    console.log("Recipe view component: ", state);
    this.renderContent(true);
  }

  // This method overrides the method in abstract class
  protected attach(insertAtBeginning: Boolean): void {
    if (this.currentRecipe) {
      super.attach(insertAtBeginning);
      console.log("intialises all recipe sub views");
      // Initialises all sub views of recipe view

      this.initialiseSubViews();
    }
  }

  private createMessageElement(): HTMLDivElement {
    const messageEl = document.createElement("div");
    const paraEl = document.createElement("p");

    messageEl.className = "message";
    paraEl.textContent =
      "Start by searching for a recipe or ingredient. Have fun! 😊 ";

    messageEl.appendChild(paraEl);

    return messageEl;
  }

  private clearView(): void {
    while (this.hostEl.firstChild) {
      this.hostEl.removeChild(this.hostEl.firstChild);
    }
  }

  private initialiseSubViews(): void {
    this.recipeHeaderView = new RecipeHeaderView(this.element, this.state);
    this.recipeDetailsView = new RecipeDetailsView(this.element, this.state);
    this.recipeIngredientsView = new RecipeIngredientsView(
      this.element,
      this.state,
    );
  }
}
