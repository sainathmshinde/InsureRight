import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Pagination from '../../components/Pagination'
import usePagination from '../../components/usePagination'
import { Table, PageHeader, StatusBadge, Button, EmptyState } from '../../components/UI'
import { PolicyIcon, DownloadPolicyIcon } from '../../icons'
import { useAuth } from '../../context/AuthContext'
import { POLICY_TYPE_COLOR } from '../product/productData'

const MOCK = [
  { id: 1,  agentId: 'a1', customerId: 'c1', proposalId: 'PRO-2025-1001', customerName: 'Aarav Sharma',  mobile: '98765 43210', product: 'Group Health Insurance Policy for BPP_2026-2027', icName: 'SBI General Insurance',      type: 'Age Band Premium', premium: 27777, sumInsured: '₹3L',  policyNo: 'SBI/2025/001234', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-01-15', endDate: '2026-01-14', campaignId: 11, campaignName: 'BPP Campaign_2026-2027',               paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 2,  agentId: 'a2', customerId: 'c2', proposalId: 'PRO-2025-1002', customerName: 'Priya Mehta',   mobile: '87654 32109', product: 'Group Health Insurance Policy for BPP',          icName: 'MAGMA General Insurance',    type: 'Age Band Premium', premium: 47221, sumInsured: '₹3L',  policyNo: 'MAG/2025/002456', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-01', endDate: '2026-01-31', campaignId: 6,  campaignName: 'BPP Campaign',                         paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 3,  agentId: 'a1', customerId: 'c3', proposalId: 'PRO-2025-1003', customerName: 'Amit Kumar',    mobile: '76543 21098', product: 'SBI Base Policy',                                icName: 'SBI General Insurance',      type: 'Base Policy',      premium: 31053, sumInsured: '₹5L',  policyNo: 'SBI/2025/003789', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-02-10', endDate: '2026-02-09', campaignId: 8,  campaignName: 'SBI_STP_Campaign',                     paymentMode: 'Offline', paymentType: 'NEFT'    },
  { id: 4,  agentId: 'a2', customerId: 'c4', proposalId: 'PRO-2025-1004', customerName: 'Sunita Rao',    mobile: '65432 10987', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 9676,  sumInsured: '₹20K', policyNo: 'SBI/2025/004012', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-01', endDate: '2026-03-01', campaignId: 5,  campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 5,  agentId: 'a1', customerId: 'c1', proposalId: 'PRO-2025-1005', customerName: 'Aarav Sharma',  mobile: '98765 43210', product: 'Standalone Super Top Up Policy_BPP_2026-2027',   icName: 'SBI General Insurance',      type: 'Age Band Premium', premium: 50574, sumInsured: '₹3L',  policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: '',           campaignId: 11, campaignName: 'BPP Campaign_2026-2027',               paymentMode: '',        paymentType: ''        },
  { id: 6,  agentId: 'a2', customerId: 'c5', proposalId: 'PRO-2025-1006', customerName: 'Deepa Joshi',   mobile: '43210 98765', product: 'For Threshold of 3 Lakhs — Super Top Up Policy', icName: 'SBI General Insurance',      type: 'Super Top Up',     premium: 2000,  sumInsured: '₹1L',  policyNo: 'SBI/2025/006345', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-03-20', endDate: '2026-03-19', campaignId: 11, campaignName: 'BPP Campaign_2026-2027',               paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 7,  agentId: 'a2', customerId: 'c6', proposalId: 'PRO-2025-1007', customerName: 'Ramesh Gupta',  mobile: '32109 87654', product: 'Super Top Up Policy',                            icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 5509,  sumInsured: '₹3L',  policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 6,  campaignName: 'BPP Campaign',                         paymentMode: '',        paymentType: ''        },
  { id: 8,  agentId: 'a2', customerId: 'c2', proposalId: 'PRO-2025-1008', customerName: 'Priya Mehta',   mobile: '87654 32109', product: 'Group Health Insurance Policy for BPP_2026-2027', icName: 'SBI General Insurance',      type: 'Age Band Premium', premium: 19194, sumInsured: '₹3L',  policyNo: 'SBI/2025/008901', paymentStatus: 'Paid',    status: 'Active',    startDate: '2025-04-01', endDate: '2026-03-31', campaignId: 11, campaignName: 'BPP Campaign_2026-2027',               paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 9,  agentId: 'a1', customerId: 'c3', proposalId: 'PRO-2025-1009', customerName: 'Amit Kumar',    mobile: '76543 21098', product: 'Standalone Super Top Up Policy (BPP)',            icName: 'MAGMA General Insurance',    type: 'Age Band Premium', premium: 13178, sumInsured: '₹3L',  policyNo: '',                paymentStatus: 'Pending', status: 'Pending',   startDate: '',           endDate: '',           campaignId: 6,  campaignName: 'BPP Campaign',                         paymentMode: '',        paymentType: ''        },
  { id: 10, agentId: 'a2', customerId: 'c4', proposalId: 'PRO-2025-1010', customerName: 'Sunita Rao',    mobile: '65432 10987', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 10385, sumInsured: '₹15K', policyNo: 'DIG/2025/010234', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-15', endDate: '2026-04-14', campaignId: 5,  campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 11, agentId: 'a1', customerId: 'c5',  proposalId: 'PRO-2025-1011', customerName: 'Deepa Joshi',      mobile: '43210 98765', product: 'Group Health Insurance Policy for BPP_2026-2027', icName: 'SBI General Insurance',      type: 'Age Band Premium', premium: 22400, sumInsured: '₹3L',  policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 11, campaignName: 'BPP Campaign_2026-2027',               paymentMode: '',        paymentType: ''        },

  // Campaign OPD and DIGIT PAYMENT PROTECTION (campaignId: 5)
  { id: 12, agentId: 'a1', customerId: 'c13', proposalId: 'PRO-2025-1012', customerName: 'Meera Pillai',    mobile: '98712 34501', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 8400,  sumInsured: '₹20K', policyNo: 'SBI/2025/012101', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-01', endDate: '2026-03-31', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 13, agentId: 'a1', customerId: 'c14', proposalId: 'PRO-2025-1013', customerName: 'Karan Malhotra',  mobile: '98712 34502', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 11200, sumInsured: '₹15K', policyNo: 'DIG/2025/013202', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-05', endDate: '2026-04-04', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 14, agentId: 'a2', customerId: 'c15', proposalId: 'PRO-2025-1014', customerName: 'Ananya Desai',    mobile: '98712 34503', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 9500,  sumInsured: '₹10K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 15, agentId: 'a1', customerId: 'c16', proposalId: 'PRO-2025-1015', customerName: 'Sanjay Reddy',    mobile: '98712 34504', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance',type: 'OPD',              premium: 14800, sumInsured: '₹25K', policyNo: 'HDF/2025/015303', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-03-15', endDate: '2026-03-14', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 16, agentId: 'a1', customerId: 'c17', proposalId: 'PRO-2025-1016', customerName: 'Pooja Krishnan',  mobile: '98712 34505', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 12600, sumInsured: '₹10K', policyNo: 'DIG/2025/016404', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-10', endDate: '2026-04-09', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'UPI'     },
  { id: 17, agentId: 'a2', customerId: 'c18', proposalId: 'PRO-2025-1017', customerName: 'Rajan Nambiar',   mobile: '98712 34506', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 7800,  sumInsured: '₹20K', policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 18, agentId: 'a1', customerId: 'c19', proposalId: 'PRO-2025-1018', customerName: 'Shreya Agarwal',  mobile: '98712 34507', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 10200, sumInsured: '₹15K', policyNo: 'DIG/2025/018505', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-01', endDate: '2026-04-30', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 19, agentId: 'a2', customerId: 'c20', proposalId: 'PRO-2025-1019', customerName: 'Manish Tiwari',   mobile: '98712 34508', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 16500, sumInsured: '₹10K', policyNo: 'DIG/2025/019606', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-03-20', endDate: '2026-03-19', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'UPI'     },
  { id: 20, agentId: 'a1', customerId: 'c21', proposalId: 'PRO-2025-1020', customerName: 'Deepika Shetty',  mobile: '98712 34509', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance',type: 'OPD',              premium: 9100,  sumInsured: '₹25K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 21, agentId: 'a2', customerId: 'c22', proposalId: 'PRO-2025-1021', customerName: 'Akash Pandey',    mobile: '98712 34510', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 8800,  sumInsured: '₹20K', policyNo: '',                paymentStatus: 'Failed',   status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 22, agentId: 'a1', customerId: 'c23', proposalId: 'PRO-2025-1022', customerName: 'Neha Joshi',      mobile: '98712 34511', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 13400, sumInsured: '₹10K', policyNo: 'DIG/2025/022707', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-18', endDate: '2026-04-17', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 23, agentId: 'a1', customerId: 'c24', proposalId: 'PRO-2025-1023', customerName: 'Vivek Saxena',    mobile: '98712 34512', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 11800, sumInsured: '₹15K', policyNo: 'DIG/2025/023808', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-05', endDate: '2026-05-04', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 24, agentId: 'a2', customerId: 'c25', proposalId: 'PRO-2025-1024', customerName: 'Priyanka Mishra', mobile: '98712 34513', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance',type: 'OPD',              premium: 7600,  sumInsured: '₹25K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 25, agentId: 'a1', customerId: 'c26', proposalId: 'PRO-2025-1025', customerName: 'Rohini Iyengar',  mobile: '98712 34514', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 18200, sumInsured: '₹10K', policyNo: 'DIG/2025/025909', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-03-28', endDate: '2026-03-27', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 26, agentId: 'a2', customerId: 'c27', proposalId: 'PRO-2025-1026', customerName: 'Sunil Mehta',     mobile: '98712 34515', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 9900,  sumInsured: '₹25K', policyNo: 'SBI/2025/026010', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-22', endDate: '2026-04-21', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 27, agentId: 'a2', customerId: 'c28', proposalId: 'PRO-2025-1027', customerName: 'Kavya Sharma',    mobile: '98712 34516', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 10700, sumInsured: '₹15K', policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 28, agentId: 'a1', customerId: 'c29', proposalId: 'PRO-2025-1028', customerName: 'Aditya Kumar',    mobile: '98712 34517', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance',type: 'OPD',              premium: 12100, sumInsured: '₹25K', policyNo: 'HDF/2025/028111', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-10', endDate: '2026-05-09', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 29, agentId: 'a1', customerId: 'c30', proposalId: 'PRO-2025-1029', customerName: 'Swati Bose',      mobile: '98712 34518', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance', type: 'Base Policy',      premium: 15300, sumInsured: '₹10K', policyNo: 'DIG/2025/029212', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-28', endDate: '2026-04-27', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'NEFT'    },
  { id: 30, agentId: 'a2', customerId: 'c31', proposalId: 'PRO-2025-1030', customerName: 'Harish Rao',      mobile: '98712 34519', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',      type: 'OPD',              premium: 8100,  sumInsured: '₹20K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 31, agentId: 'a1', customerId: 'c32', proposalId: 'PRO-2025-1031', customerName: 'Nandini Gupta',   mobile: '98712 34520', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance', type: 'OPD',              premium: 10900, sumInsured: '₹15K', policyNo: 'DIG/2025/031313', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-15', endDate: '2026-05-14', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },

  // Campaign OPD and DIGIT PAYMENT PROTECTION — additional records
  { id: 32, agentId: 'a1', customerId: 'c33', proposalId: 'PRO-2025-1032', customerName: 'Tanvi Kulkarni',  mobile: '98712 34521', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',       type: 'OPD',         premium: 9200,  sumInsured: '₹20K', policyNo: 'SBI/2025/032101', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-18', endDate: '2026-05-17', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 33, agentId: 'a2', customerId: 'c34', proposalId: 'PRO-2025-1033', customerName: 'Ramesh Patil',    mobile: '98712 34522', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance',  type: 'Base Policy', premium: 14100, sumInsured: '₹10K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 34, agentId: 'a1', customerId: 'c35', proposalId: 'PRO-2025-1034', customerName: 'Sneha Iyer',      mobile: '98712 34523', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance', type: 'OPD',         premium: 11500, sumInsured: '₹25K', policyNo: 'HDF/2025/034202', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-20', endDate: '2026-05-19', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 35, agentId: 'a2', customerId: 'c36', proposalId: 'PRO-2025-1035', customerName: 'Girish Nair',     mobile: '98712 34524', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',  type: 'OPD',         premium: 8700,  sumInsured: '₹15K', policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 36, agentId: 'a1', customerId: 'c37', proposalId: 'PRO-2025-1036', customerName: 'Poornima Rao',    mobile: '98712 34525', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',       type: 'OPD',         premium: 9800,  sumInsured: '₹20K', policyNo: 'SBI/2025/036303', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-25', endDate: '2026-04-24', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 37, agentId: 'a1', customerId: 'c38', proposalId: 'PRO-2025-1037', customerName: 'Kiran Desai',     mobile: '98712 34526', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance',  type: 'Base Policy', premium: 17200, sumInsured: '₹10K', policyNo: 'DIG/2025/037404', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-02', endDate: '2026-05-01', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'UPI'     },
  { id: 38, agentId: 'a2', customerId: 'c39', proposalId: 'PRO-2025-1038', customerName: 'Bhavna Mehta',    mobile: '98712 34527', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance', type: 'OPD',         premium: 7900,  sumInsured: '₹25K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 39, agentId: 'a1', customerId: 'c40', proposalId: 'PRO-2025-1039', customerName: 'Sudarshan Pillai',mobile: '98712 34528', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',  type: 'OPD',         premium: 12400, sumInsured: '₹15K', policyNo: 'DIG/2025/039505', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-03-30', endDate: '2026-03-29', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 40, agentId: 'a2', customerId: 'c41', proposalId: 'PRO-2025-1040', customerName: 'Lalitha Krishnan',mobile: '98712 34529', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',       type: 'OPD',         premium: 8500,  sumInsured: '₹20K', policyNo: '',                paymentStatus: 'Failed',   status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 41, agentId: 'a1', customerId: 'c42', proposalId: 'PRO-2025-1041', customerName: 'Arvind Tiwari',   mobile: '98712 34530', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance',  type: 'Base Policy', premium: 13800, sumInsured: '₹10K', policyNo: 'DIG/2025/041606', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-08', endDate: '2026-04-07', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 42, agentId: 'a2', customerId: 'c43', proposalId: 'PRO-2025-1042', customerName: 'Chitra Bose',     mobile: '98712 34531', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance', type: 'OPD',         premium: 10100, sumInsured: '₹25K', policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 43, agentId: 'a1', customerId: 'c44', proposalId: 'PRO-2025-1043', customerName: 'Mohan Shetty',    mobile: '98712 34532', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',  type: 'OPD',         premium: 11300, sumInsured: '₹15K', policyNo: 'DIG/2025/043707', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-06', endDate: '2026-05-05', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 44, agentId: 'a2', customerId: 'c45', proposalId: 'PRO-2025-1044', customerName: 'Pallavi Joshi',   mobile: '98712 34533', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',       type: 'OPD',         premium: 9400,  sumInsured: '₹20K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 45, agentId: 'a1', customerId: 'c46', proposalId: 'PRO-2025-1045', customerName: 'Dinesh Agarwal',  mobile: '98712 34534', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance',  type: 'Base Policy', premium: 15700, sumInsured: '₹10K', policyNo: 'DIG/2025/045808', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-14', endDate: '2026-04-13', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
  { id: 46, agentId: 'a1', customerId: 'c47', proposalId: 'PRO-2025-1046', customerName: 'Rekha Saxena',    mobile: '98712 34535', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance', type: 'OPD',         premium: 8200,  sumInsured: '₹25K', policyNo: 'HDF/2025/046909', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-03-22', endDate: '2026-03-21', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'UPI'     },
  { id: 47, agentId: 'a2', customerId: 'c48', proposalId: 'PRO-2025-1047', customerName: 'Prasad Mishra',   mobile: '98712 34536', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',  type: 'OPD',         premium: 10600, sumInsured: '₹15K', policyNo: '',                paymentStatus: 'Rejected', status: 'Cancelled', startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 48, agentId: 'a1', customerId: 'c49', proposalId: 'PRO-2025-1048', customerName: 'Geeta Iyengar',   mobile: '98712 34537', product: 'OPD Policy-2025-26',                             icName: 'SBI General Insurance',       type: 'OPD',         premium: 9600,  sumInsured: '₹20K', policyNo: 'SBI/2025/048010', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-12', endDate: '2026-05-11', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'UPI'     },
  { id: 49, agentId: 'a2', customerId: 'c50', proposalId: 'PRO-2025-1049', customerName: 'Vinod Pandey',    mobile: '98712 34538', product: 'DIGIT Payment Protection Policy',                icName: 'Go Digit General Insurance',  type: 'Base Policy', premium: 16800, sumInsured: '₹10K', policyNo: 'DIG/2025/049111', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-04-02', endDate: '2026-04-01', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Offline', paymentType: 'Cheque'  },
  { id: 50, agentId: 'a1', customerId: 'c51', proposalId: 'PRO-2025-1050', customerName: 'Savita Gupta',    mobile: '98712 34539', product: 'OPD Group Insurance Policy',                     icName: 'HDFC ERGO General Insurance', type: 'OPD',         premium: 7400,  sumInsured: '₹25K', policyNo: '',                paymentStatus: 'Pending',  status: 'Pending',   startDate: '',           endDate: '',           campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: '',        paymentType: ''        },
  { id: 51, agentId: 'a2', customerId: 'c52', proposalId: 'PRO-2025-1051', customerName: 'Nikhil Sharma',   mobile: '98712 34540', product: 'OUT-PATIENT CARE INSURANCE POLICY',              icName: 'Go Digit General Insurance',  type: 'OPD',         premium: 12800, sumInsured: '₹15K', policyNo: 'DIG/2025/051212', paymentStatus: 'Paid',     status: 'Active',    startDate: '2025-05-19', endDate: '2026-05-18', campaignId: 5, campaignName: 'Campaign OPD and DIGIT PAYMENT PROTECTION', paymentMode: 'Online',  paymentType: 'Gateway' },
]

export { MOCK as POLICY_MOCK }

const CAMPAIGN_OPTIONS = [...new Map(MOCK.map(p => [p.campaignId, p.campaignName])).entries()]
  .map(([id, name]) => ({ id, name }))

const filterLabel = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

export default function PolicyList() {
  const navigate = useNavigate()
  const [searchParams]  = useSearchParams()
  const { user } = useAuth()
  const isCustomer = user?.role === 'customer'

  const [search,           setSearch]      = useState('')
  const [campaignFilter,   setCampaign]    = useState(searchParams.get('campaignId') ?? '')
  const [statusFilter,     setStatus]      = useState(searchParams.get('status')     ?? '')
  const [paymentFilter,    setPayment]     = useState(searchParams.get('payment')    ?? '')
  const [paymentModeFilter,setPaymentMode] = useState('')
  const [paymentTypeFilter,setPaymentType] = useState('')

  const scopedData = isCustomer ? MOCK.filter(p => p.customerId === user.id) : MOCK

  const filtered = scopedData.filter(p => {
    const q = search.toLowerCase()
    return (
      (p.customerName.toLowerCase().includes(q) || p.proposalId.toLowerCase().includes(q) || p.policyNo.toLowerCase().includes(q)) &&
      (campaignFilter    ? p.campaignId    === Number(campaignFilter) : true) &&
      (statusFilter      ? p.status        === statusFilter           : true) &&
      (paymentFilter     ? p.paymentStatus === paymentFilter          : true) &&
      (paymentModeFilter ? p.paymentMode   === paymentModeFilter      : true) &&
      (paymentTypeFilter ? p.paymentType   === paymentTypeFilter      : true)
    )
  })
  const pg     = usePagination(filtered, 10)
  const handle = setter => v => { setter(v); pg.reset() }

  const columns = [
    { key: 'proposalId',    label: 'Proposal ID',
      style: { fontFamily: 'monospace', fontSize: 12.5, color: 'var(--brand)', fontWeight: 600 } },
    ...(!isCustomer ? [{
      key: 'customerName', label: 'Customer',
      render: row => (
        <div>
          <div style={{ fontWeight: 500 }}>{row.customerName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{row.mobile}</div>
        </div>
      ),
    }] : []),
    { key: 'product',       label: 'Product',     style: { maxWidth: 180, fontSize: 13 } },
    { key: 'icName',        label: 'IC',          style: { color: 'var(--text-2)', fontSize: 13 } },
    { key: 'type',          label: 'Type',
      render: row => <span className={`badge badge-${POLICY_TYPE_COLOR[row.type] ?? 'blue'}`}>{row.type}</span> },
    { key: 'premium',       label: 'Premium',     style: { fontWeight: 600 },
      render: row => `₹${row.premium.toLocaleString()}` },
    { key: 'paymentStatus', label: 'Payment',     render: row => <StatusBadge status={row.paymentStatus} /> },
    { key: 'paymentMode',   label: 'Mode',
      render: row => row.paymentMode
        ? <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.paymentMode}</span>
        : <span style={{ color: 'var(--text-3)' }}>—</span> },
    { key: 'paymentType',   label: 'Pay Type',
      render: row => row.paymentType
        ? <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{row.paymentType}</span>
        : <span style={{ color: 'var(--text-3)' }}>—</span> },
    { key: 'policyNo',      label: 'Policy No.',
      style: { fontFamily: 'monospace', fontSize: 12 },
      render: row => row.policyNo || <span style={{ color: 'var(--text-3)' }}>—</span> },
    { key: 'status',        label: 'Status',      render: row => <StatusBadge status={row.status} /> },
    { key: 'actions',       label: 'Actions',
      render: row => (
        <div style={{ display: 'flex', gap: 6 }}>
          {row.status === 'Active' && row.policyNo && (
            <Button variant="secondary" size="sm">
              <DownloadPolicyIcon size={13} /> Download
            </Button>
          )}
          {row.paymentStatus === 'Pending' && (
            <Button variant="primary" size="sm" onClick={() => navigate(`/policy/buy?proposalId=${row.proposalId}`)}>Pay Now</Button>
          )}
        </div>
      )},
  ]

  return (
    <div>
      <PageHeader
        icon={<PolicyIcon />}
        title={isCustomer ? 'My Policies' : 'Policy Issuance'}
        subtitle={isCustomer
          ? `${scopedData.length} policies · ${scopedData.filter(p => p.status === 'Active').length} active`
          : `${MOCK.length} proposals · ${MOCK.filter(p => p.status === 'Active').length} active policies`}
      >
        <Button onClick={() => navigate('/policy/buy')}>+ Buy Policy</Button>
      </PageHeader>

      {/* Summary tiles */}
      <div className="pl-tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: isCustomer ? 'My Policies'    : 'Total Proposals', value: scopedData.length,                                                         icon: '📋', color: 'var(--brand)' },
          { label: 'Active Policies',              value: scopedData.filter(p => p.status === 'Active').length,                                          icon: '✅', color: 'var(--green)' },
          { label: 'Pending Payment',              value: scopedData.filter(p => p.paymentStatus === 'Pending').length,                                  icon: '⏳', color: 'var(--amber)' },
          { label: isCustomer ? 'Premium Paid'   : 'Total Premium',   value: `₹${(scopedData.filter(p => p.paymentStatus === 'Paid').reduce((s, p) => s + p.premium, 0) / 1000).toFixed(1)}K`, icon: '💰', color: 'var(--blue)' },
        ].map(tile => (
          <div key={tile.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 26, width: 44, height: 44, borderRadius: 'var(--r-md)', background: tile.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tile.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{tile.value}</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>{tile.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="filter-bar" style={{ alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Search</label>
              <input className="field-input filter-search" placeholder={isCustomer ? "Search by proposal ID or policy no…" : "Search by customer, proposal ID or policy no…"}
                value={search} onChange={e => handle(setSearch)(e.target.value)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Campaign</label>
              <select className="field-select" style={{ width: 220 }} value={campaignFilter} onChange={e => handle(setCampaign)(e.target.value)}>
                <option value="">All Campaigns</option>
                {CAMPAIGN_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Status</label>
              <select className="field-select" style={{ width: 160 }} value={statusFilter} onChange={e => handle(setStatus)(e.target.value)}>
                <option value="">All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Mode</label>
              <select className="field-select" style={{ width: 140 }} value={paymentModeFilter} onChange={e => handle(setPaymentMode)(e.target.value)}>
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Pay Type</label>
              <select className="field-select" style={{ width: 140 }} value={paymentTypeFilter} onChange={e => handle(setPaymentType)(e.target.value)}>
                <option value="">All Types</option>
                <option value="Cheque">Cheque</option>
                <option value="NEFT">NEFT</option>
                <option value="UPI">UPI</option>
                <option value="Gateway">Gateway</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={filterLabel}>Payment</label>
              <select className="field-select" style={{ width: 160 }} value={paymentFilter} onChange={e => handle(setPayment)(e.target.value)}>
                <option value="">All Payments</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Failed</option>
                <option>Rejected</option>
              </select>
            </div>
            {(search || campaignFilter || statusFilter || paymentFilter || paymentModeFilter || paymentTypeFilter) && (
              <Button variant="ghost" size="sm" onClick={() => {
                handle(setSearch)(''); handle(setCampaign)(''); handle(setStatus)('');
                handle(setPayment)(''); handle(setPaymentMode)(''); handle(setPaymentType)('')
              }}>Clear</Button>
            )}
          </div>

          {/* ── Mobile cards (hidden on desktop) ── */}
          <div className="pl-cards">
            {pg.slice.length === 0
              ? <EmptyState icon="📋" title="No policies found" subtitle="Buy a new policy to get started" />
              : pg.slice.map(row => {
                const BADGE_HEX = { blue: '#2563eb', green: '#16a34a', amber: '#d97706', purple: '#7c3aed', red: '#dc2626', gray: '#6b7280' }
                const BADGE_BG  = { blue: '#dbeafe', green: '#dcfce7', amber: '#fef3c7', purple: '#ede9fe', red: '#fee2e2', gray: '#f3f4f6' }
                const colorKey  = POLICY_TYPE_COLOR[row.type] ?? 'blue'
                const typeColor = BADGE_HEX[colorKey]
                const typeBg    = BADGE_BG[colorKey]
                return (
                  <div key={row.id} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--r-lg)', background: 'var(--surface)', overflow: 'hidden' }}>
                    {/* Card header */}
                    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 3, lineHeight: 1.3 }}>{row.product}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{row.icName}</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                        <StatusBadge status={row.status} />
                        <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: typeBg, color: typeColor }}>{row.type}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Annual Premium</div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--brand)' }}>₹{row.premium.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Sum Insured</div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{row.sumInsured}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Payment</div>
                        <StatusBadge status={row.paymentStatus} />
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Valid Until</div>
                        <div style={{ fontWeight: 500, fontSize: 12.5 }}>{row.endDate || '—'}</div>
                      </div>
                      {row.paymentMode && (
                        <div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Mode</div>
                          <div style={{ fontWeight: 500, fontSize: 12.5 }}>{row.paymentMode}</div>
                        </div>
                      )}
                      {row.paymentType && (
                        <div>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Pay Type</div>
                          <div style={{ fontWeight: 500, fontSize: 12.5 }}>{row.paymentType}</div>
                        </div>
                      )}
                      {!isCustomer && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Customer</div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{row.customerName} · {row.mobile}</div>
                        </div>
                      )}
                      {row.policyNo && (
                        <div style={{ gridColumn: 'span 2' }}>
                          <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Policy No.</div>
                          <div style={{ fontFamily: 'monospace', fontSize: 12.5, fontWeight: 600, color: 'var(--brand)' }}>{row.policyNo}</div>
                        </div>
                      )}
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 2 }}>Proposal ID</div>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-2)' }}>{row.proposalId}</div>
                      </div>
                    </div>

                    {/* Card actions */}
                    {(row.status === 'Active' && row.policyNo || row.paymentStatus === 'Pending') && (
                      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', gap: 8 }}>
                        {row.status === 'Active' && row.policyNo && (
                          <Button variant="secondary" size="sm" style={{ flex: 1, justifyContent: 'center' }}>
                            ⬇ Download Policy
                          </Button>
                        )}
                        {row.paymentStatus === 'Pending' && (
                          <Button variant="primary" size="sm" style={{ flex: 1, justifyContent: 'center' }}
                            onClick={() => navigate(`/policy/buy?proposalId=${row.proposalId}`)}>
                            💳 Pay Now
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>

          {/* ── Desktop table (hidden on mobile) ── */}
          <div className="pl-table-wrap">
            <Table
              columns={columns}
              rows={pg.slice}
              empty={<EmptyState icon="📋" title="No policies found" subtitle="Buy a new policy to get started" />}
            />
          </div>

          <Pagination total={pg.total} page={pg.page} perPage={pg.perPage} onPage={pg.onPage} onPerPage={pg.onPerPage} />
        </div>
      </div>
    </div>
  )
}
