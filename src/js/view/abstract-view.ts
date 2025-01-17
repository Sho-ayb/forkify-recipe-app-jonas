import { AppState, Observer } from "js/model/interfaces";

// An abstract class that views inherit from

export abstract class AbstractView<T extends HTMLElement, U extends HTMLElement>
  implements Observer
{
  // the template element in the DOM
  protected templateEl: HTMLTemplateElement | null;

  // the element with the id of app

  protected hostEl: T;

  //   the element to store the content of the template element

  protected element: U;

  constructor(
    templateId: string,
    hostElId: string | T,
    newElId: string | U,
    insertAtStart: boolean,
  ) {
    // query select elements

    this.templateEl = document.getElementById(
      templateId,
    )! as HTMLTemplateElement | null;

    console.log(this.templateEl);

    // This if condition simply allows for passing in a "string" instead of
    // directly passing in the hostEl element
    if (typeof hostElId === "string") {
      this.hostEl = document.getElementById(hostElId)! as T;
    } else {
      this.hostEl = hostElId;
    }

    // returns a document fragment, using cloneNode instead of importNode
    // since the element will be cloned in the same document.

    // also handles cases where the template element is empty or does not exist

    if (this.templateEl && this.templateEl.content.firstChild) {
      const cloneNode = this.templateEl.content.cloneNode(
        true,
      ) as DocumentFragment;

      this.element = cloneNode.firstElementChild as U;
    } else {
      console.warn(
        `Template element with id ${templateId} not found or is empty.`,
      );

      this.element = document.createElement("div") as unknown as U;
    }

    if (typeof newElId === "string") {
      this.element.id = newElId;
    }

    this.attach(insertAtStart);
  }

  abstract configure(): void;

  abstract renderContent(): void;

  abstract update(state: AppState): void;

  // Method to insert the this.element to the host element

  // Changing this attach method from private to protected so it can be
  // overridden in the recipeView class

  protected attach(insertAtBeginning: Boolean): void {
    this.hostEl.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element,
    );
  }
}
