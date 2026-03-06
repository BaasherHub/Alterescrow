export default function SignupPage() {
  return (
    <main className="panel" style={{ maxWidth: 620 }}>
      <h2>Create Account</h2>
      <p className="small">Create your account to access custodial P2P wallet and trading.</p>
      <div className="form-grid">
        <input className="input" placeholder="Email" />
        <input className="input" placeholder="Country" />
        <input className="input" type="password" placeholder="Password" />
        <input className="input" type="password" placeholder="Confirm password" />
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="btn brand">Create account</button>
      </div>
    </main>
  );
}
