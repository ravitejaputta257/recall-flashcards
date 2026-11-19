import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Card, CardDraft } from "../types";
import { SUBJECTS } from "../data/seed";

interface CardFormProps {
  card: Card | null;
  onSave: (values: CardDraft) => void;
  onCancel: () => void;
}

export default function CardForm({ card, onSave, onCancel }: CardFormProps) {
  const [subject, setSubject] = useState<string>(card?.subject ?? SUBJECTS[0]);
  const [question, setQuestion] = useState<string>(card?.question ?? "");
  const [answer, setAnswer] = useState<string>(card?.answer ?? "");
  const firstField = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    firstField.current?.focus();
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean: CardDraft = {
      subject,
      question: question.trim(),
      answer: answer.trim(),
    };
    if (!clean.question || !clean.answer) return;
    onSave(clean);
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="modal-head">
          <div>
            <span className="eyebrow">{card ? "Editing" : "New card"}</span>
            <h2 id="form-title">{card ? "Update this card" : "Add a revision card"}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onCancel} aria-label="Close dialog">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Subject</span>
            <select ref={firstField} value={subject} onChange={(e) => setSubject(e.target.value)}>
              {SUBJECTS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Question</span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="e.g. What does ACID stand for?"
              required
            />
          </label>

          <label className="field">
            <span>Answer</span>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              placeholder="Write the answer you want to recall."
              required
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-quiet" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">{card ? "Save changes" : "Add card"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
