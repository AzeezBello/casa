// components/SavedSearches.tsx
import React, { useEffect, useState } from "react";
import { SavedSearch, NewSavedSearch } from "@/lib/types";

export default function SavedSearches({ userId }: { userId: string }) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await fetch(`/api/saved-searches?userId=${userId}`);
    if (res.ok) setSearches(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: NewSavedSearch = {
      name: newName,
      filters: {}, // empty for demo – you would pass the current filters here
    };
    const res = await fetch(`/api/saved-searches?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setNewName("");
      setShowForm(false);
      load();
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/saved-searches/${id}?userId=${userId}`, { method: "DELETE" });
    load();
  };

  return (
    <section className="saved-searches">
      <h2 className="eyebrow">Saved searches</h2>
      {searches.length === 0 && <p>No saved searches yet.</p>}
      <ul>
        {searches.map((s) => (
          <li key={s.id} className="saved-search-item">
            <span>{s.name}</span>
            <button className="ghost-btn" onClick={() => remove(s.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {showForm ? (
        <form onSubmit={create} className="saved-search-form">
          <input
            type="text"
            placeholder="Search name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <button type="submit" className="dark-btn">
            Save
          </button>
          <button type="button" className="ghost-btn" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button className="dark-btn" onClick={() => setShowForm(true)}>
          + New saved search
        </button>
      )}
    </section>
  );
}
