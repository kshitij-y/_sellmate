"use client";

import React, { useState } from "react";
import { useUserProfile } from "@/lib/hooks/useProfile";

export default function Page() {
  const { user, loading, error, refetchProfile, updateProfile } =
    useUserProfile();

  const [name, setName] = useState(user?.name || "");

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Name cannot be empty");
    await updateProfile({ name });
    await refetchProfile();
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">🧩 Test: useUserProfile Hook</h1>

      {/* Loading/Error */}
      {loading && <p className="text-gray-500">Loading profile...</p>}
      {error && <p className="text-red-600">❌ {error}</p>}

      {/* Profile Data */}
      {user && (
        <div className="space-y-2">
          <p>
            <span className="font-medium">ID:</span> {user.id}
          </p>
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>
      )}

      {/* Update Form */}
      <div className="pt-4 space-y-2">
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Update your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>

      <button
        onClick={() => refetchProfile()}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800">
        🔄 Refetch Profile
      </button>
    </div>
  );
}
