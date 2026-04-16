import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // ดึงอีเมลที่เก็บไว้จาก localStorage
  const email = localStorage.getItem("resetEmail");

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // ยิง API ไปที่ Verify OTP endpoint
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        },
      );

      if (response.status === 200) {
        // เก็บ OTP ไว้ใช้ในขั้นตอนสุดท้าย (Reset Password)
        localStorage.setItem("resetOtp", otp);

        alert("ยืนยันรหัสถูกต้อง!");
        navigate("/reset-password"); // ไปหน้าตั้งรหัสผ่านใหม่
      }
    } catch (error) {
      // กรณีรหัสผิด หรือหมดอายุ
      setErrorMessage(
        error.response?.data?.message || "รหัส OTP ไม่ถูกต้องหรือหมดอายุ",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          ยืนยันรหัส OTP
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          เราได้ส่งรหัส 6 หลักไปที่{" "}
          <span className="font-semibold text-blue-600">{email}</span>
        </p>

        <form onSubmit={handleVerifyOTP}>
          <div className="mb-6">
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              maxLength={6}
              className="w-full px-4 py-3 border-2 rounded-lg text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:border-blue-500 transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))} // รับเฉพาะตัวเลข
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-center text-sm mt-3">
                {errorMessage}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className={`w-full py-3 rounded-lg text-white font-semibold transition duration-200 ${
              isLoading || otp.length < 6
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 shadow-lg"
            }`}
          >
            {isLoading ? "กำลังตรวจสอบ..." : "ยืนยันรหัส"}
          </button>
        </form>

        <button
          onClick={() => navigate("/request-otp")}
          className="w-full mt-4 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          เปลี่ยนอีเมลใหม่
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
