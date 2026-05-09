import { IC_LIST } from '../../data/icData'

const TYPE_COLOR = {
  Health: { color: '#2d7d46', bg: '#e6f4ea' },
  Motor:  { color: '#0a7ea4', bg: '#e0f4fb' },
  Life:   { color: '#7c3aed', bg: '#f5f3ff' },
}

function Stars({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span style={{ fontSize: 13, letterSpacing: 1 }}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

export default function InsurancePartners() {
  const healthICs = IC_LIST.filter(ic => ic.types.includes('Health'))
  const motorICs  = IC_LIST.filter(ic => ic.types.includes('Motor'))
  const lifeICs   = IC_LIST.filter(ic => ic.types.includes('Life'))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#7c3aed 0%,#4c1d95 100%)', borderRadius: 14, padding: '28px 32px', color: '#fff' }}>
        <div style={{ fontSize: 13, color: '#ddd6fe', marginBottom: 6, fontWeight: 500 }}>InsureRight — Verified Partners</div>
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Our Insurance Partners</div>
        <div style={{ fontSize: 13.5, color: '#ede9fe', maxWidth: 560 }}>
          We are an IRDAI-licensed composite broker working with India's leading insurance companies
          to offer you the best plans across Health, Motor, and Life.
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          {[
            { v: IC_LIST.length + '+',  l: 'Partner Insurers' },
            { v: '50,000+', l: 'Cashless Hospitals & Garages' },
            { v: '95%+',    l: 'Avg Claim Settlement' },
            { v: 'IRDAI',   l: 'Licensed Broker' },
          ].map(s => (
            <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '12px 18px', minWidth: 120 }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{s.v}</div>
              <div style={{ fontSize: 11.5, color: '#ddd6fe', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: '#fff', border: '1px solid #e8e4f0', borderRadius: 12, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: '#5c5573' }}>All our partner insurers are:</span>
        {['Regulated by IRDAI', 'Financially A-rated', 'Claim-settled within 30 days', 'Cashless network enabled'].map(t => (
          <span key={t} style={{ padding: '4px 12px', borderRadius: 99, background: '#f5f3ff', color: '#7c3aed', fontSize: 12, fontWeight: 600, border: '1px solid #c4b5fd' }}>
            ✓ {t}
          </span>
        ))}
      </div>

      {[
        { label: '🏥 Health Insurance Partners', ics: healthICs },
        { label: '🚗 Motor Insurance Partners',  ics: motorICs  },
        { label: '🛡️ Life Insurance Partners',   ics: lifeICs   },
      ].map(section => (
        <div key={section.label}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1628', marginBottom: 14 }}>{section.label}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
            {section.ics.map(ic => (
              <div key={ic.id} style={{
                background: '#fff',
                border: `1.5px solid ${ic.border}`,
                borderRadius: 14,
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}>
                {/* Card header */}
                <div style={{ background: ic.bg, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: `1px solid ${ic.border}` }}>
                  <div style={{ width: 50, height: 50, borderRadius: 12, background: '#fff', border: `1.5px solid ${ic.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    {ic.logo}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: '#1a1628', lineHeight: 1.2 }}>{ic.shortName}</div>
                    <div style={{ fontSize: 11.5, color: '#9d94b8', marginTop: 3 }}>{ic.tagline}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {ic.types.map(t => (
                      <span key={t} style={{ padding: '2px 9px', borderRadius: 99, fontSize: 10.5, fontWeight: 700, background: TYPE_COLOR[t].bg, color: TYPE_COLOR[t].color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: ic.networkHospitals > 0 ? '1fr 1fr 1fr' : '1fr 1fr', gap: 0 }}>
                  <div style={{ padding: '14px 16px', borderRight: `1px solid ${ic.border}` }}>
                    <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 4 }}>Claim Settlement</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: ic.color }}>{ic.claimRatio}%</div>
                    <div style={{ fontSize: 10.5, color: '#9d94b8', marginTop: 2 }}>FY 2023–24</div>
                  </div>
                  {ic.networkHospitals > 0 && (
                    <div style={{ padding: '14px 16px', borderRight: `1px solid ${ic.border}` }}>
                      <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 4 }}>Network Hospitals</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: ic.color }}>{ic.networkHospitals.toLocaleString()}+</div>
                      <div style={{ fontSize: 10.5, color: '#9d94b8', marginTop: 2 }}>Cashless</div>
                    </div>
                  )}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#9d94b8', marginBottom: 4 }}>Rating</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}><Stars rating={ic.rating} /></div>
                    <div style={{ fontSize: 10.5, color: '#9d94b8', marginTop: 2 }}>{ic.rating} / 5</div>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '10px 16px', background: '#faf9fc', borderTop: `1px solid ${ic.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#9d94b8' }}>Est. {ic.founded} · {ic.headquarters}</span>
                  <span style={{ fontSize: 11, color: '#9d94b8', fontFamily: 'monospace' }}>IRDAI Licensed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Disclaimer */}
      <div style={{ fontSize: 11.5, color: '#9d94b8', lineHeight: 1.7, padding: '12px 0', borderTop: '1px solid #e8e4f0' }}>
        * Claim settlement ratios sourced from IRDAI Annual Report 2023–24. Network figures are approximate and subject to change.
        InsureRight (K.M. Dastur & Co.) is an IRDAI-registered composite broker. Registration No.: CB-XXX/XXXXX/XXXX.
      </div>
    </div>
  )
}
