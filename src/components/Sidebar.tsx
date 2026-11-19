interface SubjectCount {
  name: string;
  count: number;
}

interface SidebarProps {
  subjects: SubjectCount[];
  activeSubject: string;
  onSelect: (name: string) => void;
  known: number;
  total: number;
  onAdd: () => void;
}

export default function Sidebar({
  subjects,
  activeSubject,
  onSelect,
  known,
  total,
  onAdd,
}: SidebarProps) {
  const percent = total === 0 ? 0 : Math.round((known / total) * 100);

  return (
    <aside className="sidebar" aria-label="Revision overview">
      <div className="side-block">
        <h2 className="side-title">Subjects</h2>
        <ul className="subject-list">
          {subjects.map((subject) => (
            <li key={subject.name}>
              <button
                type="button"
                className={`subject-btn${activeSubject === subject.name ? " is-active" : ""}`}
                onClick={() => onSelect(subject.name)}
                aria-pressed={activeSubject === subject.name}
              >
                <span>{subject.name}</span>
                <span className="subject-count">{subject.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="side-block progress-block">
        <h2 className="side-title">Your progress</h2>
        <div className="progress-num">
          <strong>{percent}%</strong>
          <span>marked as known</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Cards marked as known"
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>
        <p className="progress-meta">
          {known} known <span aria-hidden="true">·</span> {total - known} to review
        </p>
      </div>

      <button type="button" className="btn btn-primary side-add" onClick={onAdd}>
        + Add a card
      </button>
    </aside>
  );
}
