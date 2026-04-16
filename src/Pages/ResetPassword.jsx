import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ดึงค่าที่เก็บไว้มาจากขั้นตอนที่ 1 และ 2
  const email = localStorage.getItem("resetEmail");
  const otp = localStorage.getItem("resetOtp");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // 1. ตรวจสอบว่ารหัสผ่านตรงกันไหม
    if (newPassword !== confirmPassword) {
      return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
    }

    // 2. ตรวจสอบความยาวรหัสผ่าน (ตัวอย่าง: 6 ตัวขึ้นไป)
    if (newPassword.length < 6) {
      return setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
    }

    setIsLoading(true);

    try {
      // 3. ยิง API ขั้นตอนสุดท้าย
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          otp,
          newPassword,
        },
      );

      if (response.status === 200) {
        alert("เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");

        // 4. ล้างข้อมูลชั่วคราวทิ้งให้หมดเพื่อความปลอดภัย
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetOtp");

        // 5. กลับไปหน้า Login
        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          ตั้งรหัสผ่านใหม่
        </h2>
        <p className="text-gray-500 mb-6 text-center text-sm">
          สร้างรหัสผ่านใหม่ที่ปลอดภัยสำหรับบัญชีของคุณ
        </p>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
