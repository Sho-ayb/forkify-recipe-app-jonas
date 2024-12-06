import logoImg from "../../assets/img/logo.png";

// UIController controls the main UI related operations including responsive layout
export class UIController {
  private aside: HTMLElement | null;

  private asideHeader: HTMLElement | null;

  private asideHeaderCloseButton: HTMLElement | null;

  private searchButton: HTMLElement | null;

  private searchResultsButton: HTMLElement | null;

  private headerContainer: HTMLElement | null;

  private headerLogo: HTMLImageElement | null;

  private modal: HTMLElement | null;

  private overlay: HTMLElement | null;

  private closeModalButton: HTMLElement | null;

  private bookmarksButton: HTMLButtonElement | null;

  private bookmarks: HTMLElement | null;

  private bookmarksList: NodeListOf<HTMLUListElement>;

  private errorEl: NodeListOf<HTMLElement>;

  constructor() {
    this.aside = document.querySelector(
      ".recipe__search-list-container"
    )! as HTMLElement | null;
    this.asideHeader = document.querySelector(
      ".recipe__search-list-header"
    )! as HTMLElement | null;
    this.asideHeaderCloseButton = document.querySelector(
      ".recipe__search-list-header i"
    )! as HTMLElement | null;
    this.searchButton = document.querySelector(
      ".header__search-form-btn"
    )! as HTMLElement | null;
    this.searchResultsButton = document.querySelector(
      ".open__search-results"
    )! as HTMLElement | null;
    this.headerContainer = document.querySelector(
      ".header"
    )! as HTMLElement | null;
    this.headerLogo = document.querySelector(
      ".header__logo"
    ) as HTMLImageElement | null;
    this.modal = document.getElementById(
      "modal-bookmarks"
    ) as HTMLElement | null;
    this.overlay = document.querySelector(".overlay") as HTMLElement | null;
    this.closeModalButton = document.querySelector(
      ".close__modal"
    ) as HTMLElement | null;
    this.bookmarksButton = document.querySelector(
      ".nav__btn--bookmark-recipe"
    ) as HTMLButtonElement | null;
    this.bookmarks = document.querySelector(".bookmarks") as HTMLElement | null;
    this.bookmarksList = document.querySelectorAll(
      ".bookmarks__list"
    ) as NodeListOf<HTMLUListElement>;
    this.errorEl = document.querySelectorAll(
      ".error"
    ) as NodeListOf<HTMLElement>;

    // invoke the init method here

    this.init();
  }

  private init(): void {
    // Insert the forkify logo
    this.insertLogo();

    // Handle initial layout based on the viewport size
    this.handleViewportChange();

    // Setup event listeners
    this.setupEventListeners();

    // Check if there is any bookmarks list items
    this.checkBookmarks();

    // Add a resize event listener
    window.addEventListener("resize", this.handleViewportChange.bind(this));
  }

  private insertLogo(): void {
    if (this.headerContainer) {
      this.headerLogo = document.createElement("img");
      this.headerLogo.src = logoImg;
      this.headerLogo.alt = "Forkify Logo";
      this.headerLogo.className = "header__logo";
      this.headerContainer.insertAdjacentElement("afterbegin", this.headerLogo);
    }
  }

  private handleViewportChange(): void {
    this.updateHoverListener();
  }

  private setupEventListeners(): void {
    const {
      searchButton,
      searchResultsButton,
      aside,
      asideHeaderCloseButton,
      bookmarks,
      bookmarksButton,
      modal,
      overlay,
      closeModalButton,
    } = this;

    console.log(bookmarks);

    searchButton?.addEventListener("click", (e) => {
      e.preventDefault();

      if (aside) {
        aside?.classList.toggle("active");
        aside?.classList.toggle("hidden");
      }
    });

    searchResultsButton?.addEventListener("click", () => {
      if (aside) {
        aside?.classList.toggle("active");
        aside?.classList.toggle("hidden");
      }
    });

    asideHeaderCloseButton?.addEventListener("click", () => {
      if (aside) {
        aside?.classList.toggle("active");
        aside?.classList.toggle("hidden");
      }
    });

    if (bookmarksButton && modal && overlay && closeModalButton) {
      // Show modal on mobile view when the bookmarks button is clicked

      bookmarksButton.addEventListener("click", (e) => {
        console.log("bookmarks button clicked");

        e.preventDefault();
        if (window.innerWidth < 1024) {
          bookmarks?.classList.add("hidden");
        } else {
          bookmarks?.classList.remove("hidden");
        }

        if (window.innerWidth < 1024) {
          if (modal.classList.contains("visible")) {
            modal.classList.add("hidden");
            overlay.classList.add("hidden");
            modal.classList.remove("visible");
            overlay.classList.remove("visible");
          } else {
            modal.classList.add("visible");
            overlay.classList.add("visible");
            modal.classList.remove("hidden");
            overlay.classList.remove("hidden");
          }
        }
      });

      // Close modal on clicking the close button or overlay
      closeModalButton.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("visible");
        overlay.classList.add("hidden");
        overlay.classList.remove("visible");
      });

      overlay.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.classList.remove("visible");
        overlay.classList.add("hidden");
        overlay.classList.remove("visible");
      });

      this.updateHoverListener();
    }
  }

  // A function to handle the bookmarks list dropdown when the viewport is >= to 1024px
  // this function can then be invoked inside of handleViewportChange

  private updateHoverListener(): void {
    const {
      aside,
      asideHeader,
      searchResultsButton,
      bookmarksButton,
      bookmarks,
      bookmarksList,
    } = this;

    if (window.innerWidth >= 768) {
      // Show the aside element and hide the aside headear and search results button in desktop view
      aside?.classList.remove("hidden");
      aside?.classList.remove("active");
      asideHeader?.classList.add("hidden");
      searchResultsButton?.classList.add("hidden");
    } else {
      // Hide aside element and show the aside header in mobile view
      aside?.classList.add("hidden");
      asideHeader?.classList.remove("hidden");
      searchResultsButton?.classList.remove("hidden");
    }

    if (window.innerWidth >= 1024) {
      // When the bookmark button is hovered over
      bookmarksButton?.addEventListener("mouseenter", () => {
        bookmarksList?.forEach((bookList) => {
          if (!bookList.closest(".modal")) {
            bookmarks?.classList.add("visible");
            bookmarks?.classList.remove("hidden");
          }
        });
      });
      // When the mouse leaves hovering over the bookmark button
      bookmarksButton?.addEventListener("mouseleave", () => {
        // Delay the removing the visible class
        setTimeout(() => {
          bookmarksList?.forEach((bookList) => {
            if (!bookList.matches(":hover")) {
              if (!bookList.closest(".modal")) {
                bookmarks?.classList.remove("visible");
                bookmarks?.classList.add("hidden");
              }
            }
          });
        }, 300);
      });

      // Also need event listener(s) on the bookmarks list,
      // so when the mouse enters and leaves the bookmark list
      // we cause the bookmark to also be visible or hidden

      bookmarksList?.forEach((bookList) => {
        bookList.addEventListener("mouseenter", () => {
          if (!bookList.closest(".modal")) {
            bookmarks?.classList.add("visible");
          }
        });

        bookList.addEventListener("mouseleave", () => {
          setTimeout(() => {
            if (!bookList.closest(".modal")) {
              bookmarks?.classList.remove("visible");
            }
          }, 300);
        });
      });
    } else {
      // Remove the event listeners in mobile view to prevent uninteded behaviour

      bookmarksButton?.removeEventListener("mouseenter", () => {});
      bookmarksButton?.removeEventListener("mouseleave", () => {});
      bookmarksList?.forEach((bookList) => {
        bookList.removeEventListener("mouseenter", () => {});
        bookList.removeEventListener("mouseleave", () => {});
      });
    }
  }

  // Function to determine if the bookmarks list is empty

  private checkBookmarks(): void {
    console.log(this.bookmarksList);

    this.bookmarksList?.forEach((bookmarksList, index) => {
      const errorDiv = this.errorEl[index];

      if (bookmarksList.children.length > 1) {
        errorDiv.classList.add("hidden");
      } else {
        errorDiv.classList.remove("hidden");
      }
    });
  }
}
