import { AbstractView } from "./abstract-view";
import { State } from "js/model/state";
import { AppState, Recipe } from "js/model/interfaces";

export class BookmarksView extends AbstractView<HTMLElement, HTMLElement> {
  private state: State;
  private bookmarks: Recipe[];
  private onBookmarkSelect: (id: string) => void;

  constructor(
    hostEl: HTMLElement,
    state: State,
    onBookmarkSelect: (id: string) => void,
  ) {
    super(
      "recipe__bookmarks-main-template",
      hostEl,
      "recipe-bookmarks-header",
      false,
    );

    this.state = state;
    this.bookmarks = this.state.getState().bookmarks;
    this.onBookmarkSelect = onBookmarkSelect;

    this.configure();
  }

  configure(): void {
    this.state.subscribe(this);

    this.renderContent();
    // Initialise events **after** setting this.element
    this.initEventDelegation();
  }

  renderContent(): void {
    console.log(
      "The header bookmarks view has been rendered",
      this.bookmarks.length,
    );

    // Clear existing content
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
              
              <li class="bookmarks__list-item" data-id="${bookmark.id}">
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
    console.log("Bookmarks view component: ", state);
    this.bookmarks = state.bookmarks;
    this.renderContent();
  }

  private clearView(): void {
    while (this.element.firstChild) {
      this.element.removeChild(this.element.firstChild);
    }
  }

  private initEventDelegation() {
    this.element.addEventListener("click", (e: MouseEvent) => {
      console.log("bookmark has been clicked");

      const target = e.target as HTMLElement;
      const listItem = target.closest(".bookmarks__list-item") as HTMLLIElement;

      // gaurd clause
      if (!listItem) return;

      if (target.classList.contains("bx-trash")) {
        // stop the propagation up to the parent element list item
        e.stopPropagation();

        const recipeId = listItem?.dataset.id;

        // invoke the state method to remove the bookmark
        if (recipeId) {
          this.state.removeBookmark(recipeId);
        }
      }

      if (listItem) {
        // event prevent defaults prevents the default link from navigating to the source url
        e.preventDefault();

        const recipeId = listItem?.dataset.id;

        if (recipeId) {
          this.onBookmarkSelect(recipeId);
        }
      }
    });
  }
}
