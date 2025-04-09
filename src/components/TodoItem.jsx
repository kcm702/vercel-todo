import React from "react";

export default function TodoItem({ todo, bucket, allBuckets, setBuckets }) {
  const moveItem = (direction) => {
    const index = bucket.todos.findIndex((t) => t.id === todo.id);
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === bucket.todos.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedTodos = [...bucket.todos];
    const [movedItem] = updatedTodos.splice(index, 1);
    updatedTodos.splice(newIndex, 0, movedItem);

    const updatedBuckets = allBuckets.map((b) =>
      b.id === bucket.id ? { ...b, todos: updatedTodos } : b
    );
    setBuckets(updatedBuckets);
  };

  const handleDelete = () => {
    const updated = allBuckets.map((b) =>
      b.id === bucket.id
        ? { ...b, todos: b.todos.filter((t) => t.id !== todo.id) }
        : b
    );
    setBuckets(updated);
  };

  const handleEdit = () => {
    const newText = prompt("Edit item:", todo.text);
    if (newText) {
      const updatedBuckets = allBuckets.map((b) =>
        b.id === bucket.id
          ? {
              ...b,
              todos: b.todos.map((t) =>
                t.id === todo.id ? { ...t, text: newText } : t
              ),
            }
          : b
      );
      setBuckets(updatedBuckets);
    }
  };

  const handleComplete = () => {
    const doneBucket = allBuckets.find((b) => b.name.toLowerCase() === "done");
    if (!doneBucket) return;

    const updatedBuckets = allBuckets.map((b) => {
      if (b.id === bucket.id) {
        return { ...b, todos: b.todos.filter((t) => t.id !== todo.id) };
      }
      if (b.id === doneBucket.id) {
        return {
          ...b,
          todos: [{ ...todo, createdAt: new Date().toISOString() }, ...b.todos],
        };
      }
      return b;
    });

    setBuckets(updatedBuckets);
  };

  const handleMoveTo = () => {
    const target = prompt(
      `Move to which bucket?\n${allBuckets
        .filter((b) => b.id !== bucket.id)
        .map((b) => b.name)
        .join("\n")}`
    );
    const targetBucket = allBuckets.find(
      (b) => b.name.toLowerCase() === target?.toLowerCase()
    );
    if (!targetBucket) return;

    const updatedBuckets = allBuckets.map((b) => {
      if (b.id === bucket.id) {
        return { ...b, todos: b.todos.filter((t) => t.id !== todo.id) };
      }
      if (b.id === targetBucket.id) {
        return {
          ...b,
          todos: [{ ...todo, createdAt: new Date().toISOString() }, ...b.todos],
        };
      }
      return b;
    });

    setBuckets(updatedBuckets);
  };

  return (
    <div
      style={{
        background: "#fff",
        margin: "4px",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{todo.text}</span>
      <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
        {/* ✅ Done (2x width) */}
        <button
          onClick={handleComplete}
          title="Mark Done"
          style={{
            minWidth: "48px",
            fontWeight: "bold",
          }}
        >
          ✅
        </button>

        {/* ➡️ Move to another bucket */}
        <button onClick={handleMoveTo} title="Move to another bucket">
          ➡️
        </button>

        {/* ↑ Move Up */}
        <button onClick={() => moveItem("up")} title="Move Up">
          ↑
        </button>

        {/* ↓ Move Down */}
        <button onClick={() => moveItem("down")} title="Move Down">
          ↓
        </button>

        {/* ✎ Edit */}
        <button onClick={handleEdit} title="Edit">
          ✎
        </button>

        {/* ✕ Delete */}
        <button onClick={handleDelete} style={{ color: "red" }} title="Delete">
          ✕
        </button>
      </div>
    </div>
  );
}
