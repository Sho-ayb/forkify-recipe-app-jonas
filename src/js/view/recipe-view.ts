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
    // Render the initial view - displays the message
    this.renderContent();
  }

  configure(): void {
    // Subscribe to the state
    this.state?.subscribe(this);
    // this.setupEventListener();
  }

  renderContent(): void {
    console.log(
      "this is recipe view render content: ",
      this.state?.getState().recipe,
    );

    // To clear the view before insertion
    this.clearView();

    // Get the current recipe from the state
    this.currentRecipe = this.state?.getState().recipe;

    if (this.currentRecipe) {
      // Gets rid of the initial message
      this.messageEl.style.display = "none";

      this.attach(true);
      console.log("intialises all recipe views");
      // Initialises all sub views of recipe view
      this.initialiseSubViews();
    } else {
      this.messageEl.style.display = "block";
      // Append the message elemenet to the host element
      this.hostEl.appendChild(this.messageEl);
    }
  }

  update(state: AppState): void {
    this.renderContent();
  }

  protected attach(insertAtBeginning: Boolean): void {
    if (this.currentRecipe) {
      super.attach(insertAtBeginning);
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
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  private initialiseSubViews(): void {
    //   Create the recipe header view
    this.recipeHeaderView = new RecipeHeaderView(this.element, this.state);

    //   Create the recipe details view
    this.recipeDetailsView = new RecipeDetailsView(this.element, this.state);

    //   Create the recipe ingredients view
    this.recipeIngredientsView = new RecipeIngredientsView(
      this.element,
      this.state,
    );

    //   Create the recipe directions view
    this.recipeDirectionsView = new RecipeDirectionsView(
      this.element,
      this.state,
    );
  }

  // private setupEventListener(): void {
  //   this.element.addEventListener(
  //     "servingsUpdated",
  //     this.handleServingsUpdate.bind(this),
  //   );
  // }

  // private handleServingsUpdate(event: CustomEvent): void {
  //   console.log(
  //     "Custom event from recipe details caught in recipe view: ",
  //     event.detail,
  //   );

  //   // Invoke the update method in recipe ingredients here and pass
  //   // in event.detail which is the new recipe

  //   this.recipe = event.detail;

  //   this.recipeIngredientsView?.update(this.recipe);
  // }
}
