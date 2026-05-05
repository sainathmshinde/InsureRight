import { useState } from 'react'
import { DocumentViewerModal } from './DocumentViewerModal'

const DOC_TYPES = {
  pan:       { label: 'PAN Card',           icon: '🪪', color: '#b45309', bg: '#fef3c7', border: '#fcd34d' },
  aadhaar:   { label: 'Aadhaar Card',        icon: '🪪', color: '#1d4ed8', bg: '#eff6ff', border: '#93c5fd' },
  photo:     { label: 'Passport Photo',      icon: '🖼️', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  cheque:    { label: 'Cancelled Cheque',    icon: '🏦', color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' },
  agreement: { label: 'Agreement Document',  icon: '📋', color: '#1e40af', bg: '#eff6ff', border: '#93c5fd' },
}

function resolveDoc(value) {
  if (!value) return null

  // Real uploaded File
  if (value instanceof File) {
    const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(value.name)
    return {
      label: value.name,
      icon: isImage ? '🖼️' : '📄',
      color: '#166534',
      bg: '#f0fdf4',
      border: '#86efac',
      isFile: true,
    }
  }

  // URL from doc() helper — parse type param
  if (typeof value === 'string') {
    const idx = value.indexOf('?')
    if (idx !== -1) {
      const p = new URLSearchParams(value.slice(idx + 1))
      const type = p.get('type')
      const name = p.get('name') || ''
      const info = DOC_TYPES[type]
      if (info) return { ...info, name, type, isFile: false }
    }
    // Plain filename fallback
    return { label: value.split('/').pop(), icon: '📄', color: '#166534', bg: '#f0fdf4', border: '#86efac', isFile: false }
  }

  return null
}

export function UploadBox({
  label = 'Click to upload',
  hint = 'PDF, JPG, PNG up to 5MB',
  accept,
  onChange,
  value,
}) {
  const [viewing, setViewing] = useState(false)
  const doc = resolveDoc(value)

  if (doc) {
    return (
      <>
        <div style={{
          border: `1.5px solid ${doc.border}`,
          background: doc.bg,
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          {/* Icon */}
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'white', border: `1px solid ${doc.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, flexShrink: 0,
          }}>
            {doc.icon}
          </div>

          {/* Label */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: doc.color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {doc.label}
            </div>
            {doc.name && (
              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 1 }}>{doc.name}</div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setViewing(true)}
              style={{
                fontSize: 12, padding: '4px 11px', borderRadius: 6,
                border: `1px solid ${doc.color}`, background: 'white',
                color: doc.color, cursor: 'pointer', fontWeight: 600,
              }}
            >
              View
            </button>
            <label style={{
              fontSize: 12, padding: '4px 11px', borderRadius: 6,
              border: '1px solid #d1d5db', background: 'white',
              color: '#6b7280', cursor: 'pointer', fontWeight: 600,
            }}>
              Replace
              <input type="file" style={{ display: 'none' }} accept={accept} onChange={onChange} />
            </label>
          </div>
        </div>

        {viewing && (
          <DocumentViewerModal value={value} onClose={() => setViewing(false)} />
        )}
      </>
    )
  }

  return (
    <label className="upload-box">
      <input type="file" style={{ display: 'none' }} accept={accept} onChange={onChange} />
      <div className="upload-icon">📎</div>
      <div className="upload-label">{label}</div>
      <div className="upload-hint">{hint}</div>
    </label>
  )
}
