import type { Card } from "../types";

// These are the props this component expects from its parent.
interface FlashcardProps {
  card: Card | null;
  flipped: boolean;
  onFlip: () => void;
  onMarkKnown: () => void;
  onMarkReview: () => void;
  onPrev: () => void;
  onNext: () => void;
  index: number;
  total: number;
}

export default function Flashcard({
  card,
  flipped,
  onFlip,
  onMarkKnown,
  onMarkReview,
  onPrev,
  onNext,
  index,
  total,
}: FlashcardProps) {
  if (!card) {
    return (
      <section className="study" aria-label="Flashcard">
        <div className="empty-state">
          <div className="empty-mark" aria-hidden="true">+</div>
          <h2>No cards here yet</h2>
          <p>Add a card to start revising this subject.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="study" aria-label="Flashcard">
      <div className="study-top">
        <span className="eyebrow">Now revising</span>
        <span className="counter" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>

      <button
        type="button"
        className={`flashcard${flipped ? " is-flipped" : ""}`}
        onClick={onFlip}
        aria-pressed={flipped}
      >
        <span className="flashcard-tag">{card.subject}</span>
        <span className="flashcard-label">{flipped ? "Answer" : "Question"}</span>
        <span className="flashcard-text">{flipped ? card.answer : card.question}</span>
        <span className="flashcard-hint">
          {flipped ? "Click to see the question" : "Click to reveal the answer"}
        </span>
      </button>

      <div className="study-nav">
        <button type="button" className="btn btn-quiet" onClick={onPrev} disabled={total < 2}>
          ← Previous
        </button>
        <button type="button" className="btn btn-quiet" onClick={onNext} disabled={total < 2}>
          Next →
        </button>
      </div>

      <div className="mark-row">
        <button type="button" className="btn btn-review" onClick={onMarkReview}>
          Review again
        </button>
        <button type="button" className="btn btn-known" onClick={onMarkKnown}>
          ✓ Got it
        </button>
      </div>

      <p className="key-hint">
        <kbd>Space</kbd> flip <span aria-hidden="true">·</span> <kbd>←</kbd> <kbd>→</kbd> move
      </p>
    </section>
  );
}
