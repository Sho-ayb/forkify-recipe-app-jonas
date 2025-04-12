import { AbstractView } from "./abstract-view";
import { State } from "js/model/state";
import { AppState, Recipe } from "js/model/interfaces";

export class ModalBookmarksView extends AbstractView<HTMLElement, HTMLElement> {
  private state: State;
  private bookmarks: Recipe[];
  private onModalBookmarkSelect: (id: string) => void;

  constructor(
    hostEl: HTMLElement,
    state: State,
    onModalBookmarkSelect: (id: string) => void,
  ) {
    super(
      "recipe__bookmarks-modal-template",
      hostEl,
      "recipe-bookmarks-modal",
      false,
    );

    this.state = state;
    this.bookmarks = this.state.getState().bookmarks;
    this.onModalBookmarkSelect = onModalBookmarkSelect;

    this.configure();
  }

  configure(): void {
    this.state.subscribe(this);
    this.renderContent();
    // Initialise events
    this.initModalEventDelegation();
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
                
          <li class="bookmarks__list-item bookmarks__list-item-mobile" data-id="${bookmark.id}">
          <a class="bookmarks__item"
            >${bookmark.title} - ${bookmark.publisher}</a
          >
          <i class='bx bx-trash' ></i>
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

  private initModalEventDelegation() {
    this.element.addEventListener("click", (e: MouseEvent) => {
      console.log("Modal bookmarks has been clicked");

      const target = e.target as HTMLElement;
      const listItem = target.closest(
        ".bookmarks__list-item-mobile",
      ) as HTMLLIElement;
      // Get the recipe id from the dataset
      const recipeId = listItem?.dataset.id;

      // gaurd clause
      if (!listItem) return;

      if (target.classList.contains("bx-trash")) {
        // Stop the propagation up to the parent element list item
        e.stopPropagation();

        // Invoke the state method to remove a bookmark
        if (recipeId) {
          this.state.removeBookmark(recipeId);
        }
        // Need to return to stop remaining code from executing
        return;
      }

      if (listItem) {
        e.preventDefault();

        if (recipeId) {
          this.onModalBookmarkSelect(recipeId);
        }
      }
    });
  }
}
