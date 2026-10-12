import { useState } from 'react';
import { ArrowRight, ChevronDown, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { accessTiers } from '../utils/access';
import { playKeyTick } from '../utils/soundEffects';

export default function SecretLoginForm({ formData, onChange, onFocusChange, onSubmit, loginStatus, errors, onQuickFill }) {
  const [showPassword, setShowPassword] = useState(false);
  const busy = loginStatus === 'checking' || loginStatus === 'success';

  const changeText = (field, value) => {
    playKeyTick();
    onChange(field, value);
  };

  return (
    <div className="form-view">
      <div className="entry-heading">
        <h1>Ada cerita di<br />balik pintu.</h1>
        <p>Ketuk, kenalkan diri, dan lihat pintunya terbuka.</p>
      </div>
      <form onSubmit={onSubmit} noValidate aria-busy={busy} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onFocusChange('idle');
      }}>
        <fieldset disabled={busy}>
          <div className="form-field">
            <label htmlFor="username">Nama tamu</label>
            <input id="username" name="username" type="text" autoComplete="nickname" maxLength={60}
              value={formData.username} placeholder="Nama panggilan Anda" required
              aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined}
              onFocus={() => onFocusChange('username')} onChange={(event) => changeText('username', event.target.value)} />
            {errors.username && <p id="username-error" className="field-error" role="alert">{errors.username}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="password">Passcode</label>
            <div className="password-control">
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="off" maxLength={128}
                value={formData.password} placeholder="Minimal 4 karakter" required
                aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : 'demo-note'}
                onFocus={() => onFocusChange('password')} onChange={(event) => changeText('password', event.target.value)} />
              <button type="button" className="password-toggle" aria-label={showPassword ? 'Sembunyikan passcode' : 'Tampilkan passcode'} aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </button>
            </div>
            {errors.password && <p id="password-error" className="field-error" role="alert">{errors.password}</p>}
          </div>
          <div className="form-field">
            <label htmlFor="tier">Pilihan ruangan</label>
            <div className="select-control">
              <select id="tier" name="tier" value={formData.tier} aria-invalid={Boolean(errors.tier)} aria-describedby={errors.tier ? 'tier-error' : undefined}
                onFocus={() => onFocusChange('tier')} onChange={(event) => onChange('tier', event.target.value)}>
                {accessTiers.map((tier) => <option key={tier}>{tier}</option>)}
              </select>
              <ChevronDown aria-hidden="true" />
            </div>
            {errors.tier && <p id="tier-error" className="field-error" role="alert">{errors.tier}</p>}
          </div>
          <div className="form-options">
            <label className="remember-option">
              <input type="checkbox" checked={formData.rememberMe} onChange={(event) => onChange('rememberMe', event.target.checked)} />
              <span>Ingat nama saya</span>
            </label>
            <button type="button" className="text-button" onClick={onQuickFill}>Isi contoh</button>
          </div>
          <button type="submit" className="primary-button">
            <span>{loginStatus === 'checking' ? 'Memeriksa passcode…' : loginStatus === 'success' ? 'Membuka pintu…' : 'Buka pintu'}</span>
            {busy ? <LoaderCircle className="spinner" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
          </button>
        </fieldset>
        <p id="demo-note" className="demo-note">Demo interaktif · gunakan passcode apa saja, minimal 4 karakter.</p>
      </form>
    </div>
  );
}

