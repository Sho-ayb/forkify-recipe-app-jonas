// An abstract class that views inherit from

export abstract class AbstractView<
  T extends HTMLElement,
  U extends HTMLElement,
> {
  // the template element in the DOM
  protected templateEl: HTMLTemplateElement;

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
    )! as HTMLTemplateElement;

    if (typeof hostElId === "string") {
      this.hostEl = document.getElementById(hostElId)! as T;
    } else {
      this.hostEl = hostElId;
    }

    // returns a document fragment, using cloneNode instead of importNode
    // since the element will be cloned in the same document.

    const cloneNode = this.templateEl.content.cloneNode(
      true,
    ) as DocumentFragment;

    this.element = cloneNode.firstElementChild as U;

    if (typeof newElId === "string") {
      this.element.id = newElId;
    }

    this.attach(insertAtStart);
  }

  abstract configure(): void;

  abstract renderContent(): void;

  private attach(insertAtBeginning: Boolean): void {
    this.hostEl.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element,
    );
  }
}
