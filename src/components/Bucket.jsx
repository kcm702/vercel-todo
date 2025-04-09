import React from "react";
import TodoItem from "./TodoItem";
import styles from "../styles/Bucket.module.css";
import { v4 as uuidv4 } from "uuid";

export default function Bucket({ bucket, allBuckets, setBuckets }) {
  const addTodo = () => {
    const text = prompt("Enter todo:");
    if (text) {
      const newTodo = { id: uuidv4(), text, createdAt: new Date().toISOString() };
      const updated = allBuckets.map((b) =>
        b.id === bucket.id ? { ...b, todos: [newTodo, ...b.todos] } : b
      );
      setBuckets(updated);
    }
  };

  const handleRename = () => {
    const name = prompt("New bucket name:", bucket.name);
    if (name) {
      const updated = allBuckets.map((b) =>
        b.id === bucket.id ? { ...b, name } : b
      );
      setBuckets(updated);
    }
  };

  const handleDeleteBucket = () => {
    const confirmDelete = window.confirm(`Delete bucket "${bucket.name}"?`);
    if (confirmDelete) {
      const updated = allBuckets.filter((b) => b.id !== bucket.id);
      setBuckets(updated);
    }
  };

  return (
    <div className={styles.bucket}>
      <div className={styles.header}>
        <h3>{bucket.name}</h3>
        <div>
          <button onClick={handleRename}>Rename</button>
          <button onClick={addTodo}>+ Add</button>
          <button onClick={handleDeleteBucket} style={{ color: "red" }}>🗑</button>
        </div>
      </div>
      <div className={styles.todoList}>
        {bucket.todos.length === 0 ? (
          <div className={styles.emptyLine}>&nbsp;</div>
        ) : (
          bucket.todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              bucket={bucket}
              allBuckets={allBuckets}
              setBuckets={setBuckets}
            />
          ))
        )}
      </div>
    </div>
  );
}
