import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TodoForm({ user, todo, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setCategory(todo.category || "");
      setDueDate(todo.due_date ? todo.due_date.substring(0, 10) : ""); // format yyyy-mm-dd
      setPriority(todo.priority || "medium");
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setDueDate("");
      setPriority("medium");
    }
  }, [todo]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    setLoading(true);

    const todoData = {
      title,
      description,
      category,
      due_date: dueDate || null,
      priority,
      user_id: user.id,
    };

    let error = null;
    if (todo) {
      // update existing todo
      const { error: updateError } = await supabase
        .from("todos")
        .update(todoData)
        .eq("id", todo.id)
        .eq("user_id", user.id);
      error = updateError;
    } else {
      // insert new todo
      const { error: insertError } = await supabase.from("todos").insert(todoData);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      alert("Error saving todo: " + error.message);
    } else {
      onSave();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2 text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter title"
        />
      </div>

      <div>
        <label className="block text-gray-700">Description</label>
        <textarea
          className="w-full rounded border border-gray-300 p-2 text-black"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-gray-700">Category</label>
        <input
          type="text"
          className="w-full rounded border border-gray-300 p-2 text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (optional)"
        />
      </div>

      <div>
        <label className="block text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full rounded border border-gray-300 p-2 text-black"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-gray-700">Priority</label>
        <select
          className="w-full rounded border border-gray-300 p-2 text-black"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
      >
        {loading ? "Saving..." : todo ? "Update Todo" : "Create Todo"}
      </button>
    </form>
  );
}
