import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestOTP = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บ Refresh
    setIsLoading(true);
    setMessage("");

    try {
      // 1. ส่ง Request ไปยัง Backend
      const response = await axios.post(
        "http://localhost:5000/api/auth/request-otp",
        { email },
      );

      if (response.status === 200) {
        // 2. เก็บ Email ไว้ใช้ในหน้าถัดไป
        localStorage.setItem("resetEmail", email);

        // 3. แจ้งเตือนและเปลี่ยนหน้า (จะทำงานเมื่อ Backend ตอบกลับมาเท่านั้น)
        alert("ส่งรหัส OTP ไปยังอีเมลของคุณแล้ว!");
        navigate("/verify-otp");
      }
    } catch (error) {
      // จัดการ Error เช่น ไม่พบอีเมลในระบบ หรือ Server ตาย
      setMessage(error.response?.data?.message || "เกิดข้อผิดพลาดในการส่งเมล");
    } finally {
      setIsLoading(false);
    }
  };

  // ลบ hdlVer ออก เพื่อไม่ให้ไปขัดขวางการทำงานของ handleRequestOTP

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          ลืมรหัสผ่าน?
        </h2>
        <p className="text-gray-600 mb-6 text-center text-sm">
          กรอกอีเมลของคุณเพื่อรับรหัส OTP สำหรับตั้งรหัสผ่านใหม่
        </p>

        {/* ใช้ onSubmit เพื่อให้ฟังก์ชันจัดการ API ทำงาน */}
        <form onSubmit={handleRequestOTP}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              อีเมล
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="text-red-500 text-xs mb-4 text-center">{message}</p>
          )}

          <button
            type="submit" // ระบุเป็น submit อย่างเดียว
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                กำลังส่งเมล...
              </div>
            ) : (
              "ส่งรหัส OTP"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestOTP;
