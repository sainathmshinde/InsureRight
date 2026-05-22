import { useState } from 'react'
import { Field, Input, Select } from '../../components/Field'

const MEMBER_TYPES = [
  { value: 'Spouse',         label: 'Spouse',          icon: '💑' },
  { value: 'Son',            label: 'Son',              icon: '👦' },
  { value: 'Daughter',       label: 'Daughter',         icon: '👧' },
  { value: 'Father',         label: 'Father',           icon: '👨' },
  { value: 'Mother',         label: 'Mother',           icon: '👩' },
  { value: 'Father-in-Law',  label: 'Father-in-Law',    icon: '👴' },
  { value: 'Mother-in-Law',  label: 'Mother-in-Law',    icon: '👵' },
  { value: 'Sibling',        label: 'Sibling',          icon: '🧑' },
]
export const TYPE_ICON = Object.fromEntries(MEMBER_TYPES.map(t => [t.value, t.icon]))
const EMPTY = { type: 'Spouse', name: '', dob: '', gender: '' }

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 3600 * 1000))
}

export default function FamilyMembersSection({ members = [], onChange }) {
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft]       = useState(EMPTY)
  const [editId, setEditId]     = useState(null)

  const setD = f => e => setDraft(p => ({ ...p, [f]: e.target.value }))

  const save = () => {
    if (!draft.name.trim()) return
    if (editId) {
      onChange(members.map(m => m.id === editId ? { ...draft, id: editId } : m))
      setEditId(null)
    } else {
      onChange([...members, { ...draft, id: Date.now() }])
    }
    setDraft(EMPTY)
    setShowForm(false)
  }

  const remove = id => onChange(members.filter(m => m.id !== id))

  const startEdit = m => { setDraft(m); setEditId(m.id); setShowForm(true) }
  const cancel    = () => { setDraft(EMPTY); setEditId(null); setShowForm(false) }

  return (
    <div>
      {members.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {members.map(m => {
            const age = calcAge(m.dob)
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', background: '#fff' }}>
                <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f3ff', borderRadius: 10, fontSize: 22, flexShrink: 0 }}>
                  {TYPE_ICON[m.type] ?? '👤'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    {m.type}{m.gender ? ` · ${m.gender}` : ''}{age !== null ? ` · Age: ${age} yrs` : ''}{m.dob ? ` (${m.dob})` : ''}
                  </div>
                </div>
                <button type="button" onClick={() => startEdit(m)} title="Edit" style={{ background: 'linear-gradient(135deg,#fb7185,#a855f7)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: '5px 6px', color: '#fff', display: 'inline-flex', alignItems: 'center', boxShadow: '0 2px 6px rgba(168,85,247,.30)', flexShrink: 0 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg></button>
                <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(m.id)} style={{ flexShrink: 0 }}>Remove</button>
              </div>
            )
          })}
        </div>
      )}

      {members.length === 0 && !showForm && (
        <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-3)', fontSize: 13.5, border: '1.5px dashed var(--border)', borderRadius: 'var(--r-md)', marginBottom: 14 }}>
          No family members added yet.<br />
          <span style={{ fontSize: 12 }}>Add members to enable family floater policies and nominee selection.</span>
        </div>
      )}

      {showForm && (
        <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '18px 20px', marginBottom: 14 }}>
          <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 14, color: 'var(--text)' }}>
            {editId ? 'Edit Family Member' : 'Add Family Member'}
          </div>
          <div className="form-grid">
            <Field label="Member Type">
              <Select value={draft.type} onChange={setD('type')}>
                {MEMBER_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </Select>
            </Field>
            <Field label="Full Name" required>
              <Input placeholder="Member full name" value={draft.name} onChange={setD('name')} />
            </Field>
            <Field label="Date of Birth">
              <Input type="date" value={draft.dob} onChange={setD('dob')} max={new Date().toISOString().split('T')[0]} />
            </Field>
            <Field label="Gender">
              <Select value={draft.gender} onChange={setD('gender')}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </Field>
          </div>
          {draft.dob && (
            <div style={{ marginTop: 10, fontSize: 12.5, color: '#0891b2' }}>
              Age: <strong>{calcAge(draft.dob)} years</strong>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={cancel}>Cancel</button>
            <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={!draft.name.trim()}>
              {editId ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </div>
      )}

      {!showForm && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setDraft(EMPTY); setShowForm(true) }}>
          + Add Family Member
        </button>
      )}
    </div>
  )
}
