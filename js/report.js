// Community reporting form mock-up (report.html)
// Reports are kept in localStorage only; nothing is sent to a server.

const BARANGAYS = [
  "Abulalas", "Carillo", "Iba", "Iba-Ibayo", "Mercado", "Palapat", "Pugad", "Sagrada Familia",
  "San Agustin", "San Isidro", "San Jose", "San Juan", "San Miguel", "San Nicolas", "San Pablo",
  "San Pascual", "San Pedro", "San Roque", "San Sebastian", "Santa Cruz", "Santa Elena",
  "Santa Monica", "Santo Niño", "Santo Rosario", "Tampok", "Tibaguin",
];

const STORAGE_KEY = "groundwatch-reports";

// Fallback when localStorage is blocked (private mode, some file:// setups):
// reports still show for the current visit, they just don't persist.
let memoryReports = [];

function loadReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : memoryReports.slice();
  } catch (e) {
    return memoryReports.slice();
  }
}

function saveReports(reports) {
  memoryReports = reports.slice();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (e) {
    // Storage unavailable; memoryReports keeps them for this visit
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("report-form");
  const barangay = document.getElementById("barangay");
  const date = document.getElementById("date");
  const success = document.getElementById("form-success");
  const list = document.getElementById("report-list");
  const clearBtn = document.getElementById("clear-reports");

  BARANGAYS.forEach((b) => barangay.add(new Option(b, b)));

  // Local date as YYYY-MM-DD (toISOString alone would give the UTC date)
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  date.max = today;
  date.value = today;

  function renderList() {
    const reports = loadReports();
    clearBtn.hidden = reports.length === 0;
    if (reports.length === 0) {
      list.innerHTML = '<li class="note">No reports yet. Submit one above to see it here.</li>';
      return;
    }
    list.innerHTML = reports
      .slice()
      .reverse()
      .map(
        (r) => `
        <li>
          <strong>${escapeHtml(r.type)}</strong> &middot; Brgy. ${escapeHtml(r.barangay)}
          <div class="meta">${escapeHtml(r.date)}${r.location ? " &middot; " + escapeHtml(r.location) : ""} &middot; ${escapeHtml(r.severity)}</div>
          <p style="margin:6px 0 0">${escapeHtml(r.details)}</p>
          <div class="meta">Reported by ${r.name ? escapeHtml(r.name) : "Anonymous"}</div>
        </li>`
      )
      .join("");
  }

  function validate() {
    let ok = true;
    form.querySelectorAll(".field[data-required]").forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      let valid = input.value.trim() !== "";
      if (input.id === "details") valid = input.value.trim().length >= 15;
      if (input.id === "date") valid = valid && input.value <= today;
      field.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    success.classList.remove("show");
    if (!validate()) {
      form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea").focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    const report = {
      name: data.name.trim(),
      barangay: data.barangay,
      type: data.type,
      date: data.date,
      location: data.location.trim(),
      severity: data.severity.split(":")[0],
      details: data.details.trim(),
      submitted: new Date().toISOString(),
    };

    const reports = loadReports();
    reports.push(report);
    saveReports(reports);

    const refNo = "GW-" + Date.now().toString().slice(-6);
    success.innerHTML = `<strong>Thank you for your report!</strong> Reference number: ${refNo}.
      Your observation helps raise awareness about land subsidence in Brgy. ${escapeHtml(report.barangay)}.`;
    success.classList.add("show");

    form.reset();
    date.value = today;
    renderList();
  });

  // Clear the error as soon as the user fixes a field
  form.addEventListener("input", (e) => {
    const field = e.target.closest(".field.invalid");
    if (field) field.classList.remove("invalid");
  });

  clearBtn.addEventListener("click", () => {
    if (confirm("Remove all reports saved on this device?")) {
      saveReports([]);
      renderList();
    }
  });

  renderList();
});
