"use client";

import { useState } from "react";

export default function StoreForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("http://localhost:4004/init/createStore", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setMessage("✅ Store created successfully!");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow-sm space-y-4 bg-white">
      <h2 className="text-xl font-bold">Create Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="desc"
          placeholder="Description"
          className="w-full px-4 py-2 border rounded"
        />
        <div>
          <label className="block mb-1 font-medium">Logo Image</label>
          <input type="file" name="logo_file" accept="image/*" required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Cover Image</label>
          <input type="file" name="cover_file" accept="image/*" required />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>
      {message && <p className="text-sm mt-4">{message}</p>}
    </div>
  );
}
