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

  constructor() {
    this.aside = document.querySelector(
      ".recipe__search-list-container"
    )! as HTMLElement;
    this.asideHeader = document.querySelector(
      ".recipe__search-list-header"
    )! as HTMLElement;
    this.asideHeaderCloseButton = document.querySelector(
      ".recipe__search-list-header i"
    )! as HTMLElement;
    this.searchButton = document.querySelector(
      ".header__search-form-btn"
    )! as HTMLElement;
    this.searchResultsButton = document.querySelector(
      ".open__search-results"
    )! as HTMLElement;
    this.headerContainer = document.querySelector(".header")! as HTMLElement;
    this.headerLogo = document.querySelector(
      ".header__logo"
    ) as HTMLImageElement;
    this.modal = document.getElementById("modal-bookmarks");
    this.overlay = document.querySelector(".overlay");
    this.closeModalButton = document.querySelector(".close__modal");
    this.bookmarksButton = document.querySelector(".nav__btn--bookmark-recipe");
    this.bookmarks = document.querySelector(".bookmarks");

    // invoke the init method here

    this.init();
  }

  private init(): void {
    // Insert the forkify logo
    this.insertLogo();

    // Handle initial layout based on the viewport size
    this.handleViewportChange();

    // Add a resize event listener
    window.addEventListener("resize", this.handleViewportChange.bind(this));

    // Setup event listeners
    this.setupEventListeners();
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
    const { aside, asideHeader, searchResultsButton } = this;

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

    console.log(bookmarksButton);

    searchButton?.addEventListener("click", (e) => {
      e.preventDefault();
      aside?.classList.toggle("active");
    });

    asideHeaderCloseButton?.addEventListener("click", () => {
      aside?.classList.remove("active");
    });

    searchResultsButton?.addEventListener("click", () => {
      aside?.classList.toggle("active");
    });

    if (bookmarksButton && modal && overlay && closeModalButton) {
      // Show modal on mobile view when the bookmarks button is clicked

      bookmarksButton.addEventListener("click", (e) => {
        console.log("bookmarks button clicked");

        e.preventDefault();
        if (window.innerWidth < 1024) {
          modal.classList.add("visible");
          overlay.classList.add("visible");
          bookmarks?.classList.add("hidden");
        }

        // Close modal on clicking the close button or overlay
        closeModalButton.addEventListener("click", () => {
          modal.classList.remove("visible");
          overlay.classList.remove("visible");
        });

        overlay.addEventListener("click", () => {
          modal.classList.remove("visible");
          overlay.classList.remove("visible");
        });
      });
    }
  }
}
