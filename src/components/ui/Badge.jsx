const STATUS_MAP = {
  Active: 'green',    Inactive: 'red',
  Verified: 'green',  Pending: 'amber',   Rejected: 'red',
  Paid: 'green',      Failed: 'red',      Unpaid: 'amber',
  Issued: 'green',    Cancelled: 'red',   Lapsed: 'amber',
  Health: 'blue',     Motor: 'amber',     Life: 'purple',
  Individual: 'blue', Corporate: 'purple', Family: 'green', Group: 'amber',
  Base: 'blue',       'Top-up': 'purple',
}

export function Badge({ variant = 'purple', children }) {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export function StatusBadge({ status }) {
  return <Badge variant={STATUS_MAP[status] ?? 'purple'}>{status}</Badge>
}

export function KYCBadge({ status }) {
  const v = status === 'Verified' ? 'green' : status === 'Pending' ? 'amber' : 'red'
  return <Badge variant={v}>{status}</Badge>
}
