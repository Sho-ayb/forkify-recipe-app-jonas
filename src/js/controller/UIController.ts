import logoImg from "../../assets/img/logo.png";

// UIController controls the main UI related operations including responsive layout
export class UIController {
  private aside: HTMLElement | null;

  private asideHeader: HTMLElement | null;

  private searchButton: HTMLElement | null;

  private searchResultsButton: HTMLElement | null;

  private headerContainer: HTMLElement | null;

  private headerLogo: HTMLImageElement | null;

  constructor() {
    this.aside = document.querySelector(
      ".recipe__search-list-container"
    )! as HTMLElement;
    this.asideHeader = document.querySelector(
      ".recipe__search-list-header"
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
}

/*
if (window.innerWidth >= 768) {
  aside?.classList.remove("hidden");
  aside?.classList.remove("active");
  asideHeader?.classList.add("hidden");
  openSearchBtn?.classList.add("hidden");
} else {
  aside?.classList.add("hidden");
  asideHeader?.classList.remove("hidden");
  openSearchBtn?.classList.remove("hidden");
}

*/
