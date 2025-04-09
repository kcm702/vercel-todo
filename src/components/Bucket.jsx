import React from "react";
import TodoItem from "./TodoItem";
import styles from "../styles/Bucket.module.css";
import { v4 as uuidv4 } from "uuid";

export default function Bucket({ bucket, allBuckets, setBuckets }) {
  const addTodo = () => {
    const text = prompt("Enter todo:");
    if (text) {
      const newTodo = {
        id: uuidv4(),
        text,
        createdAt: new Date().toISOString(),
      };

      const updatedBuckets = allBuckets.map((b) =>
        b.id === bucket.id ? { ...b, todos: [newTodo, ...b.todos] } : b
      );

      setBuckets(updatedBuckets);
    }
  };

  const handleRename = () => {
    const newName = prompt("Rename bucket:", bucket.name);
    if (newName) {
      const updatedBuckets = allBuckets.map((b) =>
        b.id === bucket.id ? { ...b, name: newName } : b
      );
      setBuckets(updatedBuckets);
    }
  };

  const handleDeleteBucket = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the bucket "${bucket.name}"? All items in it will be removed.`
    );
    if (confirmDelete) {
      const updatedBuckets = allBuckets.filter((b) => b.id !== bucket.id);
      setBuckets(updatedBuckets);
    }
  };

  return (
    <div className={styles.bucket}>
      <div className={styles.header}>
        <h3>{bucket.name}</h3>
        <div className={styles.bucketButtons}>
          <button onClick={handleRename}>Rename</button>
          <button onClick={addTodo}>+ Add</button>
          <button onClick={handleDeleteBucket} style={{ color: "red" }}>
            🗑
          </button>
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
              bucketIndex={index}
              allBuckets={allBuckets}
              setBuckets={setBuckets}
            />
          ))
        )}
      </div>
    </div>
  );
}
