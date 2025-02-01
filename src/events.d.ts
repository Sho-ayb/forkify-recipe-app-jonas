// For the custon event on the bookmark toggle button

// Interface for the toggle icon button event

export interface BookmarkToggleEvent extends CustomEvent {
  detail: {
    button: HTMLElement;
  };
}

// A global declaration so typescript is aware of this custom event

declare global {
  interface HTMLElementEventMap {
    bookmarkToggle: BookmarkToggleEvent;
  }
}
