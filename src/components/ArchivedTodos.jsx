import React from "react";
import { parseISO, formatDistanceToNow } from "date-fns";

export default function ArchivedTodos({ buckets }) {
  const doneBucket = buckets.find((b) => b.name.toLowerCase() === "done");
  if (!doneBucket) return null;

  const archived = doneBucket.todos.filter((todo) => {
    const createdAt = parseISO(todo.createdAt);
    const ageInMs = new Date() - createdAt;
    return ageInMs > 14 * 24 * 60 * 60 * 1000;
  });

  return (
    <div
      style={{
        marginTop: "2rem",
        borderTop: "1px solid #ccc",
        paddingTop: "1rem",
      }}
    >
      <h4>Archived (Older than 2 weeks)</h4>
      {archived.length === 0 ? (
        <div style={{ fontStyle: "italic", opacity: 0.5 }}>
          No archived items yet.
        </div>
      ) : (
        archived.map((todo) => (
          <div key={todo.id} style={{ opacity: 0.5, marginBottom: "4px" }}>
            {todo.text} – {formatDistanceToNow(parseISO(todo.createdAt))} ago
          </div>
        ))
      )}
    </div>
  );
}
