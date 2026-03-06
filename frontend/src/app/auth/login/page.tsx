export default function LoginPage() {
  return (
    <main className="panel" style={{ maxWidth: 520 }}>
      <h2>Sign In</h2>
      <p className="small">Use email + password. 2FA/OTP is next in roadmap.</p>
      <div className="form-grid" style={{ gridTemplateColumns: "1fr" }}>
        <input className="input" placeholder="Email" />
        <input className="input" type="password" placeholder="Password" />
        <button className="btn brand">Login</button>
      </div>
    </main>
  );
}
