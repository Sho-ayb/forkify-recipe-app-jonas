import { AbstractView } from "./abstract-view";
import { State } from "js/model/state";
import { AppState, Recipe } from "js/model/interfaces";

export class ModalBookmarksView extends AbstractView<HTMLElement, HTMLElement> {
  private state: State;
  private bookmarks: Recipe[];

  constructor(hostEl: HTMLElement, state: State) {
    super(
      "recipe__bookmarks-modal-template",
      hostEl,
      "recipe-bookmarks-modal",
      false,
    );

    this.state = state;
    this.bookmarks = this.state.getState().bookmarks;

    this.configure();
  }

  configure(): void {
    this.state.subscribe(this);
    this.renderContent();
  }

  renderContent(): void {
    console.log("Rendering the bookmarks list in to the modal");

    this.clearView();

    if (this.bookmarks.length === 0) {
      const errorMarkup = `
          
        <div class="error">
        <div class="error__icon">
          <svg>
            <use
              href="assets/img/icons.svg#icon-alert-triangle"
            ></use>
          </svg>
        </div>
        <p class="error__message">
          No bookmarks yet. Find a nice recipe and bookmark it 😊
        </p>
      </div>
          `;

      this.element.insertAdjacentHTML("beforeend", errorMarkup);
    } else {
      const bookMarkup = this.bookmarks
        .map((bookmark) => {
          return `
                
                <li class="bookmarks__list-item">
                <a href="${bookmark.source_url}" class="bookmarks__item"
                  >${bookmark.title} - ${bookmark.publisher}</a
                >
              </li>
                
                `;
        })
        .join("");

      this.element.insertAdjacentHTML("beforeend", bookMarkup);
    }
  }

  update(state: AppState): void {
    console.log("Modal bookmarks view component", state);
    this.bookmarks = state.bookmarks;
    this.renderContent();
  }

  private clearView(): void {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }
}
