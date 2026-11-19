import { useEffect, useMemo, useState } from "react";
import Flashcard from "./components/Flashcard";
import Sidebar from "./components/Sidebar";
import CardForm from "./components/CardForm";
import CardList from "./components/CardList";
import { seedCards, SUBJECTS } from "./data/seed";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Card, CardDraft, Theme } from "./types";

const CARDS_KEY = "recall.cards.v1";
const THEME_KEY = "recall.theme.v1";

export default function App() {
  // The angle brackets tell the hook what kind of value is stored.
  const [cards, setCards] = useLocalStorage<Card[]>(CARDS_KEY, seedCards);
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_KEY, "dark");
  // TS infers string / number / boolean from these starting values.
  const [activeSubject, setActiveSubject] = useState<string>("All");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  // Starts as null, so we must say what it can become later.
  const [editing, setEditing] = useState<Card | null>(null);

  const subjects = useMemo(
    () => [
      { name: "All", count: cards.length },
      ...SUBJECTS.map((name) => ({
        name,
        count: cards.filter((card) => card.subject === name).length,
      })),
    ],
    [cards]
  );

  const visibleCards = useMemo(
    () =>
      activeSubject === "All"
        ? cards
        : cards.filter((card) => card.subject === activeSubject),
    [cards, activeSubject]
  );

  const currentCard = visibleCards[currentIndex] ?? null;
  const knownCount = cards.filter((card) => card.known).length;
  const reviewCount = cards.length - knownCount;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // If a filter or deletion shortens the list, keep the index in range.
  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(visibleCards.length - 1, 0)));
  }, [visibleCards.length]);

  function flip() {
    setFlipped((value) => !value);
  }

  function go(delta: number) {
    if (visibleCards.length === 0) return;
    setFlipped(false);
    setCurrentIndex((index) => (index + delta + visibleCards.length) % visibleCards.length);
  }

  function selectSubject(name: string) {
    setActiveSubject(name);
    setCurrentIndex(0);
    setFlipped(false);
  }

  function selectCard(id: string) {
    const index = visibleCards.findIndex((card) => card.id === id);
    if (index === -1) return;
    setCurrentIndex(index);
    setFlipped(false);
  }

  function mark(known: boolean) {
    if (!currentCard) return;
    setCards((previous) =>
      previous.map((card) =>
        card.id === currentCard.id ? { ...card, known } : card
      )
    );
    setFlipped(false);
  }

  function openAdd() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(card: Card) {
    setEditing(card);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditing(null);
  }

  function saveCard(values: CardDraft) {
    if (editing) {
      setCards((previous) =>
        previous.map((card) =>
          card.id === editing.id ? { ...card, ...values } : card
        )
      );
    } else {
      setCards((previous) => [
        ...previous,
        { id: `card-${Date.now()}`, ...values, known: false },
      ]);
    }
    closeDialog();
  }

  function deleteCard(id: string) {
    setCards((previous) => previous.filter((card) => card.id !== id));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (dialogOpen) {
        if (event.key === "Escape") closeDialog();
        return;
      }
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (!tag || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tag)) return;

      if (event.code === "Space") {
        event.preventDefault();
        flip();
      } else if (event.key === "ArrowRight") {
        go(1);
      } else if (event.key === "ArrowLeft") {
        go(-1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialogOpen, visibleCards.length]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true">R</span>
            <span>
              <strong>Recall</strong>
              <small>flashcard revision</small>
            </span>
          </a>
          <div className="header-right">
            <span className="header-badge">Frontend demo</span>
            <button
              type="button"
              className="theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? "☀" : "☾"}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="wrap">
        <section className="hero">
          <div>
            <span className="eyebrow">Interview prep, kept simple</span>
            <h1>Small cards.<br /><em>Better recall.</em></h1>
            <p>
              Flip through core CS questions, mark what you know, and keep the rest
              for another round. No account, no backend — everything stays in this browser.
            </p>
          </div>
          <dl className="hero-stats" aria-label="Card statistics">
            <div>
              <dt>Total cards</dt>
              <dd>{cards.length}</dd>
            </div>
            <div>
              <dt>Known</dt>
              <dd>{knownCount}</dd>
            </div>
            <div>
              <dt>To review</dt>
              <dd>{reviewCount}</dd>
            </div>
          </dl>
        </section>

        <div className="workspace">
          <Sidebar
            subjects={subjects}
            activeSubject={activeSubject}
            onSelect={selectSubject}
            known={knownCount}
            total={cards.length}
            onAdd={openAdd}
          />
          <Flashcard
            card={currentCard}
            flipped={flipped}
            onFlip={flip}
            onMarkKnown={() => mark(true)}
            onMarkReview={() => mark(false)}
            onPrev={() => go(-1)}
            onNext={() => go(1)}
            index={currentIndex}
            total={visibleCards.length}
          />
        </div>

        <CardList
          cards={visibleCards}
          onEdit={openEdit}
          onDelete={deleteCard}
          onSelect={selectCard}
        />
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <p>Built with React and TypeScript. Your cards live in localStorage on this device.</p>
        </div>
      </footer>

      {dialogOpen && (
        <CardForm card={editing} onSave={saveCard} onCancel={closeDialog} />
      )}
    </div>
  );
}
