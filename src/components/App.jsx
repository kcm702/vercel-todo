import React, { useState, useEffect, useRef } from "react";
import Bucket from "./Bucket";
import ArchivedTodos from "./ArchivedTodos";
import initialData from "../data/initialData";
import styles from "../styles/App.module.css";
import throttle from "lodash.throttle";

const STORAGE_KEY = "my-todo-app-multilist";

export default function App() {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { "My First List": initialData };
  });

  const [currentListName, setCurrentListName] = useState(
    Object.keys(lists)[0] || "My First List"
  );

  const [fontSize, setFontSize] = useState(16);

  const currentBuckets = lists[currentListName];

  const saveAllLists = (updatedLists) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLists));
  };

  const throttledSave = useRef(
    throttle((data) => saveAllLists(data), 3600000)
  ).current;

  useEffect(() => {
    throttledSave(lists);
  }, [lists]);

  useEffect(() => {
    const handleUnload = () => {
      saveAllLists(lists);
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [lists]);

  const updateBuckets = (newBuckets) => {
    const updatedLists = {
      ...lists,
      [currentListName]: newBuckets,
    };
    setLists(updatedLists);
  };

  const handleManualSave = () => {
    saveAllLists(lists);
    alert("Saved manually!");
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(lists, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "todo-lists.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (typeof imported === "object") {
          setLists(imported);
          setCurrentListName(Object.keys(imported)[0]);
          alert("Import successful!");
        } else {
          alert("Invalid file format.");
        }
      } catch {
        alert("Could not parse file.");
      }
    };
    reader.readAsText(file);
  };

  const addNewList = () => {
    const name = prompt("Enter new list name:");
    if (!name || lists[name]) return;
    setLists({
      ...lists,
      [name]: initialData,
    });
    setCurrentListName(name);
  };

  const renameCurrentList = () => {
    const newName = prompt("Rename list:", currentListName);
    if (!newName || newName === currentListName) return;

    const updated = {
      ...lists,
      [newName]: lists[currentListName],
    };
    delete updated[currentListName];

    setLists(updated);
    setCurrentListName(newName);
  };

  return (
    <div className={styles.app} style={{ fontSize: `${fontSize}px` }}>
      <div className={styles.toolbar}>
        <label>Font size: </label>
        <input
          type="range"
          min="12"
          max="24"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
        <button onClick={handleManualSave}>💾 Save</button>
        <button onClick={handleExportJson}>📦 Export JSON</button>
        <label>
          📥 Import JSON
          <input
            type="file"
            accept=".json"
            onChange={handleImportJson}
            style={{ display: "none" }}
          />
        </label>
        <button onClick={addNewList}>+ New List</button>
        <select
          value={currentListName}
          onChange={(e) => setCurrentListName(e.target.value)}
        >
          {Object.keys(lists).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button onClick={renameCurrentList}>✏ Rename List</button>
      </div>

      <div className={styles.bucketList}>
        {currentBuckets.map((bucket) => (
          <Bucket
            key={bucket.id}
            bucket={bucket}
            allBuckets={currentBuckets}
            setBuckets={updateBuckets}
          />
        ))}
      </div>

      <ArchivedTodos buckets={currentBuckets} />
    </div>
  );
}
