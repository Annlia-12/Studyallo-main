import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, User } from "firebase/auth";

// 🔹 Firebase config (you can replace with actual keys)
const firebaseConfig = { 
  apiKey: "AIzaSyBAPBBCKBn14iQdee9Te9rjWKzy4WKCVF4",
  authDomain: "studyallo.firebaseapp.com",
  projectId: "studyallo",
  storageBucket: "studyallo.firebasestorage.app",
  messagingSenderId: "678998606280",
  appId: "1:678998606280:web:d0a6607f29a58436e280fd",
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName?: string) => Promise<User>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Create initial test user for setup
  useEffect(() => {
    const createInitialUser = async () => {
      try {
        await createUserWithEmailAndPassword(auth, "test@studyallo.com", "Test1234!");
      } catch (error: any) {
        if (error.code !== "auth/email-already-in-use") {
          console.error("Error creating initial user:", error);
        }
      }
    };
    createInitialUser();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signup = async (email: string, password: string, displayName?: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) await updateProfile(user, { displayName });
  return user;
};


  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
