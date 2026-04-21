import { escapeHtml } from "../utils/escapeHtml.js";

function calendarIconSvg() {
  return `<svg class="crm-datepicker__icon-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" width="18" height="18">
    <path fill="none" stroke="currentColor" stroke-width="1.5" d="M7 3v3M17 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/>
  </svg>`;
}

/**
 * @param {{ labelText: string; placeholder: string; required?: boolean; fieldKey?: string }} opts
 */
export function campaignDatePickerField({ labelText, placeholder, required = false, fieldKey = "" }) {
  const req = required ? '<span class="crm-field__req">*</span>' : "";
  const ph = escapeHtml(placeholder);
  const fieldAttr = fieldKey ? ` data-field="${escapeHtml(fieldKey)}"` : "";
  return `
    <div class="crm-field"${fieldAttr}>
      <span class="crm-field__label">${escapeHtml(labelText)} ${req}</span>
      <div class="crm-datepicker" data-campaign-datepicker data-placeholder="${ph}">
        <button type="button" class="crm-datepicker__trigger" aria-expanded="false" aria-haspopup="dialog">
          <span class="crm-datepicker__icon" aria-hidden="true">${calendarIconSvg()}</span>
          <span class="crm-datepicker__text">${ph}</span>
        </button>
        <input type="hidden" class="crm-datepicker__value" value="" />
        <div class="crm-datepicker__popover" hidden>
          <div class="crm-datepicker__head">
            <button type="button" class="crm-datepicker__navbtn" data-dp-prev aria-label="Previous month">‹</button>
            <span class="crm-datepicker__caption" data-dp-caption></span>
            <button type="button" class="crm-datepicker__navbtn" data-dp-next aria-label="Next month">›</button>
          </div>
          <div class="crm-datepicker__weekdays" aria-hidden="true">
            <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
          </div>
          <div class="crm-datepicker__divider" aria-hidden="true"></div>
          <div class="crm-datepicker__grid" data-dp-grid></div>
        </div>
      </div>
    </div>
  `;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDisplay(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function toIsoDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthCaption(year, month) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, month, 1));
}

function buildGridDates(viewYear, viewMonth) {
  const first = new Date(viewYear, viewMonth, 1);
  const dow = first.getDay();
  const mondayOffset = (dow + 6) % 7;
  const start = new Date(viewYear, viewMonth, 1 - mondayOffset);
  const out = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d);
  }
  return out;
}

/**
 * @param {HTMLElement} root
 * @returns {() => void}
 */
export function mountCampaignDatePickers(root) {
  const pickers = Array.from(root.querySelectorAll("[data-campaign-datepicker]"));
  const removers = [];

  const closePicker = (picker) => {
    const pop = picker.querySelector(".crm-datepicker__popover");
    const trig = picker.querySelector(".crm-datepicker__trigger");
    if (pop) {
      pop.hidden = true;
      pop.style.position = "";
      pop.style.left = "";
      pop.style.top = "";
      pop.style.width = "";
      pop.style.zIndex = "";
    }
    picker.classList.remove("is-open");
    if (trig) trig.setAttribute("aria-expanded", "false");
  };

  const closeAll = () => {
    pickers.forEach(closePicker);
  };

  pickers.forEach((picker) => {
    const trigger = picker.querySelector(".crm-datepicker__trigger");
    const popover = picker.querySelector(".crm-datepicker__popover");
    const caption = picker.querySelector("[data-dp-caption]");
    const grid = picker.querySelector("[data-dp-grid]");
    const prevBtn = picker.querySelector("[data-dp-prev]");
    const nextBtn = picker.querySelector("[data-dp-next]");
    const hidden = picker.querySelector(".crm-datepicker__value");
    const textEl = picker.querySelector(".crm-datepicker__text");
    const placeholder = picker.getAttribute("data-placeholder") || "Select date";

    let viewYear = new Date().getFullYear();
    let viewMonth = new Date().getMonth();
    /** @type {Date | null} */
    let selected = null;

    const renderCaption = () => {
      if (caption) caption.textContent = monthCaption(viewYear, viewMonth);
    };

    const renderGrid = () => {
      if (!grid) return;
      const days = buildGridDates(viewYear, viewMonth);
      grid.innerHTML = "";
      days.forEach((d) => {
        const inMonth = d.getMonth() === viewMonth;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "crm-datepicker__day";
        if (!inMonth) btn.classList.add("crm-datepicker__day--muted");
        if (selected && sameDay(d, selected)) btn.classList.add("is-selected");
        btn.textContent = String(d.getDate());
        btn.dataset.iso = toIsoDate(d);
        grid.appendChild(btn);
      });
    };

    const syncLabel = () => {
      if (!textEl) return;
      if (selected) {
        textEl.textContent = formatDisplay(selected);
        textEl.classList.add("has-value");
      } else {
        textEl.textContent = placeholder;
        textEl.classList.remove("has-value");
      }
      if (hidden) hidden.value = selected ? toIsoDate(selected) : "";
    };

    const positionPopover = () => {
      if (!popover || !trigger) return;
      // const width = "100%";
      popover.style.position = "absolute";
      // popover.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`;
      popover.style.bottom = `45px`;
      popover.style.width = `100%`;
      popover.style.zIndex = "12050";
    };

    const open = () => {
      if (selected) {
        viewYear = selected.getFullYear();
        viewMonth = selected.getMonth();
      }
      renderCaption();
      renderGrid();
      if (popover) popover.hidden = false;
      positionPopover();
      picker.classList.add("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
    };

    const onTriggerClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const wasOpen = picker.classList.contains("is-open");
      closeAll();
      if (!wasOpen) open();
    };

    const onPrev = (e) => {
      e.preventDefault();
      e.stopPropagation();
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      renderCaption();
      renderGrid();
    };

    const onNext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderCaption();
      renderGrid();
    };

    const onGridClick = (e) => {
      const dayBtn = e.target.closest?.(".crm-datepicker__day");
      if (!dayBtn || !grid?.contains(dayBtn)) return;
      e.preventDefault();
      e.stopPropagation();
      const iso = dayBtn.dataset.iso;
      if (!iso) return;
      const [y, m, d] = iso.split("-").map(Number);
      selected = new Date(y, m - 1, d);
      syncLabel();
      renderGrid();
      closePicker(picker);
    };

    trigger?.addEventListener("click", onTriggerClick);
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);
    grid?.addEventListener("click", onGridClick);

    removers.push(() => {
      trigger?.removeEventListener("click", onTriggerClick);
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      grid?.removeEventListener("click", onGridClick);
      closePicker(picker);
    });
  });

  const onDocClick = (e) => {
    const t = e.target;
    if (!(t instanceof Node)) return;
    if (root.contains(t) && t.closest?.("[data-campaign-datepicker]")) return;
    closeAll();
  };

  const onDocKey = (e) => {
    if (e.key !== "Escape") return;
    const open = root.querySelector("[data-campaign-datepicker].is-open");
    if (!open) return;
    e.preventDefault();
    e.stopPropagation();
    closePicker(open);
  };

  document.addEventListener("click", onDocClick, true);
  document.addEventListener("keydown", onDocKey, true);

  return () => {
    document.removeEventListener("click", onDocClick, true);
    document.removeEventListener("keydown", onDocKey, true);
    removers.forEach((fn) => fn());
  };
}

export function closeCampaignDatePickersIn(root) {
  root.querySelectorAll("[data-campaign-datepicker].is-open").forEach((picker) => {
    const pop = picker.querySelector(".crm-datepicker__popover");
    const trig = picker.querySelector(".crm-datepicker__trigger");
    if (pop) {
      pop.hidden = true;
      pop.style.position = "";
      pop.style.left = "";
      pop.style.top = "";
      pop.style.width = "";
      pop.style.zIndex = "";
    }
    picker.classList.remove("is-open");
    if (trig) trig.setAttribute("aria-expanded", "false");
  });
}
