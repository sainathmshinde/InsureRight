import { useNavigate, useParams } from 'react-router-dom'
import { useBrokerForm, INITIAL } from './useBrokerForm'
import BrokerForm from './BrokerForm'
import { BROKER_MAP } from './brokerData'
import { useAuth } from '../../context/AuthContext'

function userToInitial(u) {
  if (!u) return INITIAL
  return {
    ...INITIAL,
    brokerName: u.name || '',
    companyName: u.company || '',
    brokerType: u.type || 'Partnership',
    licenseNumber: u.irdaiNo || '',
    gstNumber: u.gst || '',
    panNumber: u.pan || '',
    email: u.email || '',
    mobile: u.phone || '',
    registeredAddress: u.address || '',
    communicationAddress: u.address || '',
    city: u.city || '',
    state: u.state || '',
    accountHolder: u.name || '',
    status: 'Active',
    kycStatus: 'Verified',
  }
}

export default function BrokerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isProfile = !id

  // For profile edit: pull the full broker record (documents, bank details, etc.)
  // then override contact fields with the live auth user data
  const profileBroker = isProfile
    ? (
        Object.values(BROKER_MAP).find(b => b.email === user?.email)
        ?? Object.values(BROKER_MAP).find(b => b.companyName === user?.company)
        ?? BROKER_MAP[1]
      )
    : null

  // Strip null/empty entries so they don't overwrite real doc URLs in profileBroker
  const userFields = isProfile
    ? Object.fromEntries(Object.entries(userToInitial(user)).filter(([, v]) => v !== null && v !== ''))
    : {}

  const existing = isProfile
    ? { ...profileBroker, ...userFields }
    : (BROKER_MAP[Number(id)] ?? INITIAL)

  const { form, set, setFile } = useBrokerForm(existing)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(isProfile ? 'Update profile:' : 'Update broker:', form)
    navigate(isProfile ? '/profile' : `/broker/${id}`)
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">{isProfile ? 'Edit My Profile' : 'Edit Broker'}</div>
            <div className="page-subtitle">{isProfile ? 'Update your firm and contact details' : 'Update broker information'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate(isProfile ? '/profile' : `/broker/${id}`)}>
            {isProfile ? '← Profile' : 'View'}
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(isProfile ? '/dashboard' : '/broker')}>← Back</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <BrokerForm
            form={form}
            set={set}
            setFile={setFile}
            onSubmit={handleSubmit}
            onCancel={() => navigate(isProfile ? '/profile' : `/broker/${id}`)}
            submitLabel={isProfile ? 'Save Profile' : 'Update Broker'}
          />
        </div>
      </div>
    </div>
  )
}
