export const CAMPAIGNS = [
  { id: 1,  name: 'Campaign 1',                                startDate: '2024-09-20', endDate: '2025-07-29', isCampaignOpen: true,  isActive: true, assignedAgents: [1, 2, 5],    productIds: [3, 6, 7, 42, 43]    },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION', startDate: '2025-01-31', endDate: '2025-03-31', isCampaignOpen: false, isActive: true, assignedAgents: [1, 4],       productIds: [9, 10, 11, 12]      },
  { id: 6,  name: 'BPP Campaign',                              startDate: '2025-02-19', endDate: '2025-03-24', isCampaignOpen: true,  isActive: true, assignedAgents: [2, 8, 9],    productIds: [42, 43, 44, 45]     },
  { id: 7,  name: 'Test Campaign',                              startDate: '2025-08-03', endDate: '2025-08-29', isCampaignOpen: true,  isActive: true, assignedAgents: [1],          productIds: [3]                  },
  { id: 8,  name: 'SBI_STP_Campaign',                          startDate: '2025-09-18', endDate: '2026-03-10', isCampaignOpen: true,  isActive: true, assignedAgents: [4, 5],       productIds: [38, 39, 40]         },
  { id: 11, name: 'BPP Campaign_2026-2027',                    startDate: '2026-03-16', endDate: '2026-05-31', isCampaignOpen: true,  isActive: true, assignedAgents: [2, 8, 9],    productIds: [42, 43, 44, 45]     },
  { id: 12, name: 'Standalone campaign',                        startDate: '2026-02-28', endDate: '2026-04-29', isCampaignOpen: true,  isActive: true, assignedAgents: [1, 2],       productIds: [3, 6, 7]            },
]

const EMPTY_CALLS = Array.from({ length: 5 }, (_, i) => ({
  callNo: i + 1, time: '', response: '', comment: '',
}))

function filledCalls(entries) {
  return Array.from({ length: 5 }, (_, i) => ({
    callNo:   i + 1,
    time:     entries[i]?.time     ?? '',
    response: entries[i]?.response ?? '',
    comment:  entries[i]?.comment  ?? '',
  }))
}

const CALLS_INTERESTED = filledCalls([
  { time: '2025-04-11T10:30', response: 'Connected',       comment: 'Introduced the health plan. Customer listened and asked basic questions about coverage.' },
  { time: '2025-04-13T15:00', response: 'No Answer',       comment: 'Called twice, no response. Left a callback message.' },
  { time: '2025-04-14T11:15', response: 'Connected',       comment: 'Explained premium and sum insured slabs. Customer asked to share brochure on WhatsApp.' },
  { time: '2025-04-16T14:30', response: 'Call Back Later', comment: 'Customer was busy. Requested callback after 2 days.' },
  { time: '2025-04-18T10:00', response: 'Connected',       comment: 'Customer confirmed interest. Wants to discuss with family before final decision. Assigned to sales agent.' },
])

const CALLS_NOT_INTERESTED = filledCalls([
  { time: '2025-04-12T09:45', response: 'Connected', comment: 'Introduced the summer health campaign. Customer was brief and asked to call back later.' },
  { time: '2025-04-13T16:00', response: 'Connected', comment: 'Explained plan benefits. Customer mentioned they already have a policy with another insurer.' },
  { time: '2025-04-15T11:30', response: 'Busy',      comment: 'Line busy. Retried after 30 minutes — no answer.' },
  { time: '2025-04-16T10:00', response: 'Connected', comment: 'Customer confirmed not interested. Happy with existing coverage. Marked as Not Interested.' },
  { time: '',                 response: '',           comment: '' },
])

const CALLS_PURCHASED = filledCalls([
  { time: '2025-03-16T10:00', response: 'Connected', comment: 'First call — introduced Star Comprehensive Health. Customer very receptive, asked for plan details.' },
  { time: '2025-03-17T14:30', response: 'Connected', comment: 'Explained coverage — day care, restoration benefit, no room rent limit. Customer impressed.' },
  { time: '2025-03-18T11:00', response: 'Connected', comment: 'Customer confirmed sum insured preference of ₹10L. Agreed on annual premium. Nomination discussed.' },
  { time: '2025-03-20T09:30', response: 'Connected', comment: 'Assigned to sales agent Ravi Kulkarni for proposal and payment. Customer confirmed appointment.' },
  { time: '2025-03-22T16:00', response: 'Connected', comment: 'Policy issued successfully. Customer received policy document on email. Very satisfied.' },
])

// customerId links to the CUSTOMERS array in BuyPolicy.jsx
// claimedBy = calling agent id | null
// salesAssignedTo = sales agent id | null
export const INITIAL_LEADS = [
  { id:1,  campaignId:1,  customerId:1,    name:'Aarav Sharma',   mobile:'9876543210', enrollmentStatus:'Enrolled',  enrollmentDate:'10/04/2025', purchaseStatus:'Purchased',      purchaseDate:'18/04/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:2,  campaignId:1,  customerId:9,    name:'Priya Mehta',    mobile:'9812345678', enrollmentStatus:'Enrolled',  enrollmentDate:'11/04/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:3,  campaignId:1,  customerId:null, name:'Rohan Verma',    mobile:'9800112233', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:4,  campaignId:1,  customerId:null, name:'Sneha Iyer',     mobile:'9898989898', enrollmentStatus:'Enrolled',  enrollmentDate:'12/04/2025', purchaseStatus:'Not Interested', purchaseDate:'',           claimedBy:2,    salesAssignedTo:null, calls: CALLS_NOT_INTERESTED },
  { id:5,  campaignId:1,  customerId:null, name:'Karan Patel',    mobile:'9090909090', enrollmentStatus:'Enrolled',  enrollmentDate:'13/04/2025', purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:6,  campaignId:6,  customerId:3,    name:'Divya Nair',     mobile:'9911223344', enrollmentStatus:'Enrolled',  enrollmentDate:'01/03/2025', purchaseStatus:'Purchased',      purchaseDate:'08/03/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:7,  campaignId:6,  customerId:8,    name:'Arjun Singh',    mobile:'9922334455', enrollmentStatus:'Enrolled',  enrollmentDate:'02/03/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:8,  campaignId:6,  customerId:null, name:'Meera Joshi',    mobile:'9933445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:9,  campaignId:11, customerId:6,    name:'Vikram Rao',     mobile:'9944556677', enrollmentStatus:'Enrolled',  enrollmentDate:'18/03/2026', purchaseStatus:'Purchased',      purchaseDate:'25/03/2026', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:10, campaignId:11, customerId:null, name:'Anjali Desai',   mobile:'9955667788', enrollmentStatus:'Enrolled',  enrollmentDate:'20/03/2026', purchaseStatus:'Not Interested', purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:11, campaignId:11, customerId:10,   name:'Rahul Gupta',    mobile:'9966778899', enrollmentStatus:'Enrolled',  enrollmentDate:'22/03/2026', purchaseStatus:'Purchased',      purchaseDate:'28/03/2026', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:12, campaignId:11, customerId:null, name:'Pooja Reddy',    mobile:'9977889900', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:13, campaignId:8,  customerId:5,    name:'Suresh Kumar',   mobile:'9988001122', enrollmentStatus:'Enrolled',  enrollmentDate:'20/10/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:14, campaignId:8,  customerId:7,    name:'Kavita Pillai',  mobile:'9899112233', enrollmentStatus:'Enrolled',  enrollmentDate:'22/10/2025', purchaseStatus:'Purchased',      purchaseDate:'29/10/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:15, campaignId:8,  customerId:null, name:'Nikhil Bansal',  mobile:'9800223344', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
]
