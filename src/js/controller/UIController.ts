import { CLIENT_RENEG_LIMIT } from "tls";
import logoImg from "../../assets/img/logo.png";
import { BookmarkToggleEvent } from "../../events";

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

  // Private prop for initialising a single place for hover listener
  private hoverListenerInitialised = false;

  constructor() {
    this.aside = document.querySelector(
      ".recipe__search-list-container",
    )! as HTMLElement | null;
    this.asideHeader = document.querySelector(
      ".recipe__search-list-header",
    )! as HTMLElement | null;
    this.asideHeaderCloseButton = document.querySelector(
      ".recipe__search-list-header i",
    )! as HTMLElement | null;
    this.searchButton = document.querySelector(
      ".header__search-form-btn",
    )! as HTMLElement | null;
    this.searchResultsButton = document.querySelector(
      ".open__search-results",
    )! as HTMLElement | null;
    this.headerContainer = document.querySelector(
      ".header",
    )! as HTMLElement | null;
    this.headerLogo = document.querySelector(
      ".header__logo",
    ) as HTMLImageElement | null;
    this.modal = document.getElementById(
      "modal-bookmarks",
    ) as HTMLElement | null;
    this.overlay = document.querySelector(".overlay") as HTMLElement | null;
    this.closeModalButton = document.querySelector(
      ".close__modal",
    ) as HTMLElement | null;
    this.bookmarksButton = document.querySelector(
      ".nav__btn--bookmark-recipe",
    ) as HTMLButtonElement | null;
    this.bookmarks = document.querySelector(
      ".bookmarks",
    ) as HTMLDivElement | null;
    this.bookmarksList = document.querySelectorAll(
      ".nav .nav__list .nav__item--bookmark .bookmarks .bookmarks__list, .modal .modal__content .bookmarks__list",
    ) as NodeListOf<HTMLUListElement>;

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

    // Add a resize event listener
    window.addEventListener(
      "resize",
      this.debounce(this.handleViewportChange.bind(this), 250),
    );
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
    const isDesktopView = window.innerWidth >= 768;

    // Update aside visibility
    if (isDesktopView) {
      this.showAside();
    } else {
      this.hideAside();
    }

    // Update the asideHeader visibility
    if (isDesktopView) {
      this.asideHeader?.classList.add("hidden");
    } else {
      this.asideHeader?.classList.remove("hidden");
    }

    // Check if the hoverListenerInitialised prop is false then
    // Update hover listeners

    if (!this.hoverListenerInitialised) {
      this.updateHoverListener();
      // Set the hoverListenerInitialised prop to true here
      this.hoverListenerInitialised = true;
    }
  }

  private showAside(): void {
    this.aside?.classList.remove("hidden");
    this.aside?.classList.add("active");
  }

  private hideAside(): void {
    this.aside?.classList.add("hidden");
    this.aside?.classList.remove("active");
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

    // Show/hide aside when search button or search results button is clicked
    searchButton?.addEventListener("click", (e) => {
      e.preventDefault();

      if (aside?.classList.contains("hidden")) {
        this.showAside();
      }
    });

    searchResultsButton?.addEventListener("click", () => {
      if (aside?.classList.contains("hidden")) {
        this.showAside();
      } else {
        this.hideAside();
      }
    });

    // Close aside when the close button is clicked
    asideHeaderCloseButton?.addEventListener("click", () => {
      this.hideAside();
    });

    // Handle bookmarks button click (for mobile view)
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
    }
  }

  // A function to handle the bookmarks list dropdown when the viewport is >= to 1024px
  // this function can then be invoked inside of handleViewportChange

  private updateHoverListener(): void {
    const { searchResultsButton, bookmarksButton, bookmarksList } = this;

    if (window.innerWidth >= 768) {
      searchResultsButton?.classList.add("hidden");
    } else {
      searchResultsButton?.classList.remove("hidden");
    }

    if (window.innerWidth >= 1024) {
      if (!this.hoverListenerInitialised) {
        // Event listener added to the bookmarks button

        bookmarksButton?.addEventListener(
          "mouseenter",
          this.bookmarkButtonEnterListener.bind(this),
        );

        bookmarksButton?.addEventListener(
          "mouseleave",
          this.bookmarksButtonLeaveListener.bind(this),
        );

        // Event listener added to the bookmarks list: which are two:
        // one in the nav menu and the other in the modal

        bookmarksList?.forEach((booklist) => {
          booklist.addEventListener(
            "mouseenter",
            this.bookmarkButtonEnterListener.bind(this),
          );
          booklist.addEventListener(
            "mouseleave",
            this.bookmarksButtonLeaveListener.bind(this),
          );
        });
      } else {
        // If the hoverListener is set to a true then we need to remove all the event listeners

        // Remove the event listeners on the bookmarks button element
        bookmarksButton?.removeEventListener(
          "mouseenter",
          this.bookmarkButtonEnterListener,
        );
        bookmarksButton?.removeEventListener(
          "mouseleave",
          this.bookmarksButtonLeaveListener,
        );

        // Remove the event listeners on the bookmarks list element

        bookmarksList.forEach((bookList) => {
          bookList?.removeEventListener(
            "mouseenter",
            this.bookmarkButtonEnterListener,
          );
          bookList?.removeEventListener(
            "mouseleave",
            this.bookmarksButtonLeaveListener,
          );
        });
      }
    }
  }

  // Methods to handle the visibility of bookmarks

  private bookmarkButtonEnterListener(): void {
    const { bookmarksList, bookmarks } = this;

    bookmarksList?.forEach((bookList) => {
      if (!bookList.closest(".modal")) {
        bookmarks?.classList.add("visible");
        // bookmarks?.classList.remove("hidden");
      }
    });
  }

  private bookmarksButtonLeaveListener(): void {
    const { bookmarksList, bookmarks } = this;

    setTimeout(() => {
      bookmarksList?.forEach((bookList) => {
        if (!bookList.matches(":hover") && !bookList.closest(".modal")) {
          // bookmarks?.classList.remove("visible");
          // bookmarks?.classList.add("hidden");
        }
      });
    }, 300);
  }

  // Prevents there from function handle viewport change from being invoked multiple times
  private debounce(func: Function, delay: number): (...args: any[]) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
}
