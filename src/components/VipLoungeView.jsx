import { useEffect, useRef } from 'react';
import { ArrowLeft, Check } from 'lucide-react';

export default function VipLoungeView({ formData, onLockDoor }) {
  const heading = useRef(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  return (
    <div className="lounge-view">
      <div className="welcome-mark" aria-hidden="true"><Check /></div>
      <h1 ref={heading} tabIndex={-1}>Selamat datang,<br /><span>{formData.username}.</span></h1>
      <p className="welcome-copy">Pintunya terbuka. Silakan masuk dan nikmati suasananya.</p>
      <dl className="guest-details">
        <div><dt>Nama tamu</dt><dd>{formData.username}</dd></div>
        <div><dt>Ruangan Anda</dt><dd>{formData.tier}</dd></div>
      </dl>
      <button type="button" className="primary-button" onClick={onLockDoor}>
        <span>Tutup &amp; kunci pintu</span><ArrowLeft aria-hidden="true" />
      </button>
      <p className="demo-note">Ingin mencoba lagi? Pintu selalu punya cerita baru.</p>
    </div>
  );
}

