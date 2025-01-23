import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";
import { State } from "js/model/state";
import { RecipeHeaderView } from "./recipe-header-view";
import { RecipeDetailsView } from "./recipe-details-view";
import { RecipeIngredientsView } from "./recipe-ingredients-view";
import { RecipeDirectionsView } from "./recipe-directions-view";

export class RecipeView extends AbstractView<HTMLDivElement, HTMLElement> {
  private messageEl: HTMLDivElement;
  private recipe: Recipe | undefined;
  private state: State | undefined;
  private recipeHeaderView: RecipeHeaderView | null = null;
  private recipeDetailsView: RecipeDetailsView | null = null;
  private recipeIngredientsView: RecipeIngredientsView | null = null;
  private recipeDirectionsView: RecipeDirectionsView | null = null;

  constructor(
    hostEl: HTMLDivElement,
    recipe?: Recipe | undefined,
    state?: State,
  ) {
    super("recipe__container-template", hostEl, "recipe-result", false);

    // Initailise recipe prop and state
    this.recipe = recipe;
    this.state = state;
    this.messageEl = this.createMessageElement();

    // Render the initial view - displays the message
    this.renderContent();
    // Initialise the configure method
    this.configure();
  }

  configure(): void {
    this.setupEventListener();
  }

  renderContent(): void {
    console.log("this is recipe view render content: ", this.recipe);

    // To clear the view before insertion
    this.clearView();

    if (this.recipe) {
      // Gets rid of the initial message
      this.messageEl.style.display = "none";

      this.attach(true);
      console.log("intialises all recipe views");
      //   Create the recipe header view
      this.recipeHeaderView = new RecipeHeaderView(this.element, this.recipe);
      //   Subscribe to state
      this.state?.subscribe(this.recipeHeaderView);
      //   Create the recipe details view
      this.recipeDetailsView = new RecipeDetailsView(
        this.element,
        this.recipe,
        this.state,
      );
      // Subscribe to state
      this.state?.subscribe(this.recipeDetailsView);
      //   Create the recipe ingredients view
      this.recipeIngredientsView = new RecipeIngredientsView(
        this.element,
        this.recipe,
      );
      //   Subscribe to state
      this.state?.subscribe(this.recipeIngredientsView);
      //   Create the recipe directions view
      this.recipeDirectionsView = new RecipeDirectionsView(
        this.element,
        this.recipe,
      );
      // Subscribe to state
      this.state?.subscribe(this.recipeDirectionsView);
    } else {
      this.messageEl.style.display = "block";
      // Append the message elemenet to the host element
      this.hostEl.appendChild(this.messageEl);
    }
  }

  update(state: AppState): void {
    this.recipe = state.recipe;
    this.renderContent();
  }

  protected attach(insertAtBeginning: Boolean): void {
    if (this.recipe) {
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

  private setupEventListener(): void {
    this.element.addEventListener(
      "servingsUpdated",
      this.handleServingsUpdate.bind(this),
    );
  }

  private handleServingsUpdate(event: CustomEvent): void {
    console.log(
      "Custom event from recipe details caught in recipe view: ",
      event.detail,
    );

    // Invoke the update method in recipe ingredients here and pass
    // in event.detail which is the new recipe

    this.recipe = event.detail;

    this.recipeIngredientsView?.update(this.recipe);
  }
}
