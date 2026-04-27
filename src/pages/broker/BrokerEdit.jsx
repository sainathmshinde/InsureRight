import { useNavigate, useParams } from 'react-router-dom'
import { useBrokerForm, INITIAL } from './useBrokerForm'
import BrokerForm from './BrokerForm'

// Simulated fetch by ID — replace with real API call
const MOCK_DATA = {
  1: { ...INITIAL, brokerName: 'Rahul Mehta', companyName: 'Mehta Insurance', brokerType: 'Individual', licenseNumber: 'IRDAI-2023-001', email: 'rahul@mehtains.com', mobile: '+91 98765 43210', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', kycStatus: 'Verified', status: 'Active' },
}

export default function BrokerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existing = MOCK_DATA[id] ?? INITIAL
  const { form, set, setFile } = useBrokerForm(existing)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: PUT /api/brokers/:id
    console.log('Update broker:', id, form)
    navigate('/broker')
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon">✏️</div>
          <div>
            <div className="page-title">Edit Broker</div>
            <div className="page-subtitle">Update broker information</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate(`/broker/${id}`)}>View</button>
          <button className="btn btn-ghost" onClick={() => navigate('/broker')}>← Back</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <BrokerForm
            form={form}
            set={set}
            setFile={setFile}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/broker/${id}`)}
            submitLabel="Update Broker"
          />
        </div>
      </div>
    </div>
  )
}
