"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Trash2, CheckCircle, AlertCircle, Eye, EyeOff, Pencil, X } from "lucide-react";
import { DbEvent } from "@/lib/supabase";

// ── Utility ───────────────────────────────────────────────────────────────────
function slugify(text: string) {
  const base = text.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const suffix = Math.random().toString(36).slice(2, 6); // 4-char random suffix
  return `${base}-${suffix}`;
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-maroon font-display">
        {label}
        {sublabel && <span className="ml-2 text-xs font-normal text-ink-light font-body">({sublabel})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl border border-cream-dark bg-cream px-4 py-2.5 text-ink font-body text-base focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold transition-all duration-200";
const textareaCls = `${inputCls} resize-y min-h-[120px]`;

// ── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [secretInput, setSecretInput] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    name: "",
    name_tamil: "",
    slug: "",
    description: "",
    description_tamil: "",
    date: "",
    date_tamil: "",
    details: "",
    details_tamil: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  async function handleAuth() {
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "x-admin-secret": secretInput },
      });
      if (res.ok) {
        setAuthenticated(true);
        loadEvents();
      } else {
        setAuthError("தவறான கடவுச்சொல். Invalid secret.");
      }
    } catch {
      setAuthError("Network error. Please try again.");
    }
  }

  // ── Load existing events ──────────────────────────────────────────────────
  async function loadEvents() {
    setLoadingEvents(true);
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      setEvents(json.events ?? []);
    } catch { /* ignore */ }
    setLoadingEvents(false);
  }

  // ── Field change ──────────────────────────────────────────────────────────
  function set(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name") next.slug = slugify(value);
      return next;
    });
  }

  // ── Image pick ────────────────────────────────────────────────────────────
  function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((p) => ({ ...p, image_url: "" }));
  }

  // ── Upload image ──────────────────────────────────────────────────────────
  async function uploadImage(): Promise<string> {
    if (!imageFile) return form.image_url;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", imageFile);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "x-admin-secret": secretInput },
      body: fd,
    });
    setUploading(false);
    if (!res.ok) throw new Error("Image upload failed");
    const json = await res.json();
    return json.url as string;
  }

  // ── Edit: populate form with existing event ───────────────────────────────
  function handleEdit(ev: DbEvent) {
    setEditingId(ev.id);
    setForm({
      name: ev.name,
      name_tamil: ev.name_tamil,
      slug: ev.slug,
      description: ev.description ?? "",
      description_tamil: ev.description_tamil ?? "",
      date: ev.date ?? "",
      date_tamil: ev.date_tamil ?? "",
      details: ev.details ?? "",
      details_tamil: ev.details_tamil ?? "",
      image_url: ev.image_url ?? "",
    });
    setImageFile(null);
    setImagePreview("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ name: "", name_tamil: "", slug: "", description: "", description_tamil: "", date: "", date_tamil: "", details: "", details_tamil: "", image_url: "" });
    setImageFile(null);
    setImagePreview("");
  }

  // ── Submit (Add or Update) ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.name_tamil) {
      showToast("error", "Name (English & Tamil) are required.");
      return;
    }
    try {
      setSubmitting(true);
      const imageUrl = await uploadImage();
      const payload = { ...form, image_url: imageUrl };

      const isEditing = !!editingId;
      const url = isEditing ? `/api/events?id=${editingId}` : "/api/events";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "x-admin-secret": secretInput },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error ?? "Failed");
      }
      showToast("success", isEditing
        ? "நிகழ்வு புதுப்பிக்கப்பட்டது! Event updated successfully."
        : "நிகழ்வு சேர்க்கப்பட்டது! Event added successfully."
      );
      setEditingId(null);
      setForm({ name: "", name_tamil: "", slug: "", description: "", description_tamil: "", date: "", date_tamil: "", details: "", details_tamil: "", image_url: "" });
      setImageFile(null);
      setImagePreview("");
      loadEvents();
    } catch (err: unknown) {
      showToast("error", err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    const res = await fetch(`/api/events?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secretInput },
    });
    if (res.ok) { showToast("success", "Event deleted."); loadEvents(); }
    else showToast("error", "Delete failed.");
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4"
        style={{ background: "radial-gradient(ellipse at top, #8B2A3E 0%, #4A0F1C 100%)" }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="bg-cream rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-maroon mb-2">மாதவம் நிர்வாகம்</h1>
          <p className="text-ink-light font-body text-sm mb-6">Admin Panel · Enter the admin secret to continue</p>
          <div className="relative mb-4">
            <input
              type={showSecret ? "text" : "password"}
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Admin secret key"
              className={`${inputCls} pr-12`}
            />
            <button type="button" onClick={() => setShowSecret(!showSecret)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-maroon">
              {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {authError && <p className="text-red-600 text-xs mb-3 font-body">{authError}</p>}
          <button onClick={handleAuth}
            className="w-full bg-maroon text-cream-dark font-display font-bold py-3 rounded-xl hover:bg-maroon-dark transition-colors duration-200">
            உள்நுழை · Enter
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-maroon-dark text-cream-dark px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gold-light">மாதவம் நிர்வாகம்</h1>
          <p className="text-cream/50 text-xs font-body">Admin Panel — Events Manager</p>
        </div>
        <span className="text-xs text-cream/30 font-body">{events.length} events in DB</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* ── Add / Edit Event Form ──────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <div className={`bg-white rounded-3xl shadow-card p-6 md:p-8 ${editingId ? "ring-2 ring-gold/60" : ""}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-maroon flex items-center gap-2">
                {editingId ? <><Pencil size={20} /> நிகழ்வை திருத்து · Edit Event</> : <><Plus size={20} /> புதிய நிகழ்வு சேர் · Add New Event</>}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="flex items-center gap-1 text-xs text-ink-light hover:text-red-500 font-body transition-colors">
                  <X size={14} /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Image Upload */}
              <Field label="நிகழ்வு படம்" sublabel="Event Image">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="relative w-full h-44 rounded-2xl border-2 border-dashed border-gold/40 bg-cream-dark hover:border-gold hover:bg-gold/5 transition-all duration-200 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {imagePreview ? (
                    <Image src={imagePreview} alt="preview" fill className="object-cover" />
                  ) : form.image_url ? (
                    <Image src={form.image_url} alt="preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-ink-light">
                      <Upload size={28} className="text-gold" />
                      <span className="font-body text-sm">படத்தை தேர்வு செய்யவும் · Click to upload</span>
                      <span className="text-xs opacity-60">JPG, PNG, WEBP (max 5MB)</span>
                    </div>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-maroon/60 flex items-center justify-center">
                      <span className="text-cream font-body text-sm animate-pulse">Uploading...</span>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onImagePick} />
                {/* Or paste URL */}
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => { set("image_url", e.target.value); setImagePreview(""); setImageFile(null); }}
                  placeholder="அல்லது படத்தின் URL ஒட்டவும் · Or paste image URL"
                  className={inputCls}
                />
              </Field>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Event Name" sublabel="English *">
                  <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Pongal Vizha" className={inputCls} />
                </Field>
                <Field label="நிகழ்வு பெயர்" sublabel="Tamil *">
                  <input required value={form.name_tamil} onChange={(e) => set("name_tamil", e.target.value)}
                    placeholder="எ.கா. பொங்கல் விழா" className={inputCls} />
                </Field>
              </div>

              {/* Slug */}
              <Field label="URL Slug" sublabel="auto-generated, editable">
                <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                  placeholder="pongal-vizha" className={`${inputCls} font-mono text-xs`} />
              </Field>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date" sublabel="English">
                  <input value={form.date} onChange={(e) => set("date", e.target.value)}
                    placeholder="e.g. January 14, 2026" className={inputCls} />
                </Field>
                <Field label="தேதி" sublabel="Tamil">
                  <input value={form.date_tamil} onChange={(e) => set("date_tamil", e.target.value)}
                    placeholder="எ.கா. ஜனவரி 14, 2026" className={inputCls} />
                </Field>
              </div>

              {/* Short Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Short Description" sublabel="English">
                  <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
                    placeholder="A brief one-line description..." className={textareaCls} rows={3} />
                </Field>
                <Field label="சுருக்கம்" sublabel="Tamil">
                  <textarea value={form.description_tamil} onChange={(e) => set("description_tamil", e.target.value)}
                    placeholder="சுருக்கமான விவரணம்..." className={textareaCls} rows={3} />
                </Field>
              </div>

              {/* Full Details */}
              <Field label="Full Details" sublabel="English — shown on event detail page">
                <textarea value={form.details} onChange={(e) => set("details", e.target.value)}
                  placeholder={"Describe the event in full...\n• Sub-event 1\n• Sub-event 2"}
                  className={textareaCls} rows={6} />
              </Field>
              <Field label="முழு விவரம்" sublabel="Tamil">
                <textarea value={form.details_tamil} onChange={(e) => set("details_tamil", e.target.value)}
                  placeholder={"நிகழ்வை விரிவாக விவரிக்கவும்...\n• துணை நிகழ்வு 1\n• துணை நிகழ்வு 2"}
                  className={textareaCls} rows={6} />
              </Field>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={submitting || uploading}
                className={`w-full font-display font-bold text-lg py-3.5 rounded-2xl disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2 text-cream-dark ${
                  editingId
                    ? "bg-gold hover:bg-gold/80 shadow-gold-glow"
                    : "bg-maroon hover:bg-maroon-dark shadow-maroon-glow"
                }`}
              >
                {submitting ? (
                  <span className="animate-pulse">{editingId ? "புதுப்பிக்கிறது... Updating..." : "சேர்க்கிறது... Adding..."}</span>
                ) : editingId ? (
                  <><Pencil size={20} /> நிகழ்வை புதுப்பி · Update Event</>
                ) : (
                  <><Plus size={20} /> நிகழ்வை சேர் · Add Event</>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* ── Existing Events List ───────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-card p-6">
            <h2 className="font-display text-lg font-bold text-maroon mb-4">
              தற்போதுள்ள நிகழ்வுகள் · Existing Events
            </h2>
            {loadingEvents ? (
              <p className="text-ink-light text-sm font-body animate-pulse">Loading...</p>
            ) : events.length === 0 ? (
              <p className="text-ink-light text-sm font-body">No events added yet via admin.</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {events.map((ev) => (
                  <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors duration-200 ${
                    editingId === ev.id
                      ? "bg-gold/10 border-gold/40"
                      : "bg-cream-dark border-cream-deeper"
                  }`}>
                    {ev.image_url && (
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={ev.image_url} alt={ev.name} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-maroon text-sm truncate">{ev.name}</p>
                      <p className="font-display text-ink-light text-xs truncate">{ev.name_tamil}</p>
                      {ev.date && <p className="font-body text-xs text-gold mt-0.5">{ev.date}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <button onClick={() => handleEdit(ev)}
                        title="Edit"
                        className="text-gold hover:text-gold/70 transition-colors duration-200">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(ev.id)}
                        title="Delete"
                        className="text-red-400 hover:text-red-600 transition-colors duration-200">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl font-body text-sm ${
              toast.type === "success" ? "bg-green-700 text-white" : "bg-red-700 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
