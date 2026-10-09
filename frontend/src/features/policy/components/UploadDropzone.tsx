// src/features/policy/components/UploadDropzone.tsx
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { LuFileText, LuUpload, LuX } from "react-icons/lu";

const MAX_SIZE_MB = 50;

interface UploadDropzoneProps {
  file: File | null;
  onChange: (file: File | null) => void;
  onError: (message: string) => void;
}

export default function UploadDropzone({
  file,
  onChange,
  onError,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (selected: File | undefined) => {
    if (!selected) return;

    const isPdf =
      selected.type === "application/pdf" ||
      selected.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      onError("Only PDF files are allowed");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      onError(`File size must be under ${MAX_SIZE_MB}MB`);
      return;
    }

    onError("");
    onChange(selected);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    e.target.value = ""; // lets the user pick the same file again after removing it
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  // A file is selected: show its details instead of the dropzone
  if (file) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border bg-white p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
          <LuFileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-heading">
            {file.name}
          </p>
          <p className="text-xs text-muted">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label="Remove file"
          className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-heading"
        >
          <LuX className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
        isDragging ? "border-primary bg-primary-soft" : "border-border bg-white"
      }`}
    >
      <LuUpload className="h-8 w-8 text-primary" />
      <p className="text-sm text-body">Drag & drop your PDF here</p>
      <p className="text-xs text-muted">or</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-9 rounded-lg bg-primary px-4 text-sm font-medium text-inverse transition-colors hover:bg-primary-hover"
      >
        Choose File
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
