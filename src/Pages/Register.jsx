import { useState } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

// ─── Icon components (คงเดิมทั้งหมด) ─────────────────────────────────────
const EnvelopeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);
const PinIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);
const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Underline Input (คงเดิม) ──────────────────────────────────────
function UnderlineInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  prefixIcon,
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-semibold text-gray-700 tracking-wide uppercase"
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
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full bg-transparent outline-none text-sm text-gray-800 py-2 border-b transition-colors duration-200 placeholder:text-gray-400",
            prefixIcon ? "pl-6" : "pl-0",
            error
              ? "border-b-red-400"
              : focused
                ? "border-b-[#8B1A1A]"
                : "border-b-gray-300",
          ].join(" ")}
        />
      </div>
      {error && <p className="text-[11px] text-red-500 mt-0.5">⚠ {error}</p>}
    </div>
  );
}

// ─── AvatarStack (คงเดิม) ─────────────────────────────────────
function AvatarStack() {
  const avatars = [
    { bg: "#6B4C3B", initials: "JA" },
    { bg: "#3D3D3D", initials: "MK" },
    { bg: "#7A6048", initials: "SR" },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {avatars.map((a, i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border-2 border-[#1a1a1a] flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: a.bg, zIndex: avatars.length - i }}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400 leading-tight">
        Joined by <span className="text-white font-semibold">12,000+</span>{" "}
        elite collectors
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function ALittleBidRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    label: "", // สำหรับที่อยู่
    state: "", //   จังหวัด
    country: "", // ประเทศ
    postalCode: "",
    role: "", // Buyer หรือ Seller
  });

  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  //  Logic สำหรับดึงข้อมูลจาก Google Profile
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    try {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const data = await res.json();

      // Auto-fill ข้อมูลที่ได้จาก Google เข้าไปในฟอร์ม
      setForm((prev) => ({
        ...prev,
        firstName: data.given_name || "",
        lastName: data.family_name || "",
        email: data.email || "",
      }));
    } catch (err) {
      console.error("Fetch Google Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => alert("Google Login Failed"),
  });

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // Validation (คงเดิม)
  function validate() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.username.trim()) e.username = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";
    if (form.password.length < 8) e.password = "At least 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    if (!form.street.trim()) e.street = "Required";
    if (!form.role) e.role = "Please select a role";
    if (!agreed) e.terms = "You must agree to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Handle Manual Submit (คงเดิม)
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // 1. เตรียมข้อมูลให้ตรงกับที่ Controller ใน Backend รอรับ (Flat Structure)
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        street: form.street,
        city: form.city,
        postalCode: form.postalCode,
        label: form.label,
        state: form.state,
        country: form.country,
      };

      // 2. ส่ง Request
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 3. อ่าน Response
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Register failed");
      }

      setSuccess(true);
    } catch (err) {
      console.error("Submit Error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-body     { font-family: 'Jost', sans-serif; }
      `}</style>

      <div className="font-body flex min-h-screen">
        {/* LEFT PANEL (คงเดิม) */}
        <div
          className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 px-10 py-12 relative overflow-hidden"
          style={{ background: "#161412" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 60% 80%, rgba(90,50,30,.35) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-[0.07] pointer-events-none select-none"
            style={{ fontSize: 220 }}
          >
            ⚖
          </div>
          <div className="relative z-10">
            <h1 className="font-display text-3xl font-bold leading-none text-[#B91C1C]">
              A little Bid
            </h1>
            <p className="mt-4 text-[15px] font-light text-gray-400">
              Curating the world's most{" "}
              <span className="text-[#B91C1C]">prestigious</span> collections.
            </p>
          </div>
          <div className="relative z-10 space-y-5">
            <AvatarStack />
            <p className="text-[11px] tracking-widest uppercase text-gray-600">
              © 2024 The Prestigious Gallery. Est. 1894.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-14 min-h-screen"
          style={{ background: "#AEAAA4" }}
        >
          <div className="w-full max-w-[480px] mb-8">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 text-[#8B1A1A]">
              Collector Membership
            </p>
            <h2 className="font-display text-[42px] font-bold leading-[1.1] text-gray-900">
              Begin your <br /> acquisition journey.
            </h2>
          </div>

          {success ? (
            <div className="w-full max-w-[480px] bg-white rounded-sm px-10 py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#639922"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                Welcome to the gallery.
              </h3>
              <p className="text-sm text-gray-500">
                Your collector account has been created.
              </p>
              <Link
                to="/login"
                className="inline-block mt-8 text-sm font-semibold underline text-[#8B1A1A]"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full max-w-[480px] bg-white rounded-sm px-10 py-10 shadow-xl"
            >
              {/* 3. เพิ่มปุ่ม Google Login ด้านบน */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="w-full mb-6 py-3 border border-gray-200 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-[12px] font-semibold tracking-wider text-gray-600 uppercase"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-100"></span>
                </div>
                <span className="relative bg-white px-4 text-[10px] text-gray-400 uppercase tracking-widest">
                  or manually
                </span>
              </div>

              {/* Input Fields (คงเดิม) */}
              <div className="grid grid-cols-2 gap-6 mb-7">
                <UnderlineInput
                  label="First Name"
                  id="firstName"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Julian"
                  error={errors.firstName}
                />
                <UnderlineInput
                  label="Last Name"
                  id="lastName"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Sterling"
                  error={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mb-7">
                <UnderlineInput
                  label="Email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="email@example.com"
                  error={errors.email}
                  prefixIcon={<EnvelopeIcon />}
                />

                <UnderlineInput
                  label="Phone"
                  id="phone"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="081-234-5678"
                  error={errors.phone}
                />

                <UnderlineInput
                  label="Username"
                  id="username"
                  value={form.username}
                  onChange={set("username")}
                  placeholder="robert_s"
                  error={errors.username}
                />
              </div>

              <div className="mb-7">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Account Type
                </p>

                <div className="flex gap-40">
                  {["Buyer", "Seller"].map((roleOption) => (
                    <label
                      key={roleOption}
                      className="flex items-center gap-2 cursor-pointer text-sm capitalize group"
                    >
                      <input
                        type="radio"
                        name="role"
                        className="accent-[#8B1A1A]"
                        value={roleOption}
                        checked={form.role === roleOption}
                        onChange={(e) => {
                          setForm({ ...form, role: e.target.value });
                        }}
                      />
                      {roleOption}
                    </label>
                  ))}
                </div>

                {errors.roles && (
                  <p className="text-[11px] text-red-500 mt-1">
                    {errors.roles}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6 mb-7">
                <UnderlineInput
                  label="Password"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={set("password")}
                  placeholder="••••••••"
                  error={errors.password}
                />
                <UnderlineInput
                  label="Confirm"
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                />
              </div>

              <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide mb-3">
                Address
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-7">
                <UnderlineInput
                  id="street"
                  value={form.street}
                  onChange={set("street")}
                  placeholder="Street"
                  error={errors.street}
                  prefixIcon={<PinIcon />}
                />
                <UnderlineInput
                  id="label"
                  value={form.label}
                  onChange={set("label")}
                  placeholder="Label"
                  prefixIcon={<PinIcon />}
                />
                <UnderlineInput
                  id="state"
                  value={form.state}
                  onChange={set("state")}
                  placeholder="State"
                  prefixIcon={<PinIcon />}
                />
                <UnderlineInput
                  id="city"
                  value={form.city}
                  onChange={set("city")}
                  placeholder="City"
                  prefixIcon={<PinIcon />}
                />
                <UnderlineInput
                  id="country"
                  value={form.country}
                  onChange={set("country")}
                  placeholder="Country"
                  prefixIcon={<PinIcon />}
                />
                <UnderlineInput
                  id="postalCode"
                  value={form.postalCode}
                  onChange={set("postalCode")}
                  placeholder="Postal Code"
                  prefixIcon={<PinIcon />}
                />
              </div>

              <label className="flex items-start gap-3 mb-8 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1 accent-[#8B1A1A]"
                />
                <span className="text-[12px] text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-gray-900 underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-gray-900 underline">
                    Privacy
                  </Link>
                  .
                </span>
              </label>
              {errors.terms && (
                <p className="text-[11px] text-red-500 -mt-6 mb-6">
                  ⚠ {errors.terms}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 text-white text-[11px] font-semibold tracking-[0.2em] uppercase transition-all ${loading ? "bg-[#6B1313] opacity-70 cursor-not-allowed" : "bg-[#8B1A1A] hover:bg-[#6B1313]"}`}
              >
                {loading ? "Processing..." : "Create Collector Account"}
              </button>
            </form>
          )}

          <div className="flex items-center gap-1.5 mt-6 text-[11px] text-[#4B4540]">
            <InfoIcon /> <span>Need assistance with your registration?</span>
          </div>
        </div>
      </div>
    </>
  );
}
