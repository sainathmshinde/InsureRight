export const POLICY_TYPES = {
  1: 'Base Policy',
  2: 'Top Up Policy',
  3: 'OPD',
  4: 'Payment Protection',
  5: 'Age Band Premium',
  6: 'Super Top Up',
  999: 'Other',
}

export const POLICY_TYPE_COLOR = {
  'Base Policy':        'blue',
  'OPD':                'green',
  'Payment Protection': 'amber',
  'Age Band Premium':   'purple',
  'Super Top Up':       'red',
  'Top Up Policy':      'blue',
  'Other':              'gray',
}

export const POLICY_TYPE_ICON = {
  'Base Policy':        '🏥',
  'OPD':                '💊',
  'Payment Protection': '🛡️',
  'Age Band Premium':   '👨‍👩‍👧',
  'Super Top Up':       '⬆️',
  'Top Up Policy':      '📈',
  'Other':              '📋',
}

// Product catalogue — 2 Base Policies + 4 Top-Up/Super Top-Up policies.
const ALL_PRODUCTS = [
  {
    id: 3,
    name: 'Go Digit Super Top Up Policy',
    provider: 'Go Digit General Insurance Limited',
    policyTypeId: 6,
    disclaimer: null,
  },
  {
    id: 38,
    name: 'SBI Super Top Up Policy (₹3 Lakh Threshold)',
    provider: 'SBI General Insurance Company Limited',
    policyTypeId: 6,
    disclaimer: null,
  },
  {
    id: 42,
    name: 'SBI Base Policy',
    provider: 'SBI General Insurance Company Limited',
    policyTypeId: 1,
    disclaimer: null,
  },
  {
    id: 48,
    name: 'SBI Arogya Plus — Top Up Health Plan',
    provider: 'SBI General Insurance Company Limited',
    policyTypeId: 2,
    disclaimer: null,
    linkedBaseId: 42,
    bundleDiscount: { type: 'Percent', value: 15 },
  },
  {
    id: 60,
    name: 'HDFC Ergo Family Health Base Policy',
    provider: 'HDFC ERGO General Insurance Company Limited',
    policyTypeId: 1,
    disclaimer: null,
  },
  {
    id: 61,
    name: 'HDFC Ergo Super Top Up Policy',
    provider: 'HDFC ERGO General Insurance Company Limited',
    policyTypeId: 2,
    disclaimer: null,
    linkedBaseId: 60,
    bundleDiscount: { type: 'Flat', value: 500 },
  },
  {
    id: 70,
    name: 'Star Health Group Mediclaim Policy',
    provider: 'Star Health Insurance',
    policyTypeId: 5,
    disclaimer: 'I hereby declare, on my behalf and on behalf of my Family, that the above particulars given by me are true and complete in all respects to the best of my knowledge and that I am authorized to propose on behalf of my Family. I understand that the information provided by me will form the basis of the insurance policy, and that the policy will come into force only after full receipt of the premium chargeable and the application is in order. I agree to the terms and conditions of the Policy and have understood the same.',
  },
]

// Enrich each product with derived display fields
export const PRODUCTS = ALL_PRODUCTS.map(p => ({
  ...p,
  code: `KMD-${String(p.id).padStart(3, '0')}`,
  policyType: POLICY_TYPES[p.policyTypeId] ?? 'Other',
  status: 'Active',
}))

// Grouped by policyType name — used in BuyPolicy wizard
export const PRODUCTS_BY_TYPE = PRODUCTS.reduce((acc, p) => {
  const type = p.policyType
  if (!acc[type]) acc[type] = []
  acc[type].push(p)
  return acc
}, {})

// Base ↔ top-up bundle linkage for a product: the base it's linked to (if it's a
// top-up) and any top-ups that link to it (if it's a base), each carrying its own
// bundleDiscount off the base policy premium.
export function getProductLinks(productId) {
  const product = PRODUCTS.find(p => p.id === productId)
  const linkedBase = product?.linkedBaseId ? PRODUCTS.find(p => p.id === product.linkedBaseId) : null
  const topups = PRODUCTS.filter(p => p.linkedBaseId === productId)
  return { linkedBase, topups }
}

// Premium chart keyed by productId.
// Fields: sumInsured, selfOnly, selfSpouse, selfSpouse2Children (omitted when 0), ageBandId (omitted when 0).
export const PREMIUM_CHART = {
  3: [
    { sumInsured: 100000,  selfOnly: 2430,   selfSpouse: 4130 },
    { sumInsured: 200000,  selfOnly: 3887,   selfSpouse: 6610 },
    { sumInsured: 300000,  selfOnly: 5509,   selfSpouse: 9366 },
    { sumInsured: 400000,  selfOnly: 8097,   selfSpouse: 13765 },
    { sumInsured: 500000,  selfOnly: 10306,  selfSpouse: 17156 },
    { sumInsured: 600000,  selfOnly: 16052,  selfSpouse: 26301 },
    { sumInsured: 700000,  selfOnly: 22514,  selfSpouse: 37892 },
    { sumInsured: 800000,  selfOnly: 37312,  selfSpouse: 62505 },
    { sumInsured: 900000,  selfOnly: 53078,  selfSpouse: 91470 },
    { sumInsured: 1000000, selfOnly: 64092,  selfSpouse: 107569 },
  ],
  38: [
    { sumInsured: 100000, selfOnly: 3484,  selfSpouse: 5923 },
    { sumInsured: 200000, selfOnly: 5575,  selfSpouse: 9481 },
    { sumInsured: 300000, selfOnly: 7902,  selfSpouse: 13432 },
    { sumInsured: 400000, selfOnly: 11612, selfSpouse: 19741 },
    { sumInsured: 500000, selfOnly: 14780, selfSpouse: 24604 },
    { sumInsured: 600000, selfOnly: 23021, selfSpouse: 37719 },
    { sumInsured: 700000, selfOnly: 32289, selfSpouse: 54343 },
  ],
  42: [
    { sumInsured: 500000, selfOnly: 31053, selfSpouse: 41300 },
  ],
  48: [
    { sumInsured: 500000,  selfOnly: 4250,  selfSpouse: 6800  },
    { sumInsured: 1000000, selfOnly: 7500,  selfSpouse: 12000 },
    { sumInsured: 1500000, selfOnly: 10800, selfSpouse: 17300 },
    { sumInsured: 2000000, selfOnly: 14200, selfSpouse: 22700 },
  ],
  60: [
    { sumInsured: 300000,  selfOnly: 6200,  selfSpouse: 9800 },
    { sumInsured: 500000,  selfOnly: 9500,  selfSpouse: 15200 },
    { sumInsured: 700000,  selfOnly: 13200, selfSpouse: 21100 },
    { sumInsured: 1000000, selfOnly: 17600, selfSpouse: 28400 },
  ],
  61: [
    { sumInsured: 500000,  selfOnly: 4000,  selfSpouse: 6400  },
    { sumInsured: 1000000, selfOnly: 7100,  selfSpouse: 11300 },
    { sumInsured: 1500000, selfOnly: 10200, selfSpouse: 16300 },
    { sumInsured: 2000000, selfOnly: 13400, selfSpouse: 21500 },
  ],
  // Age-banded group premium — 11 age bands × 4 sum insured tiers.
  // ageBandId → age range: 1=0-20, 2=21-35, 3=36-45, 4=46-50, 5=51-55,
  // 6=56-60, 7=61-65, 8=66-70, 9=71-75, 10=76-80, 11=Above 80.
  // selfSpouse2Children also covers the "Self+Spouse+1 Child" combo — the
  // source rate card prices both the same.
  70: [
    { sumInsured: 300000,  ageBandId: 1,  selfOnly: 3353,  selfSpouse: 5700,   selfSpouse2Children: 9053   },
    { sumInsured: 300000,  ageBandId: 2,  selfOnly: 5550,  selfSpouse: 9435,   selfSpouse2Children: 12788  },
    { sumInsured: 300000,  ageBandId: 3,  selfOnly: 6948,  selfSpouse: 11812,  selfSpouse2Children: 15165  },
    { sumInsured: 300000,  ageBandId: 4,  selfOnly: 14357, selfSpouse: 24408,  selfSpouse2Children: 27761  },
    { sumInsured: 300000,  ageBandId: 5,  selfOnly: 17379, selfSpouse: 29545,  selfSpouse2Children: 32898  },
    { sumInsured: 300000,  ageBandId: 6,  selfOnly: 27777, selfSpouse: 47221,  selfSpouse2Children: 50574  },
    { sumInsured: 300000,  ageBandId: 7,  selfOnly: 39409, selfSpouse: 66995,  selfSpouse2Children: 70348  },
    { sumInsured: 300000,  ageBandId: 8,  selfOnly: 49392, selfSpouse: 83966,  selfSpouse2Children: 87319  },
    { sumInsured: 300000,  ageBandId: 9,  selfOnly: 56624, selfSpouse: 96260,  selfSpouse2Children: 99613  },
    { sumInsured: 300000,  ageBandId: 10, selfOnly: 60250, selfSpouse: 102424, selfSpouse2Children: 105777 },
    { sumInsured: 300000,  ageBandId: 11, selfOnly: 64257, selfSpouse: 109237, selfSpouse2Children: 112590 },
    { sumInsured: 500000,  ageBandId: 1,  selfOnly: 4632,  selfSpouse: 7874,   selfSpouse2Children: 12506  },
    { sumInsured: 500000,  ageBandId: 2,  selfOnly: 6793,  selfSpouse: 11548,  selfSpouse2Children: 16180  },
    { sumInsured: 500000,  ageBandId: 3,  selfOnly: 9513,  selfSpouse: 16172,  selfSpouse2Children: 20804  },
    { sumInsured: 500000,  ageBandId: 4,  selfOnly: 20295, selfSpouse: 34501,  selfSpouse2Children: 39133  },
    { sumInsured: 500000,  ageBandId: 5,  selfOnly: 24580, selfSpouse: 41786,  selfSpouse2Children: 46418  },
    { sumInsured: 500000,  ageBandId: 6,  selfOnly: 38362, selfSpouse: 65215,  selfSpouse2Children: 69847  },
    { sumInsured: 500000,  ageBandId: 7,  selfOnly: 50635, selfSpouse: 86080,  selfSpouse2Children: 90712  },
    { sumInsured: 500000,  ageBandId: 8,  selfOnly: 63254, selfSpouse: 107532, selfSpouse2Children: 112164 },
    { sumInsured: 500000,  ageBandId: 9,  selfOnly: 71264, selfSpouse: 121148, selfSpouse2Children: 125780 },
    { sumInsured: 500000,  ageBandId: 10, selfOnly: 75635, selfSpouse: 128579, selfSpouse2Children: 133211 },
    { sumInsured: 500000,  ageBandId: 11, selfOnly: 80849, selfSpouse: 137443, selfSpouse2Children: 142075 },
    { sumInsured: 700000,  ageBandId: 1,  selfOnly: 5809,   selfSpouse: 9875,   selfSpouse2Children: 15684  },
    { sumInsured: 700000,  ageBandId: 2,  selfOnly: 8742,   selfSpouse: 14861,  selfSpouse2Children: 20670  },
    { sumInsured: 700000,  ageBandId: 3,  selfOnly: 12741,  selfSpouse: 21660,  selfSpouse2Children: 27469  },
    { sumInsured: 700000,  ageBandId: 4,  selfOnly: 30374,  selfSpouse: 51635,  selfSpouse2Children: 57444  },
    { sumInsured: 700000,  ageBandId: 5,  selfOnly: 36221,  selfSpouse: 61576,  selfSpouse2Children: 67385  },
    { sumInsured: 700000,  ageBandId: 6,  selfOnly: 54275,  selfSpouse: 92268,  selfSpouse2Children: 98077  },
    { sumInsured: 700000,  ageBandId: 7,  selfOnly: 70907,  selfSpouse: 120543, selfSpouse2Children: 126352 },
    { sumInsured: 700000,  ageBandId: 8,  selfOnly: 90938,  selfSpouse: 154594, selfSpouse2Children: 160403 },
    { sumInsured: 700000,  ageBandId: 9,  selfOnly: 101583, selfSpouse: 172691, selfSpouse2Children: 178500 },
    { sumInsured: 700000,  ageBandId: 10, selfOnly: 106450, selfSpouse: 180965, selfSpouse2Children: 186774 },
    { sumInsured: 700000,  ageBandId: 11, selfOnly: 114407, selfSpouse: 194492, selfSpouse2Children: 200301 },
    { sumInsured: 1000000, ageBandId: 1,  selfOnly: 7148,   selfSpouse: 12152,  selfSpouse2Children: 19300  },
    { sumInsured: 1000000, ageBandId: 2,  selfOnly: 10848,  selfSpouse: 18442,  selfSpouse2Children: 25590  },
    { sumInsured: 1000000, ageBandId: 3,  selfOnly: 16790,  selfSpouse: 28543,  selfSpouse2Children: 35691  },
    { sumInsured: 1000000, ageBandId: 4,  selfOnly: 40347,  selfSpouse: 68590,  selfSpouse2Children: 75738  },
    { sumInsured: 1000000, ageBandId: 5,  selfOnly: 47895,  selfSpouse: 81421,  selfSpouse2Children: 88569  },
    { sumInsured: 1000000, ageBandId: 6,  selfOnly: 69068,  selfSpouse: 117415, selfSpouse2Children: 124563 },
    { sumInsured: 1000000, ageBandId: 7,  selfOnly: 88134,  selfSpouse: 149827, selfSpouse2Children: 156975 },
    { sumInsured: 1000000, ageBandId: 8,  selfOnly: 111903, selfSpouse: 190234, selfSpouse2Children: 197382 },
    { sumInsured: 1000000, ageBandId: 9,  selfOnly: 123264, selfSpouse: 209548, selfSpouse2Children: 216696 },
    { sumInsured: 1000000, ageBandId: 10, selfOnly: 128682, selfSpouse: 218759, selfSpouse2Children: 225907 },
    { sumInsured: 1000000, ageBandId: 11, selfOnly: 137438, selfSpouse: 233645, selfSpouse2Children: 240793 },
  ],
}

// Human-readable "From – To" labels for a product's age bands, keyed by
// productId then ageBandId — PREMIUM_CHART only stores the opaque band id,
// so this is what lets Edit Product show the actual age range instead of a
// blank "Band N" placeholder.
export const AGE_BAND_LABELS = {
  70: {
    1:  { from: '0',  to: '20' },
    2:  { from: '21', to: '35' },
    3:  { from: '36', to: '45' },
    4:  { from: '46', to: '50' },
    5:  { from: '51', to: '55' },
    6:  { from: '56', to: '60' },
    7:  { from: '61', to: '65' },
    8:  { from: '66', to: '70' },
    9:  { from: '71', to: '75' },
    10: { from: '76', to: '80' },
    11: { from: '81', to: '' }, // "Above 80" — open-ended
  },
}

// Rich brochure content keyed by productId — shown in "View Details" modal.
export const PRODUCT_DETAILS = {
  3: {
    tagline: 'Extra Coverage When Your Base Policy Runs Out',
    eligibilityCriteria: 'Available to individuals aged 18–65 years who hold an existing base health insurance policy or corporate group cover. Dependent children can be added between 91 days and 25 years.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months. Specific illnesses such as cataract and hernia covered after 12 months.',
    copayment: 'No mandatory copayment for members below 60 years. 10% copay applies for members aged 60 years and above.',
    maternityBenefits: 'Maternity expenses are not covered under this Super Top Up policy.',
    description: 'Go Digit\'s Super Top Up Policy kicks in once you\'ve exhausted your base health plan, giving you ₹1L–₹10L of additional hospitalisation coverage. It\'s the most cost-effective way to achieve high total cover — works alongside any existing corporate or individual health plan.',
    target: ['Employees with corporate health insurance', 'Individuals with an existing base health plan', 'Families wanting ₹10L+ total coverage affordably'],
    benefits: [
      'Activates after deductible/base plan exhaustion',
      'In-patient hospitalisation fully covered',
      'Pre-hospitalisation (30 days) & post-hospitalisation (60 days)',
      'Day care procedures — 540+ treatments listed',
      'Ambulance charges covered',
      'Covers self and spouse',
    ],
    covered: ['In-patient hospitalisation (above threshold)', 'Surgical & procedure charges', 'ICU and critical care charges', 'Pre-hospitalisation (30 days)', 'Post-hospitalisation (60 days)', 'Day care treatments', 'Ambulance expenses'],
    notCovered: ['Expenses below deductible/threshold', 'Pre-existing diseases (first 2 years)', 'Cosmetic & plastic surgery', 'OPD consultations', 'Dental (unless accidental)', 'Self-inflicted injuries'],
    highlights: [
      { label: 'Sum Insured', value: '₹1L – ₹10L', icon: '🛡️' },
      { label: 'Premium From', value: '₹2,430/yr', icon: '💰' },
      { label: 'Coverage', value: 'Self + Spouse', icon: '👥' },
      { label: 'Insurer', value: 'Go Digit', icon: '🏢' },
    ],
  },
  38: {
    tagline: 'SBI Super Top Up — Enhanced Cover from ₹3L Threshold',
    eligibilityCriteria: 'Available to policyholders aged 18–65 years holding an existing base health policy with a ₹3L sum insured.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months.',
    copayment: 'No copayment for members below 60 years. 10% copay for members aged 60 years and above.',
    maternityBenefits: 'Maternity expenses are not covered under this Super Top Up policy.',
    description: 'SBI General\'s Super Top Up Policy (₹3L threshold) covers all hospitalisation expenses beyond your ₹3L base plan. The most accessible entry point into SBI\'s Super Top Up range — ideal for those with a ₹3L group or individual base cover.',
    target: ['Policyholders with ₹3L base health cover', 'Individuals wanting to extend to ₹10L total', 'Budget-conscious families seeking high cover'],
    benefits: [
      'Covers hospitalisation expenses above ₹3L deductible',
      'Sum insured options: ₹1L – ₹7L additional',
      'Self and spouse coverage',
      'All standard hospitalisation expenses',
      'Day care procedures covered',
      'Pre (60 days) & post (90 days) hospitalisation',
      'SBI\'s wide cashless hospital network',
    ],
    covered: ['Hospitalisation beyond ₹3L threshold', 'ICU and surgical charges', 'Day care procedures', 'Pre-hospitalisation (60 days)', 'Post-hospitalisation (90 days)', 'Ambulance charges'],
    notCovered: ['Expenses within ₹3L deductible', 'OPD consultations', 'Pre-existing diseases (2 years)', 'Cosmetic surgery', 'Dental unless accident', 'Self-inflicted injuries'],
    highlights: [
      { label: 'Threshold', value: '₹3 Lakh', icon: '🎯' },
      { label: 'Add-on Cover', value: '₹1L – ₹7L', icon: '🛡️' },
      { label: 'Premium From', value: '₹3,484/yr', icon: '💰' },
      { label: 'Insurer', value: 'SBI General', icon: '🏢' },
    ],
  },
  42: {
    tagline: 'SBI Base Policy — A Trusted Foundation for Your Health',
    eligibilityCriteria: 'Available to individuals and family members aged 18–65 years. Dependent children can be covered from 91 days to 25 years. Lifetime renewability guaranteed.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months. Specific illnesses such as cataract, hernia and joint replacement covered after 12 months.',
    copayment: 'No copayment for members below 60 years. 10% copay applies for members aged 60 years and above.',
    maternityBenefits: 'Not covered as standard — can be added as an optional rider covering normal and caesarean delivery after a 9-month waiting period.',
    description: 'SBI General\'s Base Health Policy offers solid ₹5 lakh hospitalisation coverage backed by one of India\'s largest public sector banks. With access to 6,000+ cashless hospitals, an annual health check-up benefit, and no-claim bonus, it\'s the right foundation to build your health cover on.',
    target: ['Individuals and families aged 18 – 65', 'First-time health insurance buyers', 'Those wanting PSU-backed insurance reliability'],
    benefits: [
      '₹5 lakh sum insured',
      'Cashless access at 6,000+ SBI network hospitals',
      'Annual health check-up included',
      'No-claim bonus: 25% per year, up to 50%',
      'Day care procedures covered',
      'Domiciliary hospitalisation covered',
      'AYUSH treatments included',
    ],
    covered: ['In-patient hospitalisation', 'Day care procedures (listed)', 'Pre-hospitalisation (60 days)', 'Post-hospitalisation (90 days)', 'Ambulance charges', 'Domiciliary hospitalisation', 'AYUSH treatment'],
    notCovered: ['Pre-existing diseases (2 years)', 'Cosmetic surgery', 'Dental unless accidental', 'Maternity (unless added as rider)', 'Obesity treatment', 'Self-inflicted injuries'],
    highlights: [
      { label: 'Sum Insured', value: '₹5 Lakh', icon: '🛡️' },
      { label: 'Premium From', value: '₹31,053/yr', icon: '💰' },
      { label: 'Coverage', value: 'Self / Couple', icon: '👥' },
      { label: 'Insurer', value: 'SBI General', icon: '🏢' },
    ],
  },
  48: {
    tagline: 'Smart Top-Up — Pairs with SBI Base Policy',
    eligibilityCriteria: 'Available to existing SBI Base Policy (KMD-042) holders aged 18–65 years. Spouse and up to 2 children can be included.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months.',
    copayment: 'No copayment for members below 60 years. 10% copay for members aged 60 years and above.',
    maternityBenefits: 'Maternity expenses are not covered under this top-up policy.',
    description: 'SBI Arogya Plus is a dedicated Top Up Health Plan engineered to pair with the SBI Base Policy (KMD-042). Once your base plan limit is exhausted, it kicks in seamlessly — adding ₹5L to ₹20L of hospitalisation coverage at a fraction of the standalone cost.',
    target: [
      'SBI Base Policy holders wanting higher total coverage',
      'Members seeking ₹10L – ₹25L combined hospitalisation cover',
      'Families wanting maximum protection at minimal extra cost',
      'First-time top-up buyers who already hold an SBI base plan',
    ],
    benefits: [
      'Activates only after SBI Base Policy (KMD-042) is exhausted',
      'Sum insured options: ₹5L, ₹10L, ₹15L and ₹20L',
      'Covers self, spouse, and up to 2 children',
      'In-patient and day care hospitalisation covered',
      'Pre-hospitalisation (60 days) & post-hospitalisation (90 days)',
      'Cashless access at 6,000+ SBI network hospitals',
      'Annual renewal with continuity benefit bonus',
    ],
    covered: [
      'Hospitalisation beyond SBI Base Policy limit',
      'ICU and critical care charges',
      'Surgical and procedure expenses',
      'Day care treatments (540+ listed)',
      'Pre-hospitalisation (60 days)',
      'Post-hospitalisation (90 days)',
      'Ambulance charges',
    ],
    notCovered: [
      'Expenses below the base policy deductible',
      'OPD consultations',
      'Pre-existing diseases (first year)',
      'Cosmetic or plastic surgery',
      'Dental treatment (unless accidental)',
      'Self-inflicted injuries or war events',
    ],
    highlights: [
      { label: 'Sum Insured',    value: '₹5L – ₹20L', icon: '🛡️' },
      { label: 'Premium From',   value: '₹4,250/yr',   icon: '💰' },
      { label: 'Pairs With',     value: 'KMD-042',      icon: '🔗' },
    ],
  },
  60: {
    tagline: 'HDFC ERGO Family Health — Comprehensive Cover, Trusted Name',
    eligibilityCriteria: 'Available to individuals and family members aged 18–65 years. Dependent children can be covered from 91 days to 25 years. Lifetime renewability guaranteed.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months. Specific illnesses such as cataract, hernia and joint replacement covered after 12 months.',
    copayment: 'No copayment for members below 60 years. 10% copay applies for members aged 60 years and above.',
    maternityBenefits: 'Not covered as standard — can be added as an optional rider covering normal and caesarean delivery after a 9-month waiting period.',
    description: 'HDFC ERGO\'s Family Health Base Policy delivers well-rounded hospitalisation coverage from ₹3L to ₹10L, backed by a wide cashless hospital network and a fast, digital-first claims experience — a strong foundation for individual or family health protection.',
    target: ['Individuals and families aged 18 – 65', 'First-time health insurance buyers', 'Those wanting a private-insurer digital claims experience'],
    benefits: [
      '₹3L – ₹10L sum insured options',
      'Cashless access at 13,000+ network hospitals',
      'Annual health check-up included',
      'No-claim bonus: 20% per year, up to 50%',
      'Day care procedures covered',
      'AYUSH treatments included',
    ],
    covered: ['In-patient hospitalisation', 'Day care procedures (listed)', 'Pre-hospitalisation (60 days)', 'Post-hospitalisation (90 days)', 'Ambulance charges', 'AYUSH treatment'],
    notCovered: ['Pre-existing diseases (2 years)', 'Cosmetic surgery', 'Dental unless accidental', 'Maternity (unless added as rider)', 'Obesity treatment', 'Self-inflicted injuries'],
    highlights: [
      { label: 'Sum Insured', value: '₹3L – ₹10L', icon: '🛡️' },
      { label: 'Premium From', value: '₹6,200/yr', icon: '💰' },
      { label: 'Coverage', value: 'Self / Couple', icon: '👥' },
      { label: 'Insurer', value: 'HDFC ERGO', icon: '🏢' },
    ],
  },
  61: {
    tagline: 'Smart Top-Up — Pairs with HDFC Ergo Family Health Base Policy',
    eligibilityCriteria: 'Available to existing HDFC Ergo Family Health Base Policy (KMD-060) holders aged 18–65 years. Spouse and up to 2 children can be included.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 24 months.',
    copayment: 'No copayment for members below 60 years. 10% copay for members aged 60 years and above.',
    maternityBenefits: 'Maternity expenses are not covered under this top-up policy.',
    description: 'HDFC Ergo Super Top Up is designed to pair with the HDFC Ergo Family Health Base Policy (KMD-060). Once your base plan limit is exhausted, it activates seamlessly — adding ₹5L to ₹20L of hospitalisation coverage at a fraction of the standalone cost.',
    target: [
      'HDFC Ergo Base Policy holders wanting higher total coverage',
      'Members seeking ₹8L – ₹30L combined hospitalisation cover',
      'Families wanting maximum protection at minimal extra cost',
      'First-time top-up buyers who already hold an HDFC Ergo base plan',
    ],
    benefits: [
      'Activates only after HDFC Ergo Base Policy (KMD-060) is exhausted',
      'Sum insured options: ₹5L, ₹10L, ₹15L and ₹20L',
      'Covers self, spouse, and up to 2 children',
      'In-patient and day care hospitalisation covered',
      'Pre-hospitalisation (60 days) & post-hospitalisation (90 days)',
      'Cashless access at 13,000+ network hospitals',
      'Annual renewal with continuity benefit bonus',
    ],
    covered: [
      'Hospitalisation beyond HDFC Ergo Base Policy limit',
      'ICU and critical care charges',
      'Surgical and procedure expenses',
      'Day care treatments (listed)',
      'Pre-hospitalisation (60 days)',
      'Post-hospitalisation (90 days)',
      'Ambulance charges',
    ],
    notCovered: [
      'Expenses below the base policy deductible',
      'OPD consultations',
      'Pre-existing diseases (first year)',
      'Cosmetic or plastic surgery',
      'Dental treatment (unless accidental)',
      'Self-inflicted injuries or war events',
    ],
    highlights: [
      { label: 'Sum Insured',    value: '₹5L – ₹20L', icon: '🛡️' },
      { label: 'Premium From',   value: '₹4,000/yr',   icon: '💰' },
      { label: 'Pairs With',     value: 'KMD-060',      icon: '🔗' },
    ],
  },
  70: {
    tagline: 'Group Mediclaim for Bank Retiree Associations — Priced Fairly by Age',
    eligibilityCriteria: 'Available to members of enrolled bank retiree associations of all ages (0 to 80+ years), along with spouse and up to 2 dependent children. Premium is banded across 11 age groups so younger members are not overcharged for the cover older members need.',
    waitingPeriods: 'Initial waiting period of 30 days (waived for accidents). Pre-existing diseases covered after 12 months under group continuity. Specific illnesses such as cataract, hernia and joint replacement covered after 90 days.',
    copayment: 'No copayment for members below age band 6 (60 years). 10% copay applies for members in age band 6 and above, capped at ₹15,000 per claim.',
    maternityBenefits: 'Available as an optional rider for members in age bands 1–3 (up to 45 years) — normal delivery covered up to ₹25,000 and caesarean up to ₹35,000, after a 9-month waiting period.',
    description: 'Star Health\'s Group Mediclaim Policy is purpose-built for bank retiree associations, spreading cost fairly across 11 age bands (0–20 through Above 80) instead of one flat premium for everyone. Younger, healthier members pay less; older members still get full access to the same ₹3L–₹10L sum insured options and cashless network — the same model used by BPP-style association covers, now age-aware.',
    target: [
      'Bank retiree association members across all age groups',
      'Associations wanting fair, age-appropriate group pricing',
      'Members aged 66+ who are priced out of flat-premium group covers',
      'Families wanting to enrol together under one association policy',
    ],
    benefits: [
      '11 age bands (0–20 through Above 80) for fair, age-appropriate pricing',
      'Sum insured options: ₹3L, ₹5L, ₹7L and ₹10L',
      'Covers self, spouse and up to 2 children under one policy',
      'In-patient hospitalisation and 540+ day care procedures covered',
      'Pre-hospitalisation (30 days) & post-hospitalisation (60 days)',
      'Cashless access at 14,000+ Star Health network hospitals',
      'No upper age limit for renewal — lifetime association continuity',
    ],
    covered: [
      'In-patient hospitalisation across all age bands',
      'ICU and critical care charges',
      'Day care treatments (540+ listed)',
      'Pre-hospitalisation (30 days)',
      'Post-hospitalisation (60 days)',
      'Ambulance charges',
      'AYUSH treatments',
    ],
    notCovered: [
      'Pre-existing diseases (first year)',
      'Cosmetic or plastic surgery',
      'Dental treatment (unless accidental)',
      'Maternity (unless added as rider, age bands 1–3 only)',
      'Self-inflicted injuries or war events',
      'Experimental or unproven treatments',
    ],
    highlights: [
      { label: 'Sum Insured',  value: '₹3L – ₹10L',  icon: '🛡️' },
      { label: 'Premium From', value: '₹3,353/yr',   icon: '💰' },
      { label: 'Age Bands',    value: '11 bands',     icon: '📊' },
      { label: 'Insurer',      value: 'Star Health',  icon: '🏢' },
    ],
  },
}
