/* =============================================================================
   main.js – CattleGuard AI (8-Class Edition)
   Drag-drop upload, image preview, file validation, loading overlay.
   ============================================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const dropZone  = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fnDisplay = document.getElementById("fnDisplay");
  const fnText    = document.getElementById("fnText");
  const clearBtn  = document.getElementById("clearBtn");
  const submitBtn = document.getElementById("submitBtn");
  const preview   = document.getElementById("imgPreview");
  const dzText    = document.getElementById("dzText");
  const form      = document.getElementById("uploadForm");
  const overlay   = document.getElementById("loadingOverlay");

  if (!dropZone) return;  // Not on home page

  const ALLOWED = ["image/jpeg","image/jpg","image/png","image/bmp","image/webp"];
  const MAX_MB  = 10;

  /* ── File input change ─────────────────────────────────────────────────── */
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
  });

  /* ── Drag & Drop ───────────────────────────────────────────────────────── */
  ["dragenter","dragover"].forEach(e =>
    dropZone.addEventListener(e, ev => {
      ev.preventDefault();
      dropZone.classList.add("drag-over");
    })
  );
  ["dragleave","drop"].forEach(e =>
    dropZone.addEventListener(e, ev => {
      ev.preventDefault();
      dropZone.classList.remove("drag-over");
    })
  );
  dropZone.addEventListener("drop", ev => {
    const files = ev.dataTransfer.files;
    if (!files.length) return;
    const dt = new DataTransfer();
    dt.items.add(files[0]);
    fileInput.files = dt.files;
    handleFile(files[0]);
  });

  /* ── Handle chosen file ────────────────────────────────────────────────── */
  function handleFile(file) {
    if (!ALLOWED.includes(file.type)) {
      toast("Invalid file type. Please upload JPG, PNG, BMP, or WEBP.", "danger");
      reset(); return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast(`File too large (max ${MAX_MB} MB).`, "danger");
      reset(); return;
    }
    // Filename display
    fnText.textContent = file.name;
    fnDisplay.classList.remove("d-none");
    // Preview
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      preview.classList.remove("d-none");
      dzText.classList.add("d-none");
    };
    reader.readAsDataURL(file);
  }

  /* ── Clear ─────────────────────────────────────────────────────────────── */
  clearBtn?.addEventListener("click", reset);
  function reset() {
    fileInput.value = "";
    fnDisplay.classList.add("d-none");
    preview.classList.add("d-none");
    preview.src = "#";
    dzText.classList.remove("d-none");
  }

  /* ── Submit – show spinner & overlay ──────────────────────────────────── */
  form.addEventListener("submit", e => {
    if (!fileInput.files.length) {
      e.preventDefault();
      toast("Please select an image before submitting.", "warning");
      return;
    }
    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").classList.add("d-none");
    submitBtn.querySelector(".btn-spin").classList.remove("d-none");
    if (overlay) overlay.classList.add("active");
  });

  /* ── Toast helper ──────────────────────────────────────────────────────── */
  function toast(msg, type = "info") {
    const el = document.createElement("div");
    el.className = `alert alert-${type} alert-dismissible fade show
                    position-fixed top-0 start-50 translate-middle-x mt-3`;
    el.style.cssText = "z-index:9999;min-width:300px;max-width:90vw;";
    el.innerHTML = `${msg}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 4200);
  }

});
