import { isCampaignOpen } from '../../utils/date'

const RAW_CAMPAIGNS = [
  { id: 1,  name: 'Campaign 1',                    startDate: '2024-09-20', endDate: '2025-07-29', isActive: true, assignedAgents: [1, 2, 5],    productIds: [42, 48]         },
  { id: 5,  name: 'Campaign OPD and DIGIT PAYMENT PROTECTION', startDate: '2025-01-31', endDate: '2025-03-31', isActive: true, assignedAgents: [1, 2, 4], productIds: [60, 61] },
  { id: 6,  name: 'BPP Campaign',                   startDate: '2025-02-19', endDate: '2025-03-24', isActive: true, assignedAgents: [2, 8, 9],    productIds: [60, 61]         },
  { id: 7,  name: 'Test Campaign',                  startDate: '2025-08-03', endDate: '2025-08-29', isActive: true, assignedAgents: [1],          productIds: [3]              },
  { id: 8,  name: 'SBI_STP_Campaign',                startDate: '2025-09-18', endDate: '2026-03-10', isActive: true, assignedAgents: [4, 5],       productIds: [42, 38]         },
  { id: 11, name: 'BPP Campaign_2026-2027',         startDate: '2026-03-16', endDate: '2026-05-31', isActive: true, assignedAgents: [2, 8, 9],    productIds: [42, 38, 48]     },
  { id: 12, name: 'Standalone campaign',            startDate: '2026-02-28', endDate: '2026-04-29', isActive: true, assignedAgents: [1, 2],       productIds: [38]             },
]

// isCampaignOpen is derived from the Period (startDate → endDate) rather than
// hardcoded, so it never drifts out of sync with the actual campaign dates.
export const CAMPAIGNS = RAW_CAMPAIGNS.map(c => ({ ...c, isCampaignOpen: isCampaignOpen(c.endDate) }))

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
  { time: '2025-04-11T10:30', response: 'Connected',       comment: 'Introduced the health plan. Member listened and asked basic questions about coverage.' },
  { time: '2025-04-13T15:00', response: 'No Answer',       comment: 'Called twice, no response. Left a callback message.' },
  { time: '2025-04-14T11:15', response: 'Connected',       comment: 'Explained premium and sum insured slabs. Member asked to share brochure on WhatsApp.' },
  { time: '2025-04-16T14:30', response: 'Call Back Later', comment: 'Member was busy. Requested callback after 2 days.' },
  { time: '2025-04-18T10:00', response: 'Connected',       comment: 'Member confirmed interest. Wants to discuss with family before final decision. Assigned to sales agent.' },
])

const CALLS_NOT_INTERESTED = filledCalls([
  { time: '2025-04-12T09:45', response: 'Connected', comment: 'Introduced the summer health campaign. Member was brief and asked to call back later.' },
  { time: '2025-04-13T16:00', response: 'Connected', comment: 'Explained plan benefits. Member mentioned they already have a policy with another insurer.' },
  { time: '2025-04-15T11:30', response: 'Busy',      comment: 'Line busy. Retried after 30 minutes — no answer.' },
  { time: '2025-04-16T10:00', response: 'Connected', comment: 'Member confirmed not interested. Happy with existing coverage. Marked as Not Interested.' },
  { time: '',                 response: '',           comment: '' },
])

const CALLS_PURCHASED = filledCalls([
  { time: '2025-03-16T10:00', response: 'Connected', comment: 'First call — introduced Star Comprehensive Health. Member very receptive, asked for plan details.' },
  { time: '2025-03-17T14:30', response: 'Connected', comment: 'Explained coverage — day care, restoration benefit, no room rent limit. Member impressed.' },
  { time: '2025-03-18T11:00', response: 'Connected', comment: 'Member confirmed sum insured preference of ₹10L. Agreed on annual premium. Nomination discussed.' },
  { time: '2025-03-20T09:30', response: 'Connected', comment: 'Assigned to sales agent Ravi Kulkarni for proposal and payment. Member confirmed appointment.' },
  { time: '2025-03-22T16:00', response: 'Connected', comment: 'Policy issued successfully. Member received policy document on email. Very satisfied.' },
])

// memberId links to the MEMBERS array in BuyPolicy.jsx
// claimedBy = calling agent id | null
// salesAssignedTo = sales agent id | null
export const INITIAL_LEADS = [
  { id:1,  campaignId:1,  memberId:1,    name:'Aarav Sharma',   mobile:'9876543210', enrollmentStatus:'Enrolled',  enrollmentDate:'10/04/2025', purchaseStatus:'Purchased',      purchaseDate:'18/04/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:2,  campaignId:1,  memberId:9,    name:'Priya Mehta',    mobile:'9812345678', enrollmentStatus:'Enrolled',  enrollmentDate:'11/04/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:3,  campaignId:1,  memberId:null, name:'Rohan Verma',    mobile:'9800112233', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:4,  campaignId:1,  memberId:null, name:'Sneha Iyer',     mobile:'9898989898', enrollmentStatus:'Enrolled',  enrollmentDate:'12/04/2025', purchaseStatus:'Not Interested', purchaseDate:'',           claimedBy:2,    salesAssignedTo:null, calls: CALLS_NOT_INTERESTED },
  { id:5,  campaignId:1,  memberId:null, name:'Karan Patel',    mobile:'9090909090', enrollmentStatus:'Enrolled',  enrollmentDate:'13/04/2025', purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:6,  campaignId:6,  memberId:3,    name:'Divya Nair',     mobile:'9911223344', enrollmentStatus:'Enrolled',  enrollmentDate:'01/03/2025', purchaseStatus:'Purchased',      purchaseDate:'08/03/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:7,  campaignId:6,  memberId:8,    name:'Arjun Singh',    mobile:'9922334455', enrollmentStatus:'Enrolled',  enrollmentDate:'02/03/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:8,  campaignId:6,  memberId:null, name:'Meera Joshi',    mobile:'9933445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:9,  campaignId:11, memberId:6,    name:'Vikram Rao',     mobile:'9944556677', enrollmentStatus:'Enrolled',  enrollmentDate:'18/03/2026', purchaseStatus:'Purchased',      purchaseDate:'25/03/2026', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:10, campaignId:11, memberId:null, name:'Anjali Desai',   mobile:'9955667788', enrollmentStatus:'Enrolled',  enrollmentDate:'20/03/2026', purchaseStatus:'Not Interested', purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:11, campaignId:11, memberId:10,   name:'Rahul Gupta',    mobile:'9966778899', enrollmentStatus:'Enrolled',  enrollmentDate:'22/03/2026', purchaseStatus:'Purchased',      purchaseDate:'28/03/2026', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:12, campaignId:11, memberId:null, name:'Pooja Reddy',    mobile:'9977889900', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:16, campaignId:5,  memberId:null, name:'Amit Shah',       mobile:'9811223344', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:2,    salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:17, campaignId:5,  memberId:null, name:'Rekha Patil',     mobile:'9822334455', enrollmentStatus:'Enrolled',  enrollmentDate:'05/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:null, calls: CALLS_INTERESTED },
  { id:18, campaignId:5,  memberId:null, name:'Deepak Mehta',    mobile:'9833445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:19, campaignId:5,  memberId:null, name:'Sunita Jain',     mobile:'9844556677', enrollmentStatus:'Enrolled',  enrollmentDate:'10/02/2025', purchaseStatus:'Not Interested', purchaseDate:'',           claimedBy:2,    salesAssignedTo:null, calls: CALLS_NOT_INTERESTED },
  { id:20, campaignId:5,  memberId:null, name:'Manoj Tiwari',    mobile:'9855667788', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:21, campaignId:5,  memberId:null, name:'Geeta Sharma',    mobile:'9866778899', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:22, campaignId:5,  memberId:null, name:'Rajesh Bose',     mobile:'9877889900', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:23, campaignId:5,  memberId:null, name:'Nisha Kulkarni',  mobile:'9888990011', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:24, campaignId:5,  memberId:null, name:'Farhan Shaikh',   mobile:'9800334455', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:25, campaignId:5,  memberId:null, name:'Lalitha Reddy',   mobile:'9811445566', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:26, campaignId:5,  memberId:null, name:'Vivek Pandey',    mobile:'9822556677', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:27, campaignId:5,  memberId:null, name:'Harish Malhotra', mobile:'9833001122', enrollmentStatus:'Enrolled',  enrollmentDate:'02/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:28, campaignId:5,  memberId:null, name:'Sonal Kapoor',    mobile:'9844112233', enrollmentStatus:'Enrolled',  enrollmentDate:'03/02/2025', purchaseStatus:'Purchased',      purchaseDate:'14/02/2025', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:29, campaignId:5,  memberId:null, name:'Prakash Rao',     mobile:'9855223344', enrollmentStatus:'Enrolled',  enrollmentDate:'04/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:30, campaignId:5,  memberId:null, name:'Anita Verma',     mobile:'9866334455', enrollmentStatus:'Enrolled',  enrollmentDate:'05/02/2025', purchaseStatus:'Purchased',      purchaseDate:'16/02/2025', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:31, campaignId:5,  memberId:null, name:'Sunil Bhatia',    mobile:'9877445566', enrollmentStatus:'Enrolled',  enrollmentDate:'06/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:32, campaignId:5,  memberId:null, name:'Kavya Menon',     mobile:'9888556677', enrollmentStatus:'Enrolled',  enrollmentDate:'07/02/2025', purchaseStatus:'Purchased',      purchaseDate:'18/02/2025', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:33, campaignId:5,  memberId:null, name:'Dinesh Shetty',   mobile:'9899667788', enrollmentStatus:'Enrolled',  enrollmentDate:'08/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:34, campaignId:5,  memberId:null, name:'Poornima Das',    mobile:'9800778899', enrollmentStatus:'Enrolled',  enrollmentDate:'09/02/2025', purchaseStatus:'Purchased',      purchaseDate:'20/02/2025', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:35, campaignId:5,  memberId:null, name:'Arjun Pillai',    mobile:'9811889900', enrollmentStatus:'Enrolled',  enrollmentDate:'10/02/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:2,    salesAssignedTo:1,    calls: CALLS_INTERESTED },
  { id:36, campaignId:5,  memberId:null, name:'Meena Saxena',    mobile:'9822990011', enrollmentStatus:'Enrolled',  enrollmentDate:'11/02/2025', purchaseStatus:'Purchased',      purchaseDate:'22/02/2025', claimedBy:2,    salesAssignedTo:1,    calls: CALLS_PURCHASED },
  { id:13, campaignId:8,  memberId:5,    name:'Suresh Kumar',   mobile:'9988001122', enrollmentStatus:'Enrolled',  enrollmentDate:'20/10/2025', purchaseStatus:'Interested',     purchaseDate:'',           claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:14, campaignId:8,  memberId:7,    name:'Kavita Pillai',  mobile:'9899112233', enrollmentStatus:'Enrolled',  enrollmentDate:'22/10/2025', purchaseStatus:'Purchased',      purchaseDate:'29/10/2025', claimedBy:null, salesAssignedTo:1,    calls: EMPTY_CALLS.map(c=>({...c})) },
  { id:15, campaignId:8,  memberId:null, name:'Nikhil Bansal',  mobile:'9800223344', enrollmentStatus:'Pending',   enrollmentDate:'',           purchaseStatus:'Pending',        purchaseDate:'',           claimedBy:null, salesAssignedTo:null, calls: EMPTY_CALLS.map(c=>({...c})) },
]
