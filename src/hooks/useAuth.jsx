// useAuth.js — Custom Hook สำหรับจัดการ Authentication State
//
// Hook นี้ทำหน้าที่:
//   1. เก็บ user ที่ login อยู่ใน localStorage (persist ข้าม session)
//   2. expose ฟังก์ชัน login, logout ให้ component ต่างๆ ใช้ได้
//   3. จัดการ loading state ขณะ restore auth จาก storage

import { useState, useEffect, useCallback } from "react";

// key สำหรับเก็บใน localStorage
const AUTH_KEY = "auth_user";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user จาก localStorage เมื่อ app เริ่มต้น
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(AUTH_KEY); // ล้างถ้า data เสีย
    } finally {
      setLoading(false);
    }
  }, []);

  // login: บันทึก user ลง state และ localStorage
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  }, []);

  // logout: ลบ user ออกจาก state และ localStorage
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return { user, loading, login, logout };
}
