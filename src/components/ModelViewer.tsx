"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const defaultModels = [
  { name: "سنسال", nameEn: "Necklace", file: "/models/%D8%B3%D9%86%D8%B3%D8%A7%D9%84.glb", isCustom: false },
  { name: "خاتم", nameEn: "Ring", file: "/models/%D8%AE%D8%A7%D8%AA%D9%85.glb", isCustom: false },
  { name: "خاتم دهب", nameEn: "Gold Ring", file: "/models/%D8%AE%D8%A7%D8%AA%D9%85%20%D8%AF%D9%87%D8%A8.glb", isCustom: false },
  { name: "خاتم الماس", nameEn: "Diamond Ring", file: "/models/%D8%AE%D8%A7%D8%AA%D9%85%20%D8%A7%D9%84%D9%85%D8%A7%D8%B3%20%D8%B5%D8%BA%D9%8A%D8%B1.glb", isCustom: false },
  { name: "حلق", nameEn: "Earring", file: "/models/%D8%AD%D9%84%D9%82.glb", isCustom: false },
];

type ModelItem = { name: string; nameEn: string; file: string; isCustom: boolean };

const DB_NAME = "beit-al-dahab-3d-models";
const DB_STORE = "models";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(DB_STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveCustomModel(name: string, blob: Blob) {
  const db = await openDB();
  db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).put(blob, name);
}

async function loadCustomModels(): Promise<{ name: string; url: string }[]> {
  try {
    const db = await openDB();
    const keys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const req = tx.objectStore(DB_STORE).getAllKeys();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    const results: { name: string; url: string }[] = [];
    for (const key of keys) {
      const blob = await new Promise<Blob | undefined>((resolve, reject) => {
        const tx = db.transaction(DB_STORE, "readonly");
        const req = tx.objectStore(DB_STORE).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      if (blob) {
        results.push({ name: String(key), url: URL.createObjectURL(blob) });
      }
    }
    return results;
  } catch {
    return [];
  }
}

async function deleteCustomModel(name: string) {
  const db = await openDB();
  db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE).delete(name);
}

export default function ModelViewer() {
  const [selectedModel, setSelectedModel] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [models, setModels] = useState<ModelItem[]>(defaultModels);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const model = models[selectedModel];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    loadCustomModels().then((customs) => {
      if (customs.length > 0) {
        setModels((prev) => [
          ...defaultModels,
          ...customs.map((c) => ({ name: c.name, nameEn: c.name, file: c.url, isCustom: true })),
        ]);
      }
    });
  }, [mounted]);

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".glb")) {
      alert("الرجاء اختيار ملف GLB");
      return;
    }
    const fileName = file.name.replace(".glb", "");
    const blob = new Blob([await file.arrayBuffer()], { type: "model/gltf-binary" });
    const url = URL.createObjectURL(blob);
    await saveCustomModel(fileName, blob);
    setModels((prev) => [...prev, { name: fileName, nameEn: fileName, file: url, isCustom: true }]);
    setSelectedModel(models.length);
    setLoading(true);
    e.target.value = "";
  }, [models.length]);

  const handleDelete = useCallback(async (index: number) => {
    const m = models[index];
    if (!m.isCustom) return;
    if (!confirm(`حذف "${m.name}"؟`)) return;
    await deleteCustomModel(m.name);
    if (m.file.startsWith("blob:")) URL.revokeObjectURL(m.file);
    setModels((prev) => prev.filter((_, i) => i !== index));
    setSelectedModel((prev) => (prev >= index ? Math.max(0, prev - 1) : prev));
  }, [models]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    const el = containerRef.current;
    el.innerHTML = "";
    setLoading(true);

    const checkModelViewer = setInterval(() => {
      if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
        clearInterval(checkModelViewer);
        createModelViewer();
      }
    }, 100);

    const timeout = setTimeout(() => {
      clearInterval(checkModelViewer);
      setLoading(false);
    }, 10000);

    function createModelViewer() {
      if (!containerRef.current) return;
      const container = containerRef.current;
      container.innerHTML = "";

      const mv = document.createElement("model-viewer") as any;
      mv.setAttribute("src", model.file);
      mv.setAttribute("alt", model.name);
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("auto-rotate", "");
      mv.setAttribute("auto-rotate-delay", "0");
      mv.setAttribute("rotation-per-second", "30deg");
      mv.setAttribute("shadow-intensity", "0");
      mv.setAttribute("exposure", "1.2");
      mv.setAttribute("camera-orbit", "45deg 65deg 5m");
      mv.setAttribute("min-camera-orbit", "auto auto 2m");
      mv.setAttribute("max-camera-orbit", "Infinity Infinity 12m");
      mv.setAttribute("camera-target", "0m 0m 0m");
      mv.style.width = "100%";
      mv.style.height = "100%";
      mv.style.background = "transparent";

      mv.addEventListener("load", () => setLoading(false));
      mv.addEventListener("error", () => setLoading(false));

      container.appendChild(mv);
    }

    return () => {
      clearInterval(checkModelViewer);
      clearTimeout(timeout);
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [selectedModel, model.file, mounted]);

  if (!mounted) {
    return (
      <section className="py-20 px-6 md:px-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(205,161,90,0.05),transparent_70%)]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gradient-gold font-bold mb-4">
              معاينة ثلاثية الأبعاد
            </h2>
            <p className="text-foreground/50 text-base sm:text-lg max-w-2xl mx-auto">
              استعرضي مجوهراتنا من جميع الزوايا قبل الشراء
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
            <div className="w-full max-w-[500px] aspect-square bg-surface/60 border border-gold/10 rounded-3xl overflow-hidden flex items-center justify-center">
              <div className="text-gold/40 text-sm">جاري التحميل...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-6 md:px-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(205,161,90,0.05),transparent_70%)]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-gradient-gold font-bold mb-4">
            معاينة ثلاثية الأبعاد
          </h2>
          <p className="text-foreground/50 text-base sm:text-lg max-w-2xl mx-auto">
            استعرضي مجوهراتنا من جميع الزوايا قبل الشراء
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* 3D Viewer */}
          <div className="w-full max-w-[500px] aspect-square bg-surface/60 border border-gold/10 rounded-3xl overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  <span className="text-gold/60 text-sm">جاري تحميل النموذج...</span>
                </div>
              </div>
            )}
            <div
              ref={containerRef}
              className="w-full h-full flex items-center justify-center"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-gold/80 text-xs px-4 py-2 rounded-full pointer-events-none z-10">
              اسحب للتدوير • تمرير للتكبير
            </div>
          </div>

          {/* Model List */}
          <div className="flex flex-row lg:flex-col gap-2 flex-wrap justify-center max-h-[520px] overflow-y-auto">
            {models.map((m, i) => (
              <div key={`${m.name}-${i}`} className="relative group">
                <button
                  onClick={() => { setSelectedModel(i); setLoading(true); }}
                  className={`px-5 py-3 rounded-2xl border transition-all text-right min-w-[140px] w-full ${
                    selectedModel === i
                      ? "bg-gold/10 border-gold/40 text-gold"
                      : "bg-surface/40 border-gold/10 text-foreground/50 hover:border-gold/20 hover:text-foreground/70"
                  }`}
                >
                  <span className="font-display text-sm block">{m.name}</span>
                  <span className="text-xs opacity-60">{m.nameEn}</span>
                  {m.isCustom && (
                    <span className="text-[10px] text-gold/40 block mt-0.5">משומך</span>
                  )}
                </button>
                {m.isCustom && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                    className="absolute -left-2 -top-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add Custom Model Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 rounded-2xl border-2 border-dashed border-gold/20 hover:border-gold/40 text-gold/50 hover:text-gold/80 transition-all min-w-[140px] flex items-center justify-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              <span className="font-display text-sm">أضافة قطعة</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb"
              onChange={handleUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
