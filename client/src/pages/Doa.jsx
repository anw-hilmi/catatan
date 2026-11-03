import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CardItemPdf from "../components/CardItemPdf";
import AddButton from "../components/AddButton";
import ModalEditorPdf from "../components/ModalEditorPdf";
import ModalLogin from "../components/ModalLogin";
import SearchInput from "../components/SearchInput";
import { useNotes } from "../hooks/useNotes";
import { useNoteActions } from "../hooks/useNoteActions";
import { processPdfSubmit } from "../hooks/actions/pdfActions.js"; // File helper baru

export default function DoaPage({ category = "doa" }) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";

  const { notes, loading, fetchNotes, createNote, updateNote, deleteNote } =
    useNotes(category);

  const {
    isEditorOpen,
    isLoginOpen,
    actionType,
    editingItem,
    actionConfig,
    handleStartAdd,
    handleStartEdit,
    handleStartDelete,
    handleEditorSubmit,
    handleCloseEditor,
    handleCloseLogin,
  } = useNoteActions({ fetchNotes, createNote, updateNote, deleteNote });

  useEffect(() => {
    fetchNotes(searchQuery);
  }, [fetchNotes, searchQuery]);

  // Override fungsi login success khusus untuk flow PDF (FormData)
  const handlePdfLoginSuccess = async (credentials) => {
    let res;
    if (actionType === "ADD") {
      res = await processPdfSubmit(credentials, actionConfig, createNote);
    } else if (actionType === "EDIT") {
      res = await processPdfSubmit(credentials, actionConfig, updateNote);
    } else if (actionType === "DELETE") {
      res = await deleteNote(actionConfig.payload, credentials); // Hapus tetap pakai JSON
    }

    if (res && res.status !== "success") {
      throw new Error(
        res.message || "Gagal memproses data. Username atau password salah.",
      );
    }

    await fetchNotes();
    handleCloseLogin();
    window.location.reload();
  };

  return (
    <div>
      <SearchInput />

      {loading ? (
        <p className="text-center text-card-muted py-8 font-medium">
          Memuat data...
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mt-6">
          {notes.map((item) => (
            <CardItemPdf
              key={item.id}
              title={item.title}
              files={item.files}
              onEdit={() => handleStartEdit(item)}
              onDelete={() => handleStartDelete(item.id)}
            />
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <AddButton onClick={handleStartAdd} />
      </div>

      <ModalEditorPdf
        key={isEditorOpen ? editingItem?.id || "add" : "closed"}
        isOpen={isEditorOpen}
        defaultValue={
          editingItem && actionType === "EDIT"
            ? // Tambahkan existingFiles di sini
              { title: editingItem.title, existingFiles: editingItem.files }
            : { title: "", existingFiles: [] }
        }
        onClose={handleCloseEditor}
        onSubmit={handleEditorSubmit}
      />

      <ModalLogin
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onLoginSuccess={handlePdfLoginSuccess}
        actionType={actionType}
      />
    </div>
  );
}
