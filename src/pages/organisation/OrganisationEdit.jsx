import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Field, Input, SectionBlock } from '../../components/Field'
import { useOrganisations } from './OrganisationContext'

export default function OrganisationEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { organisations, addOrganisation, updateOrganisation } = useOrganisations()

  const isCreate = !id
  const existing = isCreate ? null : organisations.find(o => o.id === Number(id))

  const [form, setForm] = useState(existing ?? { name: '', description: '', isActive: true })
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    if (isCreate) {
      addOrganisation(form)
    } else {
      updateOrganisation(Number(id), form)
    }
    navigate('/organisation')
  }

  if (!isCreate && !existing) return (
    <div className="empty-state">
      <div className="empty-state-icon">🔍</div>
      <div>Organisation not found</div>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/organisation')}>Back to list</button>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <span className="page-bar" />
          <div>
            <div className="page-title">{isCreate ? 'Add Organisation' : 'Edit Organisation'}</div>
            <div className="page-subtitle">{isCreate ? 'Create a new organisation' : `Editing: ${existing.name}`}</div>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/organisation')}>← Back</button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <SectionBlock icon="🏦" title="Organisation Info">
              <div className="form-grid-3">
                <Field label="Organisation Name" required>
                  <Input
                    placeholder="e.g. STATE BANK OF INDIA"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </Field>
                <Field label="Description">
                  <Input
                    placeholder="Short description"
                    value={form.description}
                    onChange={set('description')}
                  />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/organisation')}>Cancel</button>
              <button type="submit" className="btn btn-primary">
                {isCreate ? 'Create Organisation' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
