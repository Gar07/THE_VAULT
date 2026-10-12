import { useEffect, useRef, useState } from 'react';
import { DoorClosed, Volume2, VolumeX } from 'lucide-react';
import SpeakeasyDoor from './components/SpeakeasyDoor';
import SecretLoginForm from './components/SecretLoginForm';
import VipLoungeView from './components/VipLoungeView';
import { accessTiers, validateEntry } from './utils/access';
import {
  getSoundEnabled, setSoundEnabled as configureSound,
  playUnlock, playDoorOpen, playDoorClose, playHatchSlide,
} from './utils/soundEffects';

const savedNameKey = 'the-vault.guest-name';

function initialForm() {
  let username = '';
  try { username = localStorage.getItem(savedNameKey)?.slice(0, 60) || ''; } catch { /* Storage may be disabled. */ }
  return { username, password: '', tier: accessTiers[0], rememberMe: Boolean(username) };
}

export default function App() {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isHatchOpen, setIsHatchOpen] = useState(false);
  const [currentFocus, setCurrentFocus] = useState('idle');
  const [loginStatus, setLoginStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('Ketuk pintu untuk menyapa penjaga.');
  const [soundEnabled, setSoundEnabled] = useState(getSoundEnabled);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const timer = useRef(null);
  const entryPanel = useRef(null);
  const busy = loginStatus === 'checking' || loginStatus === 'success';

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleHatchChange = (open) => {
    if (busy || isDoorOpen) return;
    setIsHatchOpen(open);
    if (open !== isHatchOpen) playHatchSlide();
    setStatusMessage(open ? 'Penjaga siap. Silakan kenalkan diri.' : 'Ketuk pintu untuk menyapa penjaga.');
  };

  const handleFocusChange = (field) => {
    if (busy) return;
    setCurrentFocus(field);
    if (field !== 'idle') {
      if (!isHatchOpen) playHatchSlide();
      setIsHatchOpen(true);
    }
    const messages = {
      username: 'Penjaga memperhatikan nama Anda.',
      password: 'Penjaga menunggu passcode Anda.',
      tier: 'Pilih ruangan yang ingin Anda masuki.',
      idle: 'Penjaga siap. Silakan kenalkan diri.',
    };
    if (loginStatus !== 'error') setStatusMessage(messages[field]);
  };

  const handleChange = (field, value) => {
    if (busy) return;
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    if (field === 'rememberMe' && !value) {
      try { localStorage.removeItem(savedNameKey); } catch { /* Storage may be disabled. */ }
    }
    if (loginStatus === 'error') {
      setLoginStatus('idle');
      setStatusMessage('Coba lagi, penjaga masih menunggu.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (timer.current !== null || isDoorOpen) return;
    const nextErrors = validateEntry(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setLoginStatus('error');
      if (!isHatchOpen) playHatchSlide();
      setIsHatchOpen(true);
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      setStatusMessage('Belum bisa masuk. Periksa isian Anda.');
      return;
    }

    setLoginStatus('checking');
    setStatusMessage('Sebentar, penjaga sedang memeriksa…');
    if (!isHatchOpen) playHatchSlide();
    setIsHatchOpen(true);
    setCurrentFocus('idle');

    // shortcut: verification is a local demo, use server authentication before protecting real data.
    timer.current = setTimeout(() => {
      setLoginStatus('success');
      setStatusMessage('Silakan masuk. Pintu sedang dibuka.');
      playUnlock();
      timer.current = setTimeout(() => {
        playDoorOpen();
        setIsDoorOpen(true);
        setStatusMessage('Pintu terbuka. Selamat datang di dalam.');
        try {
          if (formData.rememberMe) localStorage.setItem(savedNameKey, formData.username.trim());
          else localStorage.removeItem(savedNameKey);
        } catch { /* The animation works without storage. */ }
        setFormData((previous) => ({ ...previous, username: previous.username.trim(), password: '' }));
        timer.current = null;
      }, 450);
    }, 800);
  };

  const handleLockDoor = () => {
    clearTimeout(timer.current);
    timer.current = null;
    playDoorClose();
    setIsDoorOpen(false);
    setIsHatchOpen(false);
    setLoginStatus('idle');
    setCurrentFocus('idle');
    setErrors({});
    setStatusMessage('Pintu kembali terkunci. Sampai jumpa.');
    setFormData((previous) => ({ ...previous, password: '' }));
    requestAnimationFrame(() => entryPanel.current?.focus({ preventScroll: true }));
  };

  const handleQuickFill = () => {
    if (busy || isDoorOpen) return;
    setFormData((previous) => ({ ...previous, username: 'Alex Vance', password: 'VaultPass2026', tier: accessTiers[0] }));
    setErrors({});
    setLoginStatus('idle');
    if (!isHatchOpen) playHatchSlide();
    setIsHatchOpen(true);
    setStatusMessage('Contoh terisi. Coba buka pintunya.');
  };

  const toggleSound = () => {
    configureSound(!soundEnabled);
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#entry">Langsung ke formulir</a>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="The Vault, beranda">
          <DoorClosed aria-hidden="true" strokeWidth={1.3} />
          <span>THE VAULT</span>
        </a>
        <div className="header-actions">
          <span>Secret Heaven.</span>
          <button className="sound-toggle" onClick={toggleSound} aria-label={soundEnabled ? 'Matikan suara' : 'Aktifkan suara'} aria-pressed={soundEnabled} title={soundEnabled ? 'Matikan suara' : 'Aktifkan suara'}>
            {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main className="entry-layout">
        <SpeakeasyDoor
          isDoorOpen={isDoorOpen} isHatchOpen={isHatchOpen}
          onHatchChange={handleHatchChange} currentFocus={currentFocus}
          loginStatus={loginStatus} statusMessage={statusMessage}
        />
        <section className="entry-panel" id="entry" ref={entryPanel} tabIndex={-1} aria-label="Akses pintu">
          {isDoorOpen ? (
            <VipLoungeView formData={formData} onLockDoor={handleLockDoor} />
          ) : (
            <SecretLoginForm formData={formData} onChange={handleChange}
              onFocusChange={handleFocusChange} onSubmit={handleSubmit}
              loginStatus={loginStatus} errors={errors} onQuickFill={handleQuickFill} />
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span className="footer-brand">THE VAULT</span>
        <span>Gilbert Aldrich Rumahorbo.</span>
      </footer>
    </div>
  );
}

