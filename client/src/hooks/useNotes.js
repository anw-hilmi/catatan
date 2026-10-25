import { useState, useCallback, useEffect } from "react";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const useNotes = (category) => {
  // Read initial data from localStorage if available
  const [notes, setNotes] = useState(() => {
    const cached = localStorage.getItem(`catatan_${category}`);
    return cached ? JSON.parse(cached) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync state to localStorage whenever notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`catatan_${category}`, JSON.stringify(notes));
    }
  }, [notes, category]);

  const fetchNotes = useCallback(
    async (search = "") => {
      setLoading(false);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/${category}?search=${search}`);
        const result = await res.json();
        if (result.status === "success") {
          setNotes(result.data);
          if (!search) {
            localStorage.setItem(
              `catatan_${category}`,
              JSON.stringify(result.data),
            );
          }
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  const createNote = async (payload) => {
    const res = await fetch(`${API_BASE_URL}/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const updateNote = async (id, payload) => {
    const res = await fetch(`${API_BASE_URL}/${category}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const deleteNote = async (id, credentials) => {
    const res = await fetch(`${API_BASE_URL}/${category}/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const result = await res.json();
    if (result.status === "success") await fetchNotes();
    return result;
  };

  const downloadAllNotes = async () => {
    if (notes.length === 0) return alert("Tidak ada catatan untuk diunduh");

    const contentHTML = notes
      .map((n) => {
        const date = n.created_at
          ? new Date(n.created_at).toLocaleDateString("id-ID")
          : "-";
        return `
        <div style="margin-bottom: 30px;">
          <h2 style="margin: 0 0 5px 0; color: #44403c; font-size: 16pt;">${n.title || "Tanpa Judul"}</h2>
          <p style="margin: 0 0 15px 0; font-size: 10pt; color: #78716c;"><strong>Tanggal:</strong> ${date}</p>
          <div style="color: #57534e; line-height: 1.6;">${n.body || n.content || ""}</div>
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #e7e5e4;"/>
        </div>
      `;
      })
      .join("");

    const htmlString = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Calibri, Arial, sans-serif; color: #57534e; font-size: 11pt; line-height: 1.5; margin: 0; padding: 16px; }
      h1 { font-size: 18pt; font-weight: bold; margin-bottom: 10px; }
      h2 { font-size: 14pt; font-weight: bold; margin-bottom: 10px; }
      p { margin: 0 0 8px 0; }
      ul, ol { margin: 0 0 10px 0; padding-left: 24px; }
      ul { list-style-type: disc; }
      ol { list-style-type: decimal; }
      li { margin-bottom: 4px; }
      
      /* Menggunakan margin-left agar indentasi Quill terbaca di MS Word */
      .ql-indent-1 { margin-left: 30px !important; }
      .ql-indent-2 { margin-left: 60px !important; }
      .ql-indent-3 { margin-left: 90px !important; }
      .ql-indent-4 { margin-left: 120px !important; }
      
      .ql-align-center { text-align: center; }
      .ql-align-right { text-align: right; }
      .ql-align-justify { text-align: justify; }
      
      s, strike { text-decoration: line-through; }
      u { text-decoration: underline; }
      blockquote { margin: 10px 0; padding-left: 10px; border-left: 3px solid #ccc; color: #666; }
    </style>
  </head>
  <body>${contentHTML}</body>
</html>`;

    const converted = await asBlob(htmlString);
    saveAs(converted, `Catatan_${category}.docx`);
  };

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    downloadAllNotes,
  };
};
