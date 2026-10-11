const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function CalendarPanel({ now }) {
  const start = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return <div className="calendar-panel" role="dialog" aria-label="Date and time">
    <p className="calendar-panel__date">{new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(now)}</p>
    <h2>{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(now)}</h2>
    <div className="calendar-panel__grid">
      {WEEKDAYS.map((day, index) => <span className="calendar-panel__weekday" key={`day-${index}`}>{day}</span>)}
      {Array.from({ length: start }, (_, index) => <span key={`empty-${index}`} />)}
      {Array.from({ length: days }, (_, index) => <span key={index} className={index + 1 === now.getDate() ? 'is-today' : ''}>{index + 1}</span>)}
    </div>
  </div>;
}
