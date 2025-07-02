"use client";
import { useState } from "react";

export default function TesterPage() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");

  const sendRequest = async () => {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: method !== "GET" ? body : undefined,
        credentials: "include",
      });

      let formatted;
      try {
        const json = await res.json();
        formatted = JSON.stringify(json, null, 2);
      } catch {
        formatted = await res.text();
      }

      setResponse(`Status: ${res.status}\n\n${formatted}`);
    } catch (err) {
      setResponse(`Error: ${(err as Error).message}`);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white/10 p-4">
      <div className="flex gap-2 w-full max-w-4xl">
        <select
          className="p-2 border rounded-lg"
          value={method}
          onChange={(e) => setMethod(e.target.value)}>
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>

        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={sendRequest}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Send request
        </button>
      </div>

      {method !== "GET" && (
        <textarea
          className="w-full max-w-4xl mt-4 p-2 border rounded-lg"
          rows={5}
          placeholder="Request body (JSON)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      )}

      <div className="bg-black text-green-400 whitespace-pre-wrap p-4 rounded-lg shadow-lg w-full max-w-4xl h-[50vh] mt-4 overflow-auto">
        {response || "Response will appear here"}
      </div>
    </div>
  );
}
