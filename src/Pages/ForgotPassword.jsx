import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

// ─── Constants & API Config ──────────────────────────────
const CRIMSON = "#8B1A1A";
const CRIMSON_DARK = "#6B1313";
const OTP_LEN = 6;
const API_BASE_URL = "http://localhost:5000/api/auth"; // ปรับตามจริง

// ─── Shared helpers (เหมือนเดิม) ───────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 1, label: "Weak", color: "#DC2626" };
  if (s === 2) return { score: 2, label: "Medium", color: "#B45309" };
  return { score: 3, label: "Strong", color: "#166534" };
}

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  return `${local.slice(0, 2)}***@${domain}`;
}

// ─── Icons & Components (เหมือนเดิม) ───────────────────────
const EyeIcon = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path
      d={
        open
          ? "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          : "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"
      }
    />
    <circle cx="12" cy="12" r="3" />
    {!open && <line x1="1" y1="1" x2="23" y2="23" />}
  </svg>
);
const EnvelopeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const Spinner = () => (
  <svg
    style={{ animation: "spin .8s linear infinite" }}
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
);

function UnderlineInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  prefixIcon,
  rightElement,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-semibold tracking-[.12em] uppercase text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefixIcon && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {prefixIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent outline-none text-sm text-gray-800 py-2 border-b transition-colors duration-200 ${prefixIcon ? "pl-5" : "pl-0"} ${rightElement ? "pr-6" : "pr-0"} ${error ? "border-b-red-400" : focused ? "border-b-[#8B1A1A]" : "border-b-gray-300"}`}
        />
        {rightElement && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && <p className="text-[11px] text-red-500 mt-0.5">⚠ {error}</p>}
    </div>
  );
}

function OtpInput({ value, onChange }) {
  const refs = useRef([]);
  const digits = value
    .split("")
    .concat(Array(OTP_LEN).fill(""))
    .slice(0, OTP_LEN);
  const handleChange = (e, i) => {
    const ch = e.target.value.replace(/\D/g, "").slice(-1);
    if (!ch) return;
    const arr = [...digits];
    arr[i] = ch;
    onChange(arr.join(""));
    if (i < OTP_LEN - 1) refs.current[i + 1]?.focus();
  };
  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const arr = [...digits];
      arr[i] = "";
      onChange(arr.join(""));
      if (i > 0) refs.current[i - 1]?.focus();
    }
  };
  return (
    <div className="flex gap-2.5 mb-1">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="flex-1 h-14 text-center text-xl font-semibold bg-transparent outline-none border-b-2 transition-all duration-150"
          style={{ borderBottomColor: d ? CRIMSON : "#D1D5DB" }}
        />
      ))}
    </div>
  );
}

function Countdown({ seconds, onResend }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  if (left <= 0)
    return (
      <p className="text-[11px] text-gray-500 text-center">
        Didn't receive it?{" "}
        <button
          onClick={() => {
            onResend();
            setLeft(seconds);
          }}
          className="font-semibold underline"
          style={{ color: CRIMSON }}
        >
          Resend code
        </button>
      </p>
    );
  return (
    <p className="text-[11px] text-gray-400 text-center">
      Code expires in{" "}
      <span className="font-semibold text-gray-600">
        {String(Math.floor(left / 60)).padStart(2, "0")}:
        {String(left % 60).padStart(2, "0")}
      </span>
    </p>
  );
}

function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-300"
          style={{
            height: 2,
            width: i === current ? 24 : 12,
            borderRadius: 99,
            background: i <= current ? CRIMSON : "#D1D5DB",
          }}
        />
      ))}
      <span className="ml-1 text-[10px] font-medium text-gray-400 tracking-wider uppercase">
        Step {current + 1} of {total}
      </span>
    </div>
  );
}

function PrimaryBtn({ onClick, loading, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-4 text-white text-[10px] font-semibold tracking-[.2em] uppercase transition-colors flex items-center justify-center gap-2"
      style={{
        background: disabled || loading ? "#6B1313" : CRIMSON,
        cursor: disabled || loading ? "not-allowed" : "pointer",
      }}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function ALittleBidForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [resendKey, setResendKey] = useState(0);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    score: pwScore,
    color: pwStrengthColor,
    label: pwStrengthLabel,
  } = getPasswordStrength(newPw);

  // ── API Handlers ──
  async function handleSendOtp() {
    if (!validateEmail(email))
      return setEmailError("Please enter a valid email address");
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setStep(1);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < OTP_LEN) return setOtpError("Please enter 6-digit code");
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code");
      setStep(2);
    } catch (err) {
      setApiError(err.message);
      setOtp("");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    if (newPw !== confirmPw) return setApiError("Passwords do not match");
    setLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword: newPw }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Reset failed");
      }
      setStep(3);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Jost:wght@300;400;600&display=swap'); .font-display{font-family:'Cormorant Garamond',serif} *{font-family:'Jost',sans-serif} @keyframes spin{to{transform:rotate(360deg)}} .fade-up{animation:fadeUp .3s ease forwards} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Left Panel (สไตล์เดิมของคุณ) */}
      <div className="hidden lg:flex flex-col justify-between w-[400px] shrink-0 px-10 py-12 relative overflow-hidden bg-[#161412]">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 75%,rgba(90,50,30,.3) 0%,transparent 70%)",
          }}
        />
        <div className="relative z-10">
          <h1
            className="font-display text-3xl font-bold"
            style={{ color: CRIMSON }}
          >
            A little Bid
          </h1>
          <p className="mt-4 text-[13px] text-gray-400">
            Curating the world's most{" "}
            <span style={{ color: CRIMSON }}>prestigious</span> collections.
          </p>
        </div>
        <div className="relative z-10 text-gray-400 text-[10px] tracking-widest uppercase">
          © 2024 The Prestigious Gallery.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 bg-[#AEAAA4]">
        <div className="w-full max-w-[440px]">
          <div className="mb-6">
            <p className="text-[10px] font-semibold tracking-[.2em] uppercase text-[#8B1A1A] mb-2">
              Account Recovery
            </p>
            <h2 className="font-display text-[36px] font-bold text-gray-900 leading-tight">
              {step === 0 && "Recover your access."}
              {step === 1 && "Verify your identity."}
              {step === 2 && "Set a new password."}
              {step === 3 && "Access restored."}
            </h2>
          </div>

          <div className="bg-white px-10 py-9 shadow-xl fade-up">
            {step < 3 && <StepDots total={3} current={step} />}
            {apiError && (
              <div
                className="mb-5 px-4 py-3 border-l-2 bg-red-50 text-red-800 text-[12px]"
                style={{ borderColor: CRIMSON }}
              >
                {apiError}
              </div>
            )}

            {step === 0 && (
              <div className="space-y-7">
                <UnderlineInput
                  label="Email Address"
                  id="fp-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  error={emailError}
                  prefixIcon={<EnvelopeIcon />}
                />
                <PrimaryBtn onClick={handleSendOtp} loading={loading}>
                  Send Verification Code
                </PrimaryBtn>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <p className="text-[12px] text-gray-500">
                  Code sent to <b>{maskEmail(email)}</b>
                </p>
                <OtpInput value={otp} onChange={setOtp} />
                <Countdown
                  key={resendKey}
                  seconds={120}
                  onResend={handleSendOtp}
                />
                <PrimaryBtn
                  onClick={handleVerifyOtp}
                  loading={loading}
                  disabled={otp.length < OTP_LEN}
                >
                  Verify Code
                </PrimaryBtn>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <UnderlineInput
                  label="New Password"
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  rightElement={
                    <button onClick={() => setShowNew(!showNew)}>
                      <EyeIcon open={showNew} />
                    </button>
                  }
                />
                <UnderlineInput
                  label="Confirm Password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  rightElement={
                    <button onClick={() => setShowConfirm(!showConfirm)}>
                      <EyeIcon open={showConfirm} />
                    </button>
                  }
                />
                <PrimaryBtn
                  onClick={handleReset}
                  loading={loading}
                  disabled={newPw !== confirmPw || pwScore < 2}
                >
                  Reset Password
                </PrimaryBtn>
              </div>
            )}

            {step === 3 && (
              <div className="text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-display text-2xl font-bold">
                  Password updated.
                </h3>
                <PrimaryBtn onClick={() => navigate("/login")}>
                  Return to Login
                </PrimaryBtn>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
