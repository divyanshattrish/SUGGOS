import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/* ─────────────────────────────────────────
   GLOBAL CSS — animations + responsive
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1);   opacity: 1; }
  }

  .su-shake { animation: shake 0.4s ease; }

  .su-field input:focus,
  .su-field input:focus-visible {
    outline: none;
    border-color: var(--rose) !important;
    box-shadow: 0 0 0 3px rgba(232,146,124,0.15);
  }

  .su-checkbox-row input[type="checkbox"] {
    accent-color: var(--rose);
  }

  .su-submit-btn:hover:not(:disabled) {
    background: #d97f68 !important;
  }
  .su-submit-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  .su-refresh-captcha:hover {
    transform: rotate(60deg);
  }

  @media (max-width: 520px) {
    .su-card { padding: 2.2rem 1.5rem !important; }
    .su-title { font-size: 1.7rem !important; }
  }
`;

function useInjectStyle(css) {
  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = css;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, [css]);
}

/* ─────────────────────────────────────────
   API base
───────────────────────────────────────── */
const API_BASE = 'http://localhost:5000/api/auth';

/* ─────────────────────────────────────────
   MATH CAPTCHA
───────────────────────────────────────── */
function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
}

/* ─────────────────────────────────────────
   PASSWORD STRENGTH HELPER
───────────────────────────────────────── */
function getPasswordStrength(pw) {
  if (!pw) return { label: '', pct: 0, color: '#E8E0D8' };
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: 'Weak', pct: 25, color: '#D9534F' };
  if (score <= 3) return { label: 'Okay', pct: 60, color: '#E8A23C' };
  return { label: 'Strong', pct: 100, color: '#5FA86A' };
}

/* ─────────────────────────────────────────
   SIGNUP PAGE
───────────────────────────────────────── */
export default function SignupPage() {
  useInjectStyle(GLOBAL_CSS);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    captchaInput: '',
    notRobot: false,
  });

  const [usernameStatus, setUsernameStatus] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [shakeKey, setShakeKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const debounceRef = useRef(null);

  const checkUsername = useCallback((value) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value || value.length < 3) {
      setUsernameStatus(value ? 'invalid' : null);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/check-username/${encodeURIComponent(value)}`);
        const data = await res.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch {
        setUsernameStatus(null);
      }
    }, 450);
  }, []);

  function handleChange(field, value) {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: null }));
    setServerError('');
    if (field === 'username') checkUsername(value);
  }

  function refreshCaptcha() {
    setCaptcha(generateCaptcha());
    setForm(f => ({ ...f, captchaInput: '', notRobot: false }));
  }

  function triggerShake() {
    setShakeKey(k => k + 1);
  }

  function validate() {
    const errs = {};

    if (!form.username || form.username.length < 3) {
      errs.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      errs.username = 'Only letters, numbers, and underscores allowed';
    } else if (usernameStatus === 'taken') {
      errs.username = 'This username is already taken';
    }

    if (!form.email) {
      errs.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (form.confirmPassword !== form.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    if (Number(form.captchaInput) !== captcha.answer) {
      errs.captcha = 'Incorrect answer — try again';
    }

    if (!form.notRobot) {
      errs.notRobot = 'Please confirm you are not a robot';
    }

    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      triggerShake();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          captchaAnswer: form.captchaInput,
          captchaExpected: captcha.answer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.');
        refreshCaptcha();
        triggerShake();
        setSubmitting(false);
        return;
      }

      localStorage.setItem('suggos_token', data.token);
      localStorage.setItem('suggos_user', JSON.stringify(data.user));
      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (err) {
      setServerError('Could not reach the server. Is the backend running?');
      triggerShake();
      setSubmitting(false);
    }
  }

  const strength = getPasswordStrength(form.password);

  if (success) {
    return (
      <div style={s.page}>
        <div style={{ ...s.card, textAlign: 'center', animation: 'popIn 0.4s ease' }} className="su-card">
          <div style={s.successIcon}>✓</div>
          <h2 style={s.title} className="su-title">Welcome to SugGos!</h2>
          <p style={s.subtitle}>Your account has been created. Taking you home…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div
        key={shakeKey}
        className={`su-card${shakeKey ? ' su-shake' : ''}`}
        style={s.card}
      >
        <Link to="/" style={s.logo}>
          Sug<span style={{ color: 'var(--rose)' }}>Gos</span>
        </Link>

        <h1 style={s.title} className="su-title">Create your account</h1>
        <p style={s.subtitle}>Sign up to save your room redesigns and shopping lists.</p>

        {serverError && <div style={s.serverErrorBox}>{serverError}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* USERNAME */}
          <div className="su-field">
            <label style={s.label}>Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={form.username}
                onChange={e => handleChange('username', e.target.value)}
                placeholder="e.g. chirag_designs"
                style={{ ...s.input, ...(errors.username ? s.inputError : {}) }}
                autoComplete="username"
              />
              {usernameStatus && (
                <span style={s.statusIcon}>
                  {usernameStatus === 'checking' && <span style={s.spinner} />}
                  {usernameStatus === 'available' && <span style={{ color: '#5FA86A' }}>✓</span>}
                  {usernameStatus === 'taken' && <span style={{ color: '#D9534F' }}>✗</span>}
                  {usernameStatus === 'invalid' && <span style={{ color: '#D9534F' }}>✗</span>}
                </span>
              )}
            </div>
            {usernameStatus === 'available' && !errors.username && (
              <div style={s.hintGood}>Username is available</div>
            )}
            {errors.username && <div style={s.hintError}>{errors.username}</div>}
          </div>

          {/* EMAIL */}
          <div className="su-field">
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              style={{ ...s.input, ...(errors.email ? s.inputError : {}) }}
              autoComplete="email"
            />
            {errors.email && <div style={s.hintError}>{errors.email}</div>}
          </div>

          {/* PASSWORD */}
          <div className="su-field">
            <label style={s.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => handleChange('password', e.target.value)}
                placeholder="At least 6 characters"
                style={{ ...s.input, ...(errors.password ? s.inputError : {}), paddingRight: '2.8rem' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={s.eyeBtn}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div style={s.strengthRow}>
                <div style={s.strengthTrack}>
                  <div style={{ ...s.strengthFill, width: `${strength.pct}%`, background: strength.color }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
              </div>
            )}
            {errors.password && <div style={s.hintError}>{errors.password}</div>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="su-field">
            <label style={s.label}>Confirm password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={e => handleChange('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                style={{ ...s.input, ...(errors.confirmPassword ? s.inputError : {}), paddingRight: '2.8rem' }}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(v => !v)}
                style={s.eyeBtn}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {form.confirmPassword && form.confirmPassword === form.password && (
              <div style={s.hintGood}>Passwords match</div>
            )}
            {errors.confirmPassword && <div style={s.hintError}>{errors.confirmPassword}</div>}
          </div>

          {/* MATH CAPTCHA */}
          <div className="su-field">
            <label style={s.label}>Quick check</label>
            <div style={s.captchaRow}>
              <div style={s.captchaBox}>
                {captcha.a} + {captcha.b} = ?
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={form.captchaInput}
                onChange={e => handleChange('captchaInput', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Answer"
                style={{ ...s.captchaInput, ...(errors.captcha ? s.inputError : {}) }}
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="su-refresh-captcha"
                style={s.refreshBtn}
                title="New question"
              >
                ↻
              </button>
            </div>
            {errors.captcha && <div style={s.hintError}>{errors.captcha}</div>}
          </div>

          {/* I AM NOT A ROBOT CHECKBOX */}
          <label className="su-checkbox-row" style={s.checkboxRow}>
            <input
              type="checkbox"
              checked={form.notRobot}
              onChange={e => {
                const mathCorrect = Number(form.captchaInput) === captcha.answer;
                if (e.target.checked && !mathCorrect) {
                  setErrors(err => ({ ...err, notRobot: 'Solve the math question above first' }));
                  triggerShake();
                  return;
                }
                handleChange('notRobot', e.target.checked);
              }}
              style={s.checkbox}
            />
            <span style={s.checkboxLabel}>I am not a robot</span>
          </label>
          {errors.notRobot && <div style={s.hintError}>{errors.notRobot}</div>}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={submitting}
            className="su-submit-btn"
            style={s.submitBtn}
          >
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={s.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={s.footerLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STYLES
───────────────────────────────────────── */
const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1.2rem',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: 'var(--dark2)',
    borderRadius: 24,
    padding: '3rem 2.6rem',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
    animation: 'fadeUp 0.4s ease',
  },
  logo: {
    display: 'block',
    textAlign: 'center',
    fontFamily: 'var(--serif)',
    fontSize: '1.4rem',
    fontWeight: 500,
    color: 'var(--ivory)',
    textDecoration: 'none',
    marginBottom: '1.6rem',
  },
  title: {
    fontFamily: 'var(--serif)',
    fontSize: '1.9rem',
    fontWeight: 400,
    color: 'var(--ivory)',
    textAlign: 'center',
    marginBottom: '0.5rem',
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: '0.86rem',
    color: 'var(--stone-light)',
    textAlign: 'center',
    marginBottom: '2rem',
    lineHeight: 1.6,
    fontWeight: 300,
  },
  serverErrorBox: {
    background: 'rgba(217,83,79,0.12)',
    border: '1px solid rgba(217,83,79,0.35)',
    color: '#E89490',
    fontSize: '0.82rem',
    padding: '0.7rem 1rem',
    borderRadius: 10,
    marginBottom: '1.2rem',
    lineHeight: 1.5,
  },
  label: {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--stone-light)',
    marginBottom: '0.45rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.9rem',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--ivory)',
    fontSize: '0.9rem',
    fontFamily: 'var(--sans)',
    transition: 'border-color 0.15s ease',
  },
  inputError: {
    borderColor: 'rgba(217,83,79,0.6)',
  },
  statusIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  spinner: {
    display: 'inline-block',
    width: 13,
    height: 13,
    border: '2px solid rgba(255,255,255,0.2)',
    borderTopColor: 'var(--rose)',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  eyeBtn: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    padding: '0.3rem',
    lineHeight: 1,
  },
  hintError: {
    fontSize: '0.74rem',
    color: '#E89490',
    marginTop: '0.4rem',
  },
  hintGood: {
    fontSize: '0.74rem',
    color: '#5FA86A',
    marginTop: '0.4rem',
  },
  strengthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginTop: '0.5rem',
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    borderRadius: 100,
    background: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 100,
    transition: 'width 0.25s ease, background 0.25s ease',
  },
  captchaRow: {
    display: 'flex',
    gap: '0.6rem',
    alignItems: 'center',
  },
  captchaBox: {
    background: 'rgba(232,146,124,0.1)',
    border: '1px solid rgba(232,146,124,0.3)',
    borderRadius: 10,
    padding: '0.75rem 1rem',
    color: 'var(--rose-light)',
    fontWeight: 600,
    fontSize: '0.95rem',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--serif)',
  },
  captchaInput: {
    flex: 1,
    padding: '0.75rem 0.9rem',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: 'var(--ivory)',
    fontSize: '0.9rem',
    fontFamily: 'var(--sans)',
    minWidth: 0,
  },
  refreshBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    width: 40,
    height: 40,
    flexShrink: 0,
    color: 'var(--stone-light)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.25s ease',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: '0.85rem',
    color: 'var(--ivory)',
  },
  submitBtn: {
    background: 'var(--rose)',
    color: '#fff',
    border: 'none',
    borderRadius: 100,
    padding: '0.9rem',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'var(--sans)',
    marginTop: '0.4rem',
    transition: 'background 0.15s ease',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.84rem',
    color: 'var(--stone-light)',
    marginTop: '1.8rem',
  },
  footerLink: {
    color: 'var(--rose-light)',
    fontWeight: 600,
    textDecoration: 'none',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'rgba(95,168,106,0.15)',
    border: '2px solid #5FA86A',
    color: '#5FA86A',
    fontSize: '1.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.2rem',
  },
};
