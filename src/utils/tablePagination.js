/** Default rows per table page (see product spec). */
export const TABLE_PAGE_SIZE = 12;

export function totalPagesForCount(count, pageSize = TABLE_PAGE_SIZE) {
  const n = Math.max(0, Number(count) || 0);
  return Math.max(1, Math.ceil(n / pageSize));
}

function clampPage(page, totalPages) {
  const p = Math.floor(Number(page) || 1);
  return Math.min(Math.max(1, p), Math.max(1, totalPages));
}

/**
 * Classic compact pagination sequence with ellipsis markers.
 * @param {number} current
 * @param {number} total
 * @returns {(number | "ellipsis")[]}
 */
export function buildPaginationSequence(current, total) {
  const c = clampPage(current, total);
  const m = Math.max(1, total);
  if (m <= 7) {
    return Array.from({ length: m }, (_, i) => i + 1);
  }

  const delta = 1;
  /** @type {number[]} */
  const range = [];
  for (let i = 1; i <= m; i += 1) {
    if (i === 1 || i === m || (i >= c - delta && i <= c + delta)) {
      range.push(i);
    }
  }

  /** @type {(number | "ellipsis")[]} */
  const out = [];
  let l = 0;
  for (const i of range) {
    if (l) {
      if (i - l === 2) out.push(l + 1);
      else if (i - l > 1) out.push("ellipsis");
    }
    out.push(i);
    l = i;
  }
  return out;
}

/**
 * Client-side table pagination: replaces tbody HTML per page and wires controls.
 *
 * @param {object} opts
 * @param {HTMLElement} opts.root
 * @param {string} opts.tableSelector
 * @param {string} opts.paginationSelector
 * @param {() => any[]} opts.getItems
 * @param {(item: any) => string} opts.renderItemHtml
 * @param {string} [opts.totalLabelText]
 * @param {number} [opts.pageSize]
 */
/**
 * Static markup for the pagination bar (filled by {@link createTablePagination}).
 * @param {string} [totalLabelText]
 */
export function paginationBarHtml(totalLabelText = "Total campaigns:") {
  return `
    <div class="table-pagination" data-crm-pagination aria-label="Pagination">
      <div class="table-pagination__left">
        <span data-pagination-label>${totalLabelText}</span>
        <span class="bold" data-pagination-total>0</span>
      </div>
      <div class="table-pagination__center">
        <button type="button" class="table-pagination__nav table-pagination__muted" data-pagination-prev disabled>Prev</button>
        <span data-pagination-pages></span>
        <button type="button" class="table-pagination__nav table-pagination__muted" data-pagination-next disabled>Next</button>
      </div>
      <div class="table-pagination__right">
        <span class="table-pagination__muted">Go to page</span>
        <input
          class="table-pagination__input"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          data-pagination-goto
          aria-label="Page number"
        />
        <button type="button" class="table-pagination__nav table-pagination__go" data-pagination-go aria-label="Go to page">›</button>
      </div>
    </div>
  `;
}

export function createTablePagination({
  root,
  tableSelector,
  paginationSelector = "[data-crm-pagination]",
  getItems,
  renderItemHtml,
  totalLabelText = "Total campaigns:",
  pageSize = TABLE_PAGE_SIZE,
}) {
  const table = root.querySelector(tableSelector);
  const tbody = table?.querySelector("tbody");
  const pag = root.querySelector(paginationSelector);

  if (!tbody || !pag) {
    return {
      refresh: () => {},
      setPage: () => {},
      getPage: () => 1,
      destroy: () => {},
    };
  }

  const totalEl = pag.querySelector("[data-pagination-total]");
  const labelEl = pag.querySelector("[data-pagination-label]");
  const pagesHost = pag.querySelector("[data-pagination-pages]");
  const prevBtn = pag.querySelector("[data-pagination-prev]");
  const nextBtn = pag.querySelector("[data-pagination-next]");
  const gotoInput = pag.querySelector("[data-pagination-goto]");

  let currentPage = 1;

  const renderPageButtons = (totalPages) => {
    if (!pagesHost) return;
    pagesHost.innerHTML = "";
    const seq = buildPaginationSequence(currentPage, totalPages);
    for (const item of seq) {
      if (item === "ellipsis") {
        const span = document.createElement("span");
        span.className = "table-pagination__muted";
        span.textContent = "…";
        span.setAttribute("aria-hidden", "true");
        pagesHost.appendChild(span);
      } else {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `table-pagination__page${item === currentPage ? " is-active" : ""}`;
        btn.textContent = String(item);
        btn.dataset.paginationPage = String(item);
        pagesHost.appendChild(btn);
      }
    }
  };

  const updateNav = (totalPages) => {
    if (prevBtn) {
      prevBtn.disabled = currentPage <= 1;
      prevBtn.classList.toggle("is-disabled", currentPage <= 1);
    }
    if (nextBtn) {
      nextBtn.disabled = currentPage >= totalPages;
      nextBtn.classList.toggle("is-disabled", currentPage >= totalPages);
    }
    if (gotoInput) {
      gotoInput.min = "1";
      gotoInput.max = String(totalPages);
    }
  };

  const sync = (opts = {}) => {
    if (opts.resetPage) currentPage = 1;

    const items = Array.isArray(getItems?.()) ? getItems() : [];
    const total = items.length;
    const pages = totalPagesForCount(total, pageSize);
    currentPage = clampPage(currentPage, pages);

    const start = (currentPage - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);
    tbody.innerHTML = slice.map((it) => renderItemHtml(it)).join("");

    if (labelEl) labelEl.textContent = totalLabelText;
    if (totalEl) totalEl.textContent = String(total);

    renderPageButtons(pages);
    updateNav(pages);
  };

  const goToFromInput = () => {
    const items = Array.isArray(getItems?.()) ? getItems() : [];
    const pages = totalPagesForCount(items.length, pageSize);
    const raw = String(gotoInput?.value ?? "").trim();
    const n = parseInt(raw, 10);
    if (Number.isFinite(n)) currentPage = clampPage(n, pages);
    if (gotoInput) gotoInput.value = "";
    sync();
  };

  const onClick = (event) => {
    const pageBtn = event.target.closest?.("[data-pagination-page]");
    if (pageBtn && pag.contains(pageBtn)) {
      event.preventDefault();
      currentPage = Number(pageBtn.getAttribute("data-pagination-page"));
      sync();
      return;
    }

    const prev = event.target.closest?.("[data-pagination-prev]");
    if (prev && pag.contains(prev) && !prevBtn?.disabled) {
      event.preventDefault();
      currentPage -= 1;
      sync();
      return;
    }

    const next = event.target.closest?.("[data-pagination-next]");
    if (next && pag.contains(next) && !nextBtn?.disabled) {
      event.preventDefault();
      currentPage += 1;
      sync();
      return;
    }

    const go = event.target.closest?.("[data-pagination-go]");
    if (go && pag.contains(go)) {
      event.preventDefault();
      goToFromInput();
    }
  };

  const onKeyDown = (event) => {
    if (event.key !== "Enter") return;
    if (!pag.contains(event.target)) return;
    if (!event.target.matches?.("[data-pagination-goto]")) return;
    event.preventDefault();
    goToFromInput();
  };

  pag.addEventListener("click", onClick);
  pag.addEventListener("keydown", onKeyDown);

  return {
    refresh: (opts) => sync(opts),
    setPage: (p) => {
      const items = Array.isArray(getItems?.()) ? getItems() : [];
      const pages = totalPagesForCount(items.length, pageSize);
      currentPage = clampPage(p, pages);
      sync();
    },
    getPage: () => currentPage,
    destroy: () => {
      pag.removeEventListener("click", onClick);
      pag.removeEventListener("keydown", onKeyDown);
    },
  };
}
