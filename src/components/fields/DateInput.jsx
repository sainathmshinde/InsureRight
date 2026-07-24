const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDDMMMYYYY(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const mi = Number(m) - 1;
  if (!y || !d || mi < 0 || mi > 11) return "";
  return `${d}-${MONTHS[mi]}-${y}`;
}

export function DateInput({
  value,
  onChange,
  required,
  className = "",
  ...props
}) {
  return (
    <div className="date-field-wrap">
      <input
        type="date"
        className={`field-input date-field-native ${className}`.trim()}
        value={value || ""}
        onChange={onChange}
        required={required}
        {...props}
      />
      <span className="date-field-display">
        {value ? (
          formatDDMMMYYYY(value)
        ) : (
          <span className="date-field-placeholder">dd-mmm-yyyy</span>
        )}
      </span>
    </div>
  );
}
