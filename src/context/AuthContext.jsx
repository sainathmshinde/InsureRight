import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const MOCK_USERS = {
  "sainath@kmdastur.com": {
    id: "b1",
    role: "broker",
    password: "broker@123",
    name: "Sainath Shinde",
    company: "K.M. Dastur & Co. Insurance Brokers Pvt. Ltd.",
    irdaiNo: "CB-456/2008",
    phone: "9812345678",
    email: "sainath@kmdastur.com",
    city: "Mumbai",
    state: "Maharashtra",
    avatar: "SS",
    address: "14, Horniman Circle, Fort, Mumbai - 400001",
    gst: "27AABCK1234M1Z5",
    pan: "AABCK1234M",
    established: "1968",
    type: "Partnership",
  },
  "pooja@kmdastur.com": {
    id: "a2",
    role: "agent",
    agentType: "calling",
    password: "agent@123",
    name: "Pooja Desai",
    company: "K.M. Dastur & Co.",
    phone: "9812345678",
    email: "pooja@kmdastur.com",
    brokerId: "b1",
    avatar: "PD",
    // posLicense: 'POS-2023-019', qualification: 'Post Graduate', experience: '3',
  },
  "ravi@kmdastur.com": {
    id: "a1",
    role: "agent",
    agentType: "sales",
    password: "sales@123",
    name: "Ravi Kulkarni",
    company: "K.M. Dastur & Co.",
    phone: "9876543210",
    email: "ravi@kmdastur.com",
    brokerId: "b1",
    avatar: "RK",
    // posLicense: 'POS-2023-001', qualification: 'Graduate', experience: '4',
  },
  "aarav@gmail.com": {
    id: "c1",
    role: "customer",
    password: "cust@123",
    name: "Aarav Sharma",
    phone: "9876543210",
    email: "aarav@gmail.com",
    brokerId: "b1",
    avatar: "AS",
    dob: "15/03/1990",
    gender: "Male",
    city: "Mumbai",
    state: "Maharashtra",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (identifier, password) => {
    const key = identifier.toLowerCase().trim();
    const u =
      MOCK_USERS[key] ??
      Object.values(MOCK_USERS).find(
        (u) => u.phone === key || u.name.toLowerCase() === key,
      );
    if (!u || u.password !== password)
      return { ok: false, error: "Invalid credentials" };
    const { password: _, ...safe } = u;
    setUser(safe);
    return { ok: true, user: safe };
  };

  const logout = () => setUser(null);

  const register = (data) => {
    const initials = data.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const newUser = {
      id: `b_${Date.now()}`,
      role: "broker",
      name: data.name,
      email: data.email,
      company: data.companyName,
      irdaiNo: data.irdaiNo,
      phone: data.mobile,
      city: data.city,
      state: data.state,
      avatar: initials,
      address: data.address1,
      gst: data.gst,
      pan: data.pan,
      type: data.businessType,
    };
    setUser(newUser);
    return { ok: true, user: newUser };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
