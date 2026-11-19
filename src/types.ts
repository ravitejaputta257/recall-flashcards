// A card is the shape of one flashcard in state and in localStorage.
export interface Card {
  id: string;
  subject: string;
  question: string;
  answer: string;
  known: boolean;
}

// The only two values the theme can ever have.
export type Theme = "dark" | "light";

// What the add/edit form sends back to App — no id yet, App creates that.
export interface CardDraft {
  subject: string;
  question: string;
  answer: string;
}
