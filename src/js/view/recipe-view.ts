import { AbstractView } from "./abstract-view";
import { AppState, Recipe } from "js/model/interfaces";

export class RecipeView extends AbstractView<HTMLDivElement, HTMLElement> {
  private messageEl: HTMLDivElement;
  private recipe: Recipe | undefined;

  constructor(hostEl: HTMLDivElement, recipe: Recipe | undefined) {
    super("recipe__detail-template", hostEl, "recipe-result", true);

    // Initailise recipe prop
    this.recipe = recipe;
    this.messageEl = this.createMessageElement();

    console.log(this.recipe);

    this.renderContent();
    this.configure();
  }

  configure(): void {}

  renderContent(): void {
    console.log(this.recipe);

    if (this.recipe) {
      this.messageEl.style.display = "none";
      // Clear existing content
      while (this.hostEl.firstChild) {
        this.hostEl.removeChild(this.hostEl.firstChild);
      }

      this.hostEl.innerHTML = "";

      console.log("intialises all recipe views");
    } else {
      this.messageEl.style.display = "block";
      // Append the message elemenet to the host element
      this.hostEl.appendChild(this.messageEl);
    }
  }

  update(state: AppState): void {}

  private createMessageElement(): HTMLDivElement {
    const messageEl = document.createElement("div");
    const paraEl = document.createElement("p");

    messageEl.className = "message";
    paraEl.textContent =
      "Start by searching for a recipe or ingredient. Have fun! 😊 ";

    messageEl.appendChild(paraEl);

    return messageEl;
  }
}
