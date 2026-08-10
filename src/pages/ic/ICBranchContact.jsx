import { useState } from 'react'
import { Field, Input, Select } from '../../components/Field'
import { STATES } from '../member/orgAssocData'
import { useFormValidation } from '../../hooks/useFormValidation'
import { useToast } from '../../context/ToastContext'

export function ContactModal({ branches = [], onClose, onSave }) {
  const toast = useToast()
  const [draft, setDraft] = useState({ branchId: '', firstName: '', lastName: '', phone: '', email: '' })
  const setD = f => e => setDraft(p => ({ ...p, [f]: e.target.value }))

  const fv = useFormValidation(draft, {
    branchId: { required: true, label: 'Branch/Location' },
    firstName: { required: true, label: 'First Name' },
    lastName: { required: true, label: 'Last Name' },
    phone: { required: true, label: 'Phone Number' },
    email: { required: true, label: 'Email' },
  })

  const handleSave = e => {
    e.preventDefault()
    if (!fv.validateAll()) {
      toast.error('Please fix the highlighted fields before continuing.')
      return
    }
    onSave({ ...draft, branchId: Number(draft.branchId) })
    toast.success('Contact added successfully.')
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: 480, margin: 0 }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">Add Contact</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)', lineHeight: 1 }}>✕</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave} noValidate>
            <div className="form-grid">
              <Field label="Select Branch/Location" required className="col-span-2" error={fv.fieldProps('branchId').error}>
                <Select value={draft.branchId} onChange={setD('branchId')} required {...fv.fieldProps('branchId')}>
                  <option value="">Select branch/location</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.branchName}</option>)}
                </Select>
              </Field>
              <Field label="First Name" required error={fv.fieldProps('firstName').error}>
                <Input value={draft.firstName} onChange={setD('firstName')} required {...fv.fieldProps('firstName')} />
              </Field>
              <Field label="Last Name" required error={fv.fieldProps('lastName').error}>
                <Input value={draft.lastName} onChange={setD('lastName')} required {...fv.fieldProps('lastName')} />
              </Field>
              <Field label="Phone Number" required error={fv.fieldProps('phone').error}>
                <Input type="tel" placeholder="+91 XXXXX XXXXX" value={draft.phone} onChange={setD('phone')} required {...fv.fieldProps('phone')} />
              </Field>
              <Field label="Email" required error={fv.fieldProps('email').error}>
                <Input type="email" placeholder="contact@email.com" value={draft.email} onChange={setD('email')} required {...fv.fieldProps('email')} />
              </Field>
            </div>
            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Contact</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function BranchModal({ onClose, onSave }) {
  const toast = useToast()
  const [draft, setDraft] = useState({
    branchName: '', address1: '', address2: '', city: '', stateId: '', pinCode: '', country: 'India',
  })
  const setD = f => e => setDraft(p => ({ ...p, [f]: e.target.value }))

  const fv = useFormValidation(draft, {
    branchName: { required: true, label: 'Branch/Location Name' },
  })

  const handleSave = e => {
    e.preventDefault()
    if (!fv.validateAll()) {
      toast.error('Please fix the highlighted fields before continuing.')
      return
    }
    onSave(draft)
    toast.success('Branch added successfully.')
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: 640, margin: 0 }} onClick={e => e.stopPropagation()}>
        <div className="card-header">
          <div className="card-title">Add Branch/Location</div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-3)', lineHeight: 1 }}>✕</button>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave} noValidate>
            <div className="form-grid-3" style={{ marginBottom: 18 }}>
              <Field label="Branch/Location Name" required error={fv.fieldProps('branchName').error}>
                <Input placeholder="e.g. Mumbai Branch" value={draft.branchName} onChange={setD('branchName')} required {...fv.fieldProps('branchName')} />
              </Field>
              <Field label="Address Line 1">
                <Input placeholder="Street / Building" value={draft.address1} onChange={setD('address1')} />
              </Field>
              <Field label="Address Line 2">
                <Input placeholder="Area / Locality" value={draft.address2} onChange={setD('address2')} />
              </Field>
            </div>
            <div className="form-grid-3" style={{ marginBottom: 18 }}>
              <Field label="City">
                <Input placeholder="City" value={draft.city} onChange={setD('city')} />
              </Field>
              <Field label="State">
                <Select value={draft.stateId} onChange={setD('stateId')}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="PIN Code">
                <Input placeholder="400001" maxLength={6} value={draft.pinCode} onChange={setD('pinCode')} />
              </Field>
            </div>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add Branch/Location</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function BranchLocationSection({ form, setForm, onAddBranch }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Branch/Location Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Contacts</th>
            <th style={{ width: 44 }}></th>
          </tr>
        </thead>
        <tbody>
          {form.branches.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)' }}>
                No branches/locations found.
              </td>
            </tr>
          ) : form.branches.map(b => (
            <tr key={b.id}>
              <td>{b.branchName}</td>
              <td>{[b.address1, b.address2].filter(Boolean).join(', ')}</td>
              <td>{b.city}</td>
              <td>{STATES.find(s => s.id === Number(b.stateId))?.name ?? ''}</td>
              <td>{form.contacts.filter(c => c.branchId === b.id).length}</td>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  title="Remove branch/location"
                  onClick={() => setForm(p => ({
                    ...p,
                    branches: p.branches.filter(x => x.id !== b.id),
                    contacts: p.contacts.filter(c => c.branchId !== b.id),
                  }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)', lineHeight: 1, padding: '2px 6px' }}
                >×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ContactInfoSection({ form, setForm }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Branch/Location</th>
            <th style={{ width: 44 }}></th>
          </tr>
        </thead>
        <tbody>
          {form.contacts.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '28px 0', color: 'var(--text-3)' }}>
                No contacts found.
              </td>
            </tr>
          ) : form.contacts.map(c => (
            <tr key={c.id}>
              <td>{c.firstName}</td>
              <td>{c.lastName}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{form.branches.find(b => b.id === c.branchId)?.branchName ?? '—'}</td>
              <td style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  title="Remove contact"
                  onClick={() => setForm(p => ({ ...p, contacts: p.contacts.filter(x => x.id !== c.id) }))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--text-3)', lineHeight: 1, padding: '2px 6px' }}
                >×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
