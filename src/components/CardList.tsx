import type { Card } from "../types";

interface CardListProps {
  cards: Card[];
  onEdit: (card: Card) => void;
  onDelete: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function CardList({ cards, onEdit, onDelete, onSelect }: CardListProps) {
  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="library" aria-labelledby="library-title">
      <div className="library-head">
        <div>
          <span className="eyebrow">Your cards</span>
          <h2 id="library-title">Card library</h2>
        </div>
        <span className="library-count">{cards.length} shown</span>
      </div>

      <ul className="card-list">
        {cards.map((card) => (
          <li key={card.id} className="library-item">
            <button type="button" className="library-main" onClick={() => onSelect(card.id)}>
              <span className="library-subject">{card.subject}</span>
              <span className="library-question">{card.question}</span>
            </button>
            <span className={`badge ${card.known ? "badge-known" : "badge-review"}`}>
              {card.known ? "Known" : "Review"}
            </span>
            <button type="button" className="icon-btn" onClick={() => onEdit(card)} aria-label={`Edit: ${card.question}`}>
              ✎
            </button>
            <button type="button" className="icon-btn" onClick={() => onDelete(card.id)} aria-label={`Delete: ${card.question}`}>
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
