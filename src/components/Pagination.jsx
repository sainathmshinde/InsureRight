/* Pagination.jsx — reusable, drop into any list page */
export default function Pagination({
  total,
  page,
  perPage,
  onPage,
  onPerPage,
}) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 0) return null;

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  // Build page number array with ellipsis
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    )
      pages.push(i);
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div style={styles.wrap}>
      {/* Left: showing X–Y of Z */}
      <span style={styles.info}>
        Showing{" "}
        <strong>
          {from}–{to}
        </strong>{" "}
        of <strong>{total}</strong>
      </span>

      {/* Center: prev / pages / next */}
      <div style={styles.controls}>
        <button
          style={{ ...styles.btn, ...(page === 1 ? styles.btnDisabled : {}) }}
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
        >
          ‹
        </button>

        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dot-${i}`} style={styles.ellipsis}>
              …
            </span>
          ) : (
            <button
              key={p}
              style={{ ...styles.btn, ...(p === page ? styles.btnActive : {}) }}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          ),
        )}

        <button
          style={{
            ...styles.btn,
            ...(page === totalPages ? styles.btnDisabled : {}),
          }}
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
        >
          ›
        </button>
      </div>

      {/* Right: rows per page */}
      <div style={styles.perPageWrap}>
        <span style={styles.info}>Rows per page</span>
        <select
          value={perPage}
          onChange={(e) => {
            onPerPage(Number(e.target.value));
            onPage(1);
          }}
          style={styles.select}
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 16,
    borderTop: "1px solid var(--border)",
    marginTop: 4,
  },
  info: {
    fontSize: 13,
    color: "var(--text-3)",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  btn: {
    minWidth: 34,
    height: 34,
    padding: "0 10px",
    borderRadius: 6,
    border: "1.5px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-2)",
    fontSize: 13.5,
    fontWeight: 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background .12s, border-color .12s, color .12s",
    fontFamily: "inherit",
  },
  btnActive: {
    background: "var(--brand)",
    borderColor: "var(--brand)",
    color: "#fff",
  },
  btnDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  ellipsis: {
    fontSize: 14,
    color: "var(--text-3)",
    padding: "0 4px",
  },
  perPageWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  select: {
    height: 34,
    padding: "0 28px 0 10px",
    border: "1.5px solid var(--border)",
    borderRadius: 6,
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239d94b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  },
};
