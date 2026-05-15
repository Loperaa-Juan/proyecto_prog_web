const API = "/api/productos";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const tbody          = document.getElementById("inventory-body");
const emptyRow       = document.getElementById("empty-row");
const paginationInfo = document.getElementById("pagination-info");
const modal          = document.getElementById("productModal");
const form           = document.getElementById("product-form");
const nameInput      = document.getElementById("product_name");
const priceInput     = document.getElementById("product_price");
const nameError      = document.getElementById("name-error");
const nameErrorMsg   = document.getElementById("name-error-msg");
const priceError     = document.getElementById("price-error");
const priceErrorMsg  = document.getElementById("price-error-msg");
const formError      = document.getElementById("form-error");
const formErrorMsg   = document.getElementById("form-error-msg");
const submitBtn      = document.getElementById("submit-btn");
const searchInput    = document.getElementById("search-input");
const cardTotal      = document.getElementById("card-total");
const cardAvailable  = document.getElementById("card-available");
const cardUnavailable = document.getElementById("card-unavailable");

// ── Estado local ──────────────────────────────────────────────────────────────
let allProductos = [];   // lista completa traída del servidor

// ── API helper ────────────────────────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data;
}

// ── Helpers de presentación ───────────────────────────────────────────────────
function formatPrice(precio) {
  return Number(precio).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });
}

function buildRow(p) {
  const toggleIcon  = p.disponible ? "toggle_on"  : "toggle_off";
  const toggleColor = p.disponible
    ? "text-green-600 hover:text-amber-500"
    : "text-on-surface-variant hover:text-green-600";
  const toggleTitle = p.disponible ? "Marcar como no disponible" : "Marcar como disponible";
  const statusBar   = p.disponible ? "status-bar-available" : "status-bar-unavailable";
  const chip        = p.disponible
    ? `<span class="status-chip status-available">Disponible</span>`
    : `<span class="status-chip status-unavailable">No disponible</span>`;

  return `
    <tr class="hover:bg-primary-fixed hover:bg-opacity-10 transition-colors group"
        data-id="${p.id}"
        data-nombre="${encodeURIComponent(p.nombre)}"
        data-precio="${p.precio}"
        data-disponible="${p.disponible}">
      <td class="py-3 px-md font-semibold flex items-center gap-sm">
        <div class="w-1 h-6 rounded-full flex-shrink-0 ${statusBar}"></div>
        ${p.nombre}
      </td>
      <td class="py-3 px-md font-mono-data text-mono-data">${formatPrice(p.precio)}</td>
      <td class="py-3 px-md">${chip}</td>
      <td class="py-3 px-md text-right">
        <div class="row-actions flex items-center justify-end gap-sm">
          <button
            class="p-1 rounded transition-all ${toggleColor}"
            title="${toggleTitle}"
            onclick="toggleDisponible(${p.id})"
          >
            <span class="material-symbols-outlined" style="font-size:22px">${toggleIcon}</span>
          </button>
          <button
            class="p-1 border border-outline-variant rounded text-error hover:bg-error hover:text-on-error hover:border-error transition-all"
            title="Eliminar producto"
            onclick="handleDelete(${p.id})"
          >
            <span class="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </td>
    </tr>`;
}

// ── Tarjetas de resumen ───────────────────────────────────────────────────────
function updateCards() {
  const total       = allProductos.length;
  const available   = allProductos.filter(p => p.disponible).length;
  const unavailable = total - available;

  cardTotal.textContent       = total;
  cardAvailable.textContent   = available;
  cardUnavailable.textContent = unavailable;
}

// ── Renderizar filas (acepta subconjunto para búsqueda) ───────────────────────
function renderRows(lista) {
  tbody.querySelectorAll("tr:not(#empty-row)").forEach(r => r.remove());

  if (lista.length === 0) {
    emptyRow.classList.remove("hidden");
    paginationInfo.textContent = "Sin resultados";
    return;
  }

  emptyRow.classList.add("hidden");
  tbody.insertAdjacentHTML("beforeend", lista.map(buildRow).join(""));
  const n = lista.length;
  paginationInfo.textContent = `${n} producto${n !== 1 ? "s" : ""}`;
}

// ── GET: cargar datos del servidor ────────────────────────────────────────────
async function renderTable() {
  try {
    allProductos = await apiFetch(API) ?? [];
    updateCards();
    applySearch();          // respeta el término que ya haya en el buscador
  } catch (err) {
    console.error("renderTable:", err);
  }
}

// ── Búsqueda en tiempo real ───────────────────────────────────────────────────
function applySearch() {
  const term = searchInput.value.trim().toLowerCase();
  if (!term) {
    renderRows(allProductos);
    return;
  }
  const filtered = allProductos.filter(p =>
    p.nombre.toLowerCase().includes(term)
  );
  renderRows(filtered);
}

searchInput.addEventListener("input", applySearch);

// ── PUT: alternar disponibilidad ──────────────────────────────────────────────
async function toggleDisponible(id) {
  const row = tbody.querySelector(`tr[data-id="${id}"]`);
  if (!row) return;

  const nombre     = decodeURIComponent(row.dataset.nombre);
  const precio     = parseFloat(row.dataset.precio);
  const disponible = row.dataset.disponible === "true";

  try {
    await apiFetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, disponible: !disponible }),
    });
    await renderTable();
  } catch (err) {
    console.error("toggleDisponible:", err);
  }
}

// ── DELETE: eliminar con confirmación ─────────────────────────────────────────
async function handleDelete(id) {
  if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
  try {
    await apiFetch(`${API}/${id}`, { method: "DELETE" });
    await renderTable();
  } catch (err) {
    console.error("handleDelete:", err);
  }
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal() {
  form.reset();
  clearErrors();
  modal.classList.remove("hidden");
  nameInput.focus();
}

function closeModal() {
  modal.classList.add("hidden");
  form.reset();
  clearErrors();
}

// ── Validación inline (sin alert) ────────────────────────────────────────────
function showFieldError(errorEl, msgEl, msg) {
  msgEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function clearFieldError(errorEl, inputEl) {
  errorEl.classList.add("hidden");
  inputEl.classList.remove("border-error");
}

function clearErrors() {
  clearFieldError(nameError,  nameInput);
  clearFieldError(priceError, priceInput);
  formError.classList.add("hidden");
}

function validateForm() {
  let valid = true;

  if (!nameInput.value.trim()) {
    showFieldError(nameError, nameErrorMsg, "El nombre es obligatorio.");
    nameInput.classList.add("border-error");
    valid = false;
  } else {
    clearFieldError(nameError, nameInput);
  }

  const precio = priceInput.value;
  if (precio === "" || isNaN(Number(precio)) || Number(precio) < 0) {
    showFieldError(priceError, priceErrorMsg, "Ingresa un precio válido (número ≥ 0).");
    priceInput.classList.add("border-error");
    valid = false;
  } else {
    clearFieldError(priceError, priceInput);
  }

  return valid;
}

nameInput.addEventListener("input",  () => clearFieldError(nameError,  nameInput));
priceInput.addEventListener("input", () => clearFieldError(priceError, priceInput));

// ── POST: crear producto ──────────────────────────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formError.classList.add("hidden");

  if (!validateForm()) return;

  const nombre = nameInput.value.trim();
  const precio = Number(priceInput.value);

  submitBtn.disabled    = true;
  submitBtn.textContent = "Guardando...";

  try {
    await apiFetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio }),
    });
    closeModal();
    await renderTable();
  } catch (err) {
    formErrorMsg.textContent = err.message;
    formError.classList.remove("hidden");
    console.error("createProducto:", err);
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Agregar";
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderTable();
