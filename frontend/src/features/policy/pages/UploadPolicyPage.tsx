// src/features/policy/pages/UploadPolicyPage.tsx
import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PageHeader from "@/layouts/PageHeader";
import UploadDropzone from "../components/UploadDropzone";
import { DEPARTMENTS } from "../policy.contants";
import { uploadPolicy } from "../policy.api";

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft";

export default function UploadPolicyPage() {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    department: "",
    version: "1.0.0",
    effective_from: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // One handler for all text, select, and textarea fields (uses the input's name attribute)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validate
    if (!file) return setError("Please choose a PDF file");
    if (!form.name.trim()) return setError("Policy name is required");
    if (!form.department) return setError("Please select a department");
    if (!form.version.trim()) return setError("Version is required");
    if (!form.effective_from) return setError("Effective date is required");

    setError("");
    setIsSubmitting(true);

    try {
      // 2. Send the file and the fields together (FormData is built inside uploadPolicy)
      await uploadPolicy({
        file,
        name: form.name.trim(),
        department: form.department,
        version: form.version.trim(),
        effective_from: form.effective_from,
        description: form.description.trim() || undefined, // skip if empty
      });

      // 3. Go to the queue so the user can watch processing
      navigate("/admin/queue");
    } catch (err) {
      // 4. Show the backend message if there is one
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.detail ?? "Upload failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Upload New Policy"
        subtitle="Upload PDF files (Max size: 50MB)"
      />

      <form onSubmit={handleSubmit} className="flex  flex-col gap-6">
        {error && (
          <div className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <UploadDropzone file={file} onChange={setFile} onError={setError} />

        {/* Metadata */}
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="mb-4 text-base font-medium">Policy Metadata</h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Policy Name
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter policy name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="version" className="text-sm font-medium">
                Version
              </label>
              <input
                id="version"
                name="version"
                value={form.version}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="effective_from" className="text-sm font-medium">
                Effective Date
              </label>
              <input
                id="effective_from"
                name="effective_from"
                type="date"
                value={form.effective_from}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description{" "}
                <span className="font-normal text-muted">(Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Enter description"
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-soft"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/policies")}
            className="h-10 rounded-lg border border-border bg-white px-4 text-sm font-medium transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-inverse transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Uploading..." : "Upload Policy"}
          </button>
        </div>
      </form>
    </div>
  );
}
