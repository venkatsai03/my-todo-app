import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import { FiSearch, FiPlus } from "react-icons/fi";
import TodoForm from "./TodoForm";

export default function TodoList({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("due_date");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  async function fetchTodos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("inserted_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  }

  async function toggleComplete(id, current) {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !current })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return alert(error.message);
    fetchTodos();
  }

  async function deleteTodo(id) {
    if (!window.confirm("Delete this todo?")) return;
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return alert(error.message);
    fetchTodos();
  }

  const categories = useMemo(() => {
    const set = new Set(todos.map((t) => t.category).filter(Boolean));
    return Array.from(set);
  }, [todos]);

  const filtered = todos
    .filter((t) => {
      if (filterCategory !== "all" && t.category !== filterCategory) return false;
      if (filterStatus === "completed" && !t.completed) return false;
      if (filterStatus === "pending" && t.completed) return false;
      if (query) {
        const low = query.toLowerCase();
        return (
          (t.title || "").toLowerCase().includes(low) ||
          (t.description || "").toLowerCase().includes(low)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "due_date") {
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        Loading todos...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white min-h-[400px]">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-white opacity-70" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search todos..."
              className="pl-10 pr-4 py-2 rounded-lg bg-white bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded-lg bg-white bg-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="due_date">Sort by due date</option>
            <option value="priority">Sort by priority</option>
          </select>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-40 transition rounded-lg px-4 py-2 text-white text-sm font-semibold shadow-md"
          title="Add Todo"
        >
          <FiPlus /> Add Todo
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-white opacity-70 mt-20">No todos found.</p>
      ) : (
        <ul className="space-y-4 max-h-[400px] overflow-y-auto">
          {filtered.map((todo) => (
            <li
              key={todo.id}
              className={`p-4 rounded-lg shadow-md bg-white bg-opacity-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div>
                <h3 className={`text-lg font-semibold ${todo.completed ? "line-through opacity-60" : ""} text-black`}>
                  {todo.title}
                </h3>
                <p className="text-sm text-gray-900 opacity-90">{todo.description}</p>
                <p className="text-xs text-gray-700 opacity-70 mt-1">
                  Due:{" "}
                  {todo.due_date
                    ? dayjs(todo.due_date).format("MMM D, YYYY")
                    : "No due date"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleComplete(todo.id, todo.completed)}
                  className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                    todo.completed
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {todo.completed ? "Completed" : "Pending"}
                </button>

                <button
                  onClick={() => {
                    setEditing(todo);
                    setShowForm(true);
                  }}
                  className="px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Todo Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close form"
            >
              &times;
            </button>
            <TodoForm
              user={user}
              todo={editing}
              onSave={() => {
                setShowForm(false);
                fetchTodos();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
