import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      setLoading(true);
      await signup(form.email.trim(), form.password, form.name.trim());
      navigate("/"); // redirect after signup
    } catch (e: any) {
      setErr(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 px-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-600 mb-6">It only takes a minute.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-700">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {err && <div className="text-sm text-red-600">{err}</div>}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-xl py-2.5 font-semibold disabled:opacity-60">
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
        </div>
      </motion.div>
    </div>
  );
}
