import { ServingsUpdatedEvent } from "js/model/interfaces";

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: string;
  export default content;
}

// For the custom event to extend HTMLElementEventMap interface
// to include the custom event type so that typescipt will recognise
// the custom event as a valid type when using addEventListener.

declare global {
  interface HTMLElementEventMap {
    servingsUpdated: ServingsUpdatedEvent;
  }
}
