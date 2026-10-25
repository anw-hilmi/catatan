import { useEffect, useRef } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }],
    [{ indent: "-1" }, { indent: "+1" }],
  ],
};

const FORMATS = ["bold", "italic", "underline", "strike", "list", "indent"];

export const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Tulis isi di sini...",
}) => {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: MODULES,
    formats: FORMATS,
    placeholder,
  });

  useEffect(() => {
    if (!quill) return;

    const handler = () => {
      const html = quill.root.innerHTML;
      const cleanValue = html === "<p><br></p>" ? "" : html;
      onChangeRef.current?.(cleanValue);
    };

    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill]);

  useEffect(() => {
    if (!quill) return;

    const currentHTML = quill.root.innerHTML;
    const isEquivalent =
      value === currentHTML || (value === "" && currentHTML === "<p><br></p>");

    if (!isEquivalent && !quill.hasFocus()) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value, quill]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-card-border bg-card-header text-sm text-card-muted transition-all focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary sm:text-base [&_.ql-container]:border-none [&_.ql-editor]:max-h-[280px] [&_.ql-editor]:min-h-[140px] [&_.ql-editor]:overflow-y-auto [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-card-border">
      <div ref={quillRef} />
    </div>
  );
};
