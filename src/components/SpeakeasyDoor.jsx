import { useEffect, useRef, useState } from 'react';
import { Check, Hand, LoaderCircle } from 'lucide-react';
import { playKnock } from '../utils/soundEffects';
import doorTexture from '../assets/vault-door.jpg';

export default function SpeakeasyDoor({ isDoorOpen, isHatchOpen, onHatchChange, currentFocus, loginStatus, statusMessage }) {
  const [isKnocking, setIsKnocking] = useState(false);
  const knockTimer = useRef(null);
  const eyes = useRef(null);
  const busy = loginStatus === 'checking' || loginStatus === 'success';
  const disabled = busy || isDoorOpen;
  const step = isDoorOpen ? 2 : isHatchOpen || loginStatus === 'error' ? 1 : 0;
  const statusLabel = isDoorOpen ? 'Pintu terbuka' : loginStatus === 'checking' ? 'Sedang memeriksa' : loginStatus === 'success' ? 'Kunci terbuka' : loginStatus === 'error' ? 'Periksa isian Anda' : 'Pintu terkunci';
  const focusX = currentFocus === 'username' ? 5 : currentFocus === 'tier' ? -4 : 0;
  const focusY = currentFocus === 'password' ? 4 : 0;
  const squint = loginStatus === 'error' ? 0.5 : currentFocus === 'password' ? 0.65 : 0.9;

  useEffect(() => () => clearTimeout(knockTimer.current), []);

  const handleKnock = () => {
    if (disabled || isKnocking) return;
    playKnock();
    setIsKnocking(true);
    onHatchChange(true);
    knockTimer.current = setTimeout(() => setIsKnocking(false), 400);
  };

  const trackPointer = (event) => {
    if (event.pointerType !== 'mouse' || currentFocus !== 'idle' || !isHatchOpen || disabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    eyes.current?.style.setProperty('--look-x', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 12}px`);
    eyes.current?.style.setProperty('--look-y', `${((event.clientY - bounds.top) / bounds.height - 0.5) * 7}px`);
  };

  return (
    <div className="door-module">
      <div className="door-stage" onPointerMove={trackPointer} onPointerLeave={() => {
        eyes.current?.style.setProperty('--look-x', '0px');
        eyes.current?.style.setProperty('--look-y', '0px');
      }}>
        <div className={`door-frame ${isDoorOpen ? 'is-open' : ''}`}>
          <div className="door-interior" aria-hidden={!isDoorOpen}>
            <div className="interior-content">
              <span className="interior-rule" />
              <p>The Velvet<br />Lounge</p>
              <span>Silakan masuk.</span>
            </div>
          </div>
          <div className={`door-leaf ${isDoorOpen ? 'door-open' : ''} ${isKnocking ? 'is-knocking' : ''}`}
            style={{ backgroundImage: `url(${doorTexture})` }} inert={isDoorOpen} aria-hidden={isDoorOpen}>
            <div className="door-hinge hinge-top" aria-hidden="true" />
            <div className="door-hinge hinge-bottom" aria-hidden="true" />
            <button type="button" className={`peephole ${isHatchOpen ? 'hatch-open' : ''}`} disabled={disabled}
              onClick={() => onHatchChange(!isHatchOpen)}
              aria-label={isHatchOpen ? 'Tutup lubang intip' : 'Buka lubang intip'}
              aria-expanded={isHatchOpen} aria-controls="door-eyes"
              title={isHatchOpen ? 'Tutup lubang intip' : 'Buka lubang intip'}>
              <span className="peephole-screw screw-left" aria-hidden="true" />
              <span className="peephole-screw screw-right" aria-hidden="true" />
              <span id="door-eyes" className="eyes" ref={eyes} aria-hidden="true" data-tracking={currentFocus === 'idle'}
                style={{ '--focus-x': `${focusX}px`, '--focus-y': `${focusY}px`, '--squint': squint }}>
                {[0, 1].map((eye) => (
                  <span className="eye-blink" key={eye}>
                    <svg className="eye" width="44" height="26" viewBox="0 0 44 26">
                      <ellipse cx="22" cy="13" rx="20" ry="10" fill="#e9e3d4" />
                      <g className="eye-iris">
                        <circle cx="22" cy="13" r="7" fill="#9c7845" />
                        <circle cx="22" cy="13" r="4" fill="#151b16" />
                        <circle cx="20" cy="10.5" r="1.5" fill="#fff" />
                      </g>
                    </svg>
                  </span>
                ))}
              </span>
              <span className="hatch-slider" aria-hidden="true"><span className="hatch-grip" /></span>
            </button>
            <div className="door-handle" aria-hidden="true"><span /></div>
            <button type="button" className="door-knocker" onClick={handleKnock} disabled={disabled}
              aria-label="Ketuk dengan pengetuk pintu" title="Ketuk pintu">
              <span className="knocker-mount" aria-hidden="true" /><span className="knocker-ring" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className={`door-status ${loginStatus === 'error' ? 'status-error' : ''}`} role="status" aria-live="polite" aria-atomic="true">
        {loginStatus === 'checking' ? <LoaderCircle className="spinner" aria-hidden="true" /> : isDoorOpen ? <Check aria-hidden="true" /> : <span className="status-dot" aria-hidden="true" />}
        <span>{statusLabel}</span><span className="sr-only">. {statusMessage}</span>
      </div>
      <button className="knock-button" type="button" onClick={handleKnock} disabled={disabled || isKnocking}>
        <Hand aria-hidden="true" /><span>{isKnocking ? 'Tok, tok, tok…' : 'Ketuk pintu'}</span>
      </button>
      <ol className="entry-steps" aria-label="Langkah masuk">
        {['Ketuk', 'Verifikasi', 'Masuk'].map((label, index) => (
          <li key={label} className={index <= step ? 'step-active' : ''} aria-current={index === step ? 'step' : undefined}>
            <span className="step-dot" aria-hidden="true" /><span><span className="step-number">0{index + 1}</span> {label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

