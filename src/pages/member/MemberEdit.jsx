import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Field, Input, DateInput, Select, SectionBlock, UploadBox } from "../../components/Field";
import { EditIcon } from "../../icons";
import { useAuth } from "../../context/AuthContext";
import { useMembers } from "../../context/MemberContext";
import FamilyMembersSection from "./FamilyMembersSection";
import { ORGANISATIONS, ASSOCIATIONS } from "./orgAssocData";

const doc = (type, params) =>
  `/documents/preview.html?type=${type}&${new URLSearchParams(params)}`;

const MOCK_DATA = {
  1: {
    name: "Aarav Sharma", mobile: "9876543210", email: "aarav@gmail.com",
    dob: "1990-03-15", gender: "Male", kycStatus: "Verified",
    aadhaar: "1234 5678 9012", pan: "AABCS1234D",
    address: "14, Green Valley Apartments, Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400053",
    nomineeName: "Priya Sharma", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Aarav Sharma", number: "1234 5678 9012", dob: "15/03/1990", gender: "Male" }),
    panFile:     doc("pan",     { name: "Aarav Sharma", number: "AABCS1234D",     dob: "15/03/1990", gender: "Male" }),
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Priya Sharma", dob: "1992-07-22", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",      name: "Aryan Sharma", dob: "2016-02-10", gender: "Male",   preExisting: "" },
      { id: 3, type: "Daughter", name: "Aanya Sharma", dob: "2019-09-05", gender: "Female", preExisting: "" },
    ],
  },
  2: {
    name: "Rohit Sharma", mobile: "9812000000", email: "rohit@gmail.com",
    dob: "1990-11-20", gender: "Male", kycStatus: "Pending",
    aadhaar: "2345 6789 0123", pan: "BBBRS2345E",
    address: "45, MG Road", city: "Pune", state: "Maharashtra", pincode: "411001",
    nomineeName: "", nomineeRelation: "", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Rohit Sharma", number: "2345 6789 0123", dob: "20/11/1990", gender: "Male" }),
    panFile:     doc("pan",     { name: "Rohit Sharma", number: "BBBRS2345E",     dob: "20/11/1990", gender: "Male" }),
    familyMembers: [],
  },
  3: {
    name: "Divya Nair", mobile: "9911223344", email: "divya@gmail.com",
    dob: "1978-06-05", gender: "Female", kycStatus: "Verified",
    aadhaar: "3456 7890 1234", pan: "CCCDN3456F",
    address: "7/B, Koramangala", city: "Bangalore", state: "Karnataka", pincode: "560034",
    nomineeName: "Sandeep Nair", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Divya Nair", number: "3456 7890 1234", dob: "05/06/1978", gender: "Female" }),
    panFile:     doc("pan",     { name: "Divya Nair", number: "CCCDN3456F",     dob: "05/06/1978", gender: "Female" }),
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Sandeep Nair", dob: "1975-04-10", gender: "Male",   preExisting: "" },
      { id: 2, type: "Son",      name: "Rohan Nair",   dob: "2005-08-15", gender: "Male",   preExisting: "" },
      { id: 3, type: "Daughter", name: "Ankita Nair",  dob: "2008-11-20", gender: "Female", preExisting: "" },
    ],
  },
  4: {
    name: "Vijay Patil", mobile: "9011223344", email: "vijay@gmail.com",
    dob: "1995-09-30", gender: "Male", kycStatus: "Rejected",
    aadhaar: "4567 8901 2345", pan: "DDDVP4567G",
    address: "23, Shivaji Nagar", city: "Nashik", state: "Maharashtra", pincode: "422001",
    nomineeName: "", nomineeRelation: "", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Vijay Patil", number: "4567 8901 2345", dob: "30/09/1995", gender: "Male" }),
    panFile:     doc("pan",     { name: "Vijay Patil", number: "DDDVP4567G",     dob: "30/09/1995", gender: "Male" }),
    familyMembers: [],
  },
  5: {
    name: "Suresh Kumar", mobile: "9988001122", email: "suresh@gmail.com",
    dob: "1985-03-20", gender: "Male", kycStatus: "Verified",
    aadhaar: "5678 9012 3456", pan: "EEESK5678H",
    address: "101, Deccan Gymkhana", city: "Pune", state: "Maharashtra", pincode: "411004",
    nomineeName: "Meena Kumar", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Suresh Kumar", number: "5678 9012 3456", dob: "20/03/1985", gender: "Male" }),
    panFile:     doc("pan",     { name: "Suresh Kumar", number: "EEESK5678H",     dob: "20/03/1985", gender: "Male" }),
    familyMembers: [
      { id: 1, type: "Spouse", name: "Meena Kumar", dob: "1987-06-12", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",    name: "Aryan Kumar", dob: "2014-03-05", gender: "Male",   preExisting: "" },
    ],
  },
  6: {
    name: "Vikram Rao", mobile: "9944556677", email: "vikram@gmail.com",
    dob: "1975-08-20", gender: "Male", kycStatus: "Verified",
    aadhaar: "6789 0123 4567", pan: "FFFVR6789I",
    address: "B-5, Sector 18", city: "Noida", state: "Uttar Pradesh", pincode: "201301",
    nomineeName: "Sunita Rao", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Vikram Rao", number: "6789 0123 4567", dob: "20/08/1975", gender: "Male" }),
    panFile:     doc("pan",     { name: "Vikram Rao", number: "FFFVR6789I",     dob: "20/08/1975", gender: "Male" }),
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Sunita Rao",  dob: "1978-02-14", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",      name: "Karthik Rao", dob: "2003-07-19", gender: "Male",   preExisting: "" },
      { id: 3, type: "Daughter", name: "Preethi Rao", dob: "2007-01-08", gender: "Female", preExisting: "" },
    ],
  },
  7: {
    name: "Kavita Pillai", mobile: "9899112233", email: "kavita@gmail.com",
    dob: "1993-12-01", gender: "Female", kycStatus: "Verified",
    aadhaar: "7890 1234 5678", pan: "GGGKP7890J",
    address: "56, Jubilee Hills", city: "Hyderabad", state: "Telangana", pincode: "500033",
    nomineeName: "Arun Pillai", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Kavita Pillai", number: "7890 1234 5678", dob: "01/12/1993", gender: "Female" }),
    panFile:     doc("pan",     { name: "Kavita Pillai", number: "GGGKP7890J",     dob: "01/12/1993", gender: "Female" }),
    familyMembers: [
      { id: 1, type: "Spouse", name: "Arun Pillai", dob: "1990-05-22", gender: "Male", preExisting: "" },
    ],
  },
  8: {
    name: "Arjun Singh", mobile: "9922334455", email: "arjun@gmail.com",
    dob: "1987-03-22", gender: "Male", kycStatus: "Verified",
    aadhaar: "8901 2345 6789", pan: "HHHAJ8901K",
    address: "8, Andheri West", city: "Mumbai", state: "Maharashtra", pincode: "400058",
    nomineeName: "Neha Singh", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Arjun Singh", number: "8901 2345 6789", dob: "22/03/1987", gender: "Male" }),
    panFile:     doc("pan",     { name: "Arjun Singh", number: "HHHAJ8901K",     dob: "22/03/1987", gender: "Male" }),
    familyMembers: [
      { id: 1, type: "Spouse", name: "Neha Singh", dob: "1989-09-30", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",    name: "Dev Singh",  dob: "2015-12-10", gender: "Male",   preExisting: "" },
    ],
  },
  9: {
    name: "Priya Mehta", mobile: "9812345678", email: "priya@gmail.com",
    dob: "1992-07-10", gender: "Female", kycStatus: "Verified",
    aadhaar: "9012 3456 7890", pan: "IIIPM9012L",
    address: "33, Fort Kochi", city: "Kochi", state: "Kerala", pincode: "682001",
    nomineeName: "Raj Mehta", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Priya Mehta", number: "9012 3456 7890", dob: "10/07/1992", gender: "Female" }),
    panFile:     doc("pan",     { name: "Priya Mehta", number: "IIIPM9012L",     dob: "10/07/1992", gender: "Female" }),
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Raj Mehta",  dob: "1989-03-25", gender: "Male",   preExisting: "" },
      { id: 2, type: "Daughter", name: "Sara Mehta", dob: "2019-06-18", gender: "Female", preExisting: "" },
    ],
  },
  10: {
    name: "Rahul Gupta", mobile: "9966778899", email: "rahul@gmail.com",
    dob: "1980-01-05", gender: "Male", kycStatus: "Verified",
    aadhaar: "0123 4567 8901", pan: "JJJRG0123M",
    address: "C-9, Civil Lines", city: "Delhi", state: "Delhi", pincode: "110054",
    nomineeName: "Pooja Gupta", nomineeRelation: "Spouse", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Rahul Gupta", number: "0123 4567 8901", dob: "05/01/1980", gender: "Male" }),
    panFile:     doc("pan",     { name: "Rahul Gupta", number: "JJJRG0123M",     dob: "05/01/1980", gender: "Male" }),
    familyMembers: [
      { id: 1, type: "Spouse",   name: "Pooja Gupta",     dob: "1983-11-28", gender: "Female", preExisting: "" },
      { id: 2, type: "Son",      name: "Siddharth Gupta", dob: "2008-04-15", gender: "Male",   preExisting: "" },
      { id: 3, type: "Daughter", name: "Ananya Gupta",    dob: "2012-09-03", gender: "Female", preExisting: "" },
    ],
  },
  11: {
    name: "Ritu Singh", mobile: "9833221100", email: "ritu@gmail.com",
    dob: "1996-05-18", gender: "Female", kycStatus: "Pending",
    aadhaar: "1234 9876 5432", pan: "KKKRS1234N",
    address: "12, Raja Park", city: "Jaipur", state: "Rajasthan", pincode: "302004",
    nomineeName: "", nomineeRelation: "", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Ritu Singh", number: "1234 9876 5432", dob: "18/05/1996", gender: "Female" }),
    panFile:     doc("pan",     { name: "Ritu Singh", number: "KKKRS1234N",     dob: "18/05/1996", gender: "Female" }),
    familyMembers: [],
  },
  12: {
    name: "Ajay Iyer", mobile: "9822110099", email: "ajay@gmail.com",
    dob: "1983-10-30", gender: "Male", kycStatus: "Rejected",
    aadhaar: "2345 0987 6543", pan: "LLLAI2345O",
    address: "4, T Nagar", city: "Chennai", state: "Tamil Nadu", pincode: "600017",
    nomineeName: "", nomineeRelation: "", nomineeShare: "100",
    aadhaarFile: doc("aadhaar", { name: "Ajay Iyer", number: "2345 0987 6543", dob: "30/10/1983", gender: "Male" }),
    panFile:     doc("pan",     { name: "Ajay Iyer", number: "LLLAI2345O",     dob: "30/10/1983", gender: "Male" }),
    familyMembers: [],
  },
};

function authUserToMember(u) {
  if (!u) return {};
  return { name: u.name, mobile: u.phone || '', email: u.email };
}

export default function MemberEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isProfile = !id;
  const { members: allMembers, updateKycStatus } = useMembers();
  // Resolve the context member for both id-based edit and profile (email) mode —
  // this is the live, real record (works for all members, not just the first 12
  // that have hand-authored MOCK_DATA below).
  const contextMember = isProfile
    ? allMembers.find(c => c.email === user?.email)
    : allMembers.find(c => c.id === Number(id));

  // MOCK_DATA only has hand-authored supplemental fields (KYC docs, address,
  // family, nominee) for the first 12 members — it's overlaid *underneath*
  // the live context data, never used as the source of identity fields, so
  // members 13+ (id 33-248) still load with their real name/mobile/etc.
  const mockExtra = isProfile
    ? (Object.values(MOCK_DATA).find(m => m.email === user?.email) ?? {})
    : (MOCK_DATA[id] ?? {});
  const contextToForm = (c) => c ? {
    name: c.name,
    mobile: c.mobile,
    email: c.email,
    dob: c.dob,
    gender: c.gender,
    kycStatus: c.kyc,
    organisationId: c.organisationId,
    associationId: c.associationId,
  } : {};
  const rawInitial = isProfile
    ? { ...mockExtra, ...contextToForm(contextMember), ...authUserToMember(user) }
    : { ...mockExtra, ...contextToForm(contextMember) };
  const splitName = (raw) => {
    const parts = (raw.name || "").trim().split(" ");
    return { firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" };
  };
  const initial = {
    ...rawInitial,
    ...(!rawInitial.firstName ? splitName(rawInitial) : {}),
    empId: rawInitial.empId || "",
  };

  const [form, setForm] = useState(initial);
  const [members, setMembers] = useState(initial.familyMembers ?? []);
  const [kycFetching, setKycFetching] = useState(null);
  const [kycFetched, setKycFetched] = useState(null);
  const [resubmitted, setResubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(
    typeof initial.photoFile === 'string' ? initial.photoFile : null
  )
  useEffect(() => {
    if (form.photoFile instanceof File) {
      const url = URL.createObjectURL(form.photoFile)
      setPhotoPreview(url)
      return () => URL.revokeObjectURL(url)
    }
    if (typeof form.photoFile === 'string') setPhotoPreview(form.photoFile)
    if (form.photoFile == null) setPhotoPreview(null)
  }, [form.photoFile])

  const liveKyc = contextMember?.kyc ?? form.kycStatus ?? 'Pending';

  const handleResubmit = () => {
    if (contextMember?.id) updateKycStatus(contextMember.id, 'Pending');
    setResubmitted(true);
  };

  const set  = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));
  const setF = (f) => (e) => {
    setForm((p) => ({ ...p, [f]: e.target.files[0] ?? null }));
    setKycFetched(null);
  };

  const fetchFromDoc = (docType) => {
    setKycFetching(docType);
    setTimeout(() => {
      const fill = {
        firstName: form.firstName || 'Rajesh',
        lastName: form.lastName || 'Kumar',
        dob: form.dob || '1988-04-12',
        gender: form.gender || 'Male',
      };
      if (docType === 'aadhaar') {
        Object.assign(fill, {
          address: form.address || '24, Shivaji Park, Dadar',
          city: form.city || 'Mumbai',
          state: form.state || 'Maharashtra',
          pincode: form.pincode || '400028',
        });
      }
      setForm(p => ({ ...p, ...fill }));
      setKycFetching(null);
      setKycFetched(docType);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(isProfile ? "Update member profile:" : "Update member:", form);
    navigate(isProfile ? "/profile" : "/member");
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="page-icon"><EditIcon /></div>
          <div>
            <div className="page-title">{isProfile ? "Edit My Profile" : "Edit Member"}</div>
            <div className="page-subtitle">{isProfile ? "Update your contact details" : "Update member profile"}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {!isProfile && (
            <button
              className="btn btn-secondary"
              onClick={() => navigate(`/member/${id}/360`)}
            >
              360° View
            </button>
          )}
          {isProfile && (
            <button className="btn btn-ghost" onClick={() => navigate("/profile")}>← Profile</button>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => navigate(isProfile ? "/dashboard" : "/member")}
          >
            {isProfile ? "← Dashboard" : "← Back"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* KYC Documents — FIRST */}
            <SectionBlock icon="🪪" title="KYC Documents">
              {kycFetched && (
                <div style={{
                  background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: 8,
                  padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: 13.5, color: '#166534',
                }}>
                  ✅ Info auto-filled from {kycFetched === 'aadhaar' ? 'Aadhaar' : 'PAN'} — please review and confirm below.
                </div>
              )}
              {/* KYC Status Banner */}
              {resubmitted ? (
                <div style={kycBanner('green')}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#166534' }}>Documents Resubmitted</div>
                    <div style={{ fontSize: 13.5, color: '#15803d', marginTop: 2 }}>KYC is pending re-verification by the broker.</div>
                  </div>
                </div>
              ) : liveKyc === 'Verified' ? (
                <div style={kycBanner('green')}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#166534' }}>KYC Verified</div>
                    <div style={{ fontSize: 13.5, color: '#15803d', marginTop: 2 }}>Documents approved. Re-upload to update.</div>
                  </div>
                </div>
              ) : liveKyc === 'Rejected' ? (
                <div style={kycBanner('red')}>
                  <span style={{ fontSize: 18 }}>❌</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#991b1b' }}>KYC Rejected</div>
                    <div style={{ fontSize: 13.5, color: '#b91c1c', marginTop: 2 }}>
                      Your documents were rejected. Please re-upload valid Aadhaar and PAN documents below and submit for re-verification.
                    </div>
                  </div>
                </div>
              ) : (
                <div style={kycBanner('amber')}>
                  <span style={{ fontSize: 18 }}>⏳</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: '#92400e' }}>KYC Pending Review</div>
                    <div style={{ fontSize: 13.5, color: '#b45309', marginTop: 2 }}>Documents submitted and awaiting verification.</div>
                  </div>
                </div>
              )}
              <div className="form-grid-3">
                <Field label="Aadhaar Number">
                  <Input
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    value={form.aadhaar || ""}
                    onChange={set("aadhaar")}
                  />
                </Field>
                <Field label="PAN Number">
                  <Input
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={form.pan || ""}
                    onChange={set("pan")}
                  />
                </Field>
                <Field label="Aadhaar Card">
                  <UploadBox
                    label="Upload Aadhaar card"
                    hint="JPG, PNG or PDF"
                    value={form.aadhaarFile}
                    onChange={setF('aadhaarFile')}
                  />
                  {form.aadhaarFile instanceof File && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginTop: 8, width: '100%' }}
                      onClick={() => fetchFromDoc('aadhaar')}
                      disabled={kycFetching !== null}
                    >
                      {kycFetching === 'aadhaar' ? '⏳ Fetching info…' : '🔍 Get Info from Aadhaar'}
                    </button>
                  )}
                </Field>
                <Field label="PAN Card">
                  <UploadBox
                    label="Upload PAN card"
                    hint="JPG, PNG or PDF"
                    value={form.panFile}
                    onChange={setF('panFile')}
                  />
                  {form.panFile instanceof File && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ marginTop: 8, width: '100%' }}
                      onClick={() => fetchFromDoc('pan')}
                      disabled={kycFetching !== null}
                    >
                      {kycFetching === 'pan' ? '⏳ Fetching info…' : '🔍 Get Info from PAN'}
                    </button>
                  )}
                </Field>
              </div>

              {/* Re-verification submit — only when rejected and a new file is uploaded */}
              {liveKyc === 'Rejected' && !resubmitted &&
                (form.aadhaarFile instanceof File || form.panFile instanceof File) && (
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={handleResubmit}
                  >
                    🔄 Submit for Re-verification
                  </button>
                </div>
              )}
            </SectionBlock>

            {/* Basic Information */}
            <SectionBlock icon="👤" title="Basic Information">
              {/* Photo upload / replace */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 18 }}>
                <div style={{
                  width: 90, height: 90, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--brand-light)', border: '2.5px dashed var(--brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {photoPreview
                    ? <img src={photoPreview} alt="Member" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 38, lineHeight: 1 }}>👤</span>
                  }
                </div>
                <div>
                  <label style={{ cursor: 'pointer', display: 'inline-block' }}>
                    <input type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => setForm(p => ({ ...p, photoFile: e.target.files[0] ?? null }))} />
                    <span className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
                      {photoPreview ? '🔄 Replace Photo' : '📷 Upload Photo'}
                    </span>
                  </label>
                  {form.photoFile != null && (
                    <button type="button" className="btn btn-ghost" style={{ marginLeft: 8 }}
                      onClick={() => setForm(p => ({ ...p, photoFile: null }))}>
                      Remove
                    </button>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6 }}>JPG or PNG · Max 2 MB</div>
                </div>
              </div>
              <div className="form-grid-3">
                <Field label="First Name" required>
                  <Input
                    placeholder="First name"
                    value={form.firstName || ""}
                    onChange={set("firstName")}
                    required
                  />
                </Field>
                <Field label="Last Name" required>
                  <Input
                    placeholder="Last name"
                    value={form.lastName || ""}
                    onChange={set("lastName")}
                    required
                  />
                </Field>
                <Field label="EMP ID / PF No.">
                  <Input
                    placeholder="e.g. EMP-001 or PF123456"
                    value={form.empId || ""}
                    onChange={set("empId")}
                  />
                </Field>
                <Field label="Mobile" required style={{ gridColumnStart: 1 }}>
                  <Input
                    type="tel"
                    value={form.mobile || ""}
                    onChange={set("mobile")}
                    required
                  />
                </Field>
                <Field label="Email">
                  <Input
                    type="email"
                    value={form.email || ""}
                    onChange={set("email")}
                  />
                </Field>
                <Field label="Date of Birth">
                  <DateInput
                    value={form.dob || ""}
                    onChange={set("dob")}
                  />
                </Field>
                <Field label="Gender">
                  <Select value={form.gender || ""} onChange={set("gender")}>
                    <option value="">Select gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Organisation">
                  <Select
                    value={form.organisationId || ""}
                    onChange={e => setForm(p => ({ ...p, organisationId: e.target.value, associationId: "" }))}
                  >
                    <option value="">Select organisation</option>
                    {ORGANISATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </Select>
                </Field>
                <Field label="Association">
                  <Select
                    value={form.associationId || ""}
                    onChange={set("associationId")}
                    disabled={!form.organisationId}
                  >
                    <option value="">{form.organisationId ? "Select association" : "Select organisation first"}</option>
                    {ASSOCIATIONS.filter(a => a.orgId === Number(form.organisationId)).map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </Select>
                </Field>
              </div>
            </SectionBlock>

            {/* Address */}
            <SectionBlock icon="📍" title="Address">
              <div className="form-grid-3">
                <Field label="Address">
                  <Input value={form.address || ""} onChange={set("address")} />
                </Field>
                <Field label="City">
                  <Input value={form.city || ""} onChange={set("city")} />
                </Field>
                <Field label="State">
                  <Select value={form.state || ""} onChange={set("state")}>
                    <option value="">Select state</option>
                    {[
                      "Maharashtra",
                      "Delhi",
                      "Karnataka",
                      "Tamil Nadu",
                      "Gujarat",
                      "Rajasthan",
                      "Uttar Pradesh",
                      "West Bengal",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Pincode">
                  <Input
                    maxLength={6}
                    value={form.pincode || ""}
                    onChange={set("pincode")}
                  />
                </Field>
              </div>
            </SectionBlock>

            {/* Family Details */}
            <SectionBlock icon="👨‍👩‍👧" title="Family Info">
              <FamilyMembersSection members={members} onChange={setMembers} />
            </SectionBlock>

            {/* Nominee Details */}
            <SectionBlock icon="📝" title="Nominee Info">
              <div className="form-grid-3">
                <Field label="Nominee Name">
                  <Input
                    value={form.nomineeName || ""}
                    onChange={set("nomineeName")}
                  />
                </Field>
                <Field label="Relation">
                  <Select
                    value={form.nomineeRelation || ""}
                    onChange={set("nomineeRelation")}
                  >
                    <option value="">Select</option>
                    <option>Spouse</option>
                    <option>Child</option>
                    <option>Parent</option>
                    <option>Sibling</option>
                    <option>Other</option>
                  </Select>
                </Field>
                <Field label="Share %">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={form.nomineeShare || ""}
                    onChange={set("nomineeShare")}
                  />
                </Field>
              </div>
            </SectionBlock>

            <div className="actions-row">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(isProfile ? "/profile" : "/member")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isProfile ? "Save Profile" : "Update Member"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function kycBanner(type) {
  const colors = {
    green: { background: '#f0fdf4', border: '1.5px solid #86efac' },
    red:   { background: '#fef2f2', border: '1.5px solid #fca5a5' },
    amber: { background: '#fffbeb', border: '1.5px solid #fcd34d' },
  };
  return {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    borderRadius: 8, padding: '12px 14px', marginBottom: 18,
    ...colors[type],
  };
}
