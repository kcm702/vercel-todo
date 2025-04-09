import React, { useState } from "react";

export default function TodoItem({ todo, bucket, allBuckets, setBuckets }) {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);
  const [selectedBucketId, setSelectedBucketId] = useState("");

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

  const handleMoveToBucket = () => {
    if (!selectedBucketId) return;
    const targetBucket = allBuckets.find((b) => b.id === selectedBucketId);
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
    setShowMoveDropdown(false);
    setSelectedBucketId("");
  };

  const availableBuckets = allBuckets.filter((b) => b.id !== bucket.id);

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
        flexWrap: "wrap",
      }}
    >
      <span>{todo.text}</span>
      <div style={{ display: "flex", gap: "6px", marginLeft: "auto" }}>
        <button
          onClick={handleComplete}
          title="Mark Done"
          style={{ minWidth: "48px", fontWeight: "bold" }}
        >
          ✅
        </button>

        <button
          onClick={() => setShowMoveDropdown(!showMoveDropdown)}
          title="Move to another bucket"
        >
          ➡️
        </button>

        <button onClick={() => moveItem("up")} title="Move Up">
          ↑
        </button>
        <button onClick={() => moveItem("down")} title="Move Down">
          ↓
        </button>
        <button onClick={handleEdit} title="Edit">
          ✎
        </button>
        <button onClick={handleDelete} style={{ color: "red" }} title="Delete">
          ✕
        </button>
      </div>

      {showMoveDropdown && (
        <div style={{ marginTop: "6px", width: "100%" }}>
          <select
            value={selectedBucketId}
            onChange={(e) => setSelectedBucketId(e.target.value)}
          >
            <option value="">-- Select Bucket --</option>
            {availableBuckets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          <button onClick={handleMoveToBucket} style={{ marginLeft: "6px" }}>
            Move
          </button>
        </div>
      )}
    </div>
  );
}
