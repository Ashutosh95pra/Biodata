"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { biodata, family, expectations, profile, site } from "../lib/data";

const Rings = dynamic(() => import("../components/Rings"), {
  ssr: false,
  loading: () => null
});

function calculateAge(dateString) {
  const birthDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (beforeBirthday) age -= 1;
  return age;
}

function WhatsAppLink({ className = "", children, message }) {
  const url = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp to send a message"
    >
      {children}
    </a>
  );
}

function FamilyCard({ person }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handlePointerMove(event) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    setTilt({ x: (0.5 - y) * 9, y: (x - 0.5) * 11 });
  }

  return (
    <article
      className="family-card"
      style={{ "--tilt-x": `${tilt.x}deg`, "--tilt-y": `${tilt.y}deg` }}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <span className="family-card__role">{person.role}</span>
      <h3>{person.name}</h3>
      <p>{person.description}</p>
    </article>
  );
}

function PinGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    if (pin === site.pin) {
      try {
        window.sessionStorage.setItem("biodata-unlocked", "true");
      } catch {
        // The current page can still be viewed if browser storage is disabled.
      }
      onUnlock();
      return;
    }
    setError("That PIN didn’t match. Please try again.");
  }

  return (
    <main className="gate">
      <div className="gate__ornament" aria-hidden="true">✳</div>
      <p className="eyebrow">A PRIVATE INVITATION</p>
      <h1>A little about<br />{profile.name}</h1>
      <p className="gate__copy">
        This personal page is shared with family and friends. Enter the PIN to
        continue.
      </p>
      <form className="gate__form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="access-pin">Access PIN</label>
        <input
          id="access-pin"
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={pin}
          onChange={(event) => {
            setPin(event.target.value);
            setError("");
          }}
          placeholder="Enter your PIN"
          aria-describedby={error ? "pin-error" : undefined}
          required
        />
        <button className="button button--gold" type="submit">Enter</button>
        {error && <p className="gate__error" id="pin-error" role="alert">{error}</p>}
      </form>
      <p className="gate__note">Made with care, for the people who matter.</p>
    </main>
  );
}

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState("");
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    try {
      setUnlocked(window.sessionStorage.getItem("biodata-unlocked") === "true");
    } catch {
      setUnlocked(false);
    }
  }, []);

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied("Link copied");
    } catch {
      setCopied("Couldn’t copy automatically. Please copy the page address.");
    }
    window.setTimeout(() => setCopied(""), 3000);
  }

  if (!unlocked) return <PinGate onUnlock={() => setUnlocked(true)} />;

  return (
    <main>
      <header className="site-header">
        <a href="#home" className="wordmark" aria-label={`${profile.name} biodata home`}>
          <span className="wordmark__seal" aria-hidden="true">✳</span>
          <span>Vivah <i>parichay</i></span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#family">Family</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero__copy">
          <p className="eyebrow"><span className="eyebrow__line" /> A JOURNEY, SHARED</p>
          <h1>{profile.name}</h1>
          <p className="hero__tagline">{profile.tagline}</p>
          <div className="hero__meta">
            <span>{calculateAge(profile.dateOfBirth)} years</span>
            <span className="hero__dot" aria-hidden="true">·</span>
            <span>{profile.currentCity}</span>
          </div>
          <div className="hero__actions">
            <WhatsAppLink className="button button--gold" message={site.whatsappMessage}>
              <span aria-hidden="true">↗</span> Message on WhatsApp
            </WhatsAppLink>
            <button className="button button--outline" onClick={() => window.print()}>
              Save as PDF <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
        <div className="hero__portrait" aria-label={`Portrait of ${profile.name}`}>
          <Rings />
          <div className="portrait-frame">
            {!photoFailed ? (
              <Image
                src="/photo.jpg"
                alt={`Portrait of ${profile.name}`}
                fill
                sizes="(max-width: 560px) 72vw, (max-width: 800px) 29vw, 340px"
                unoptimized
                onError={() => setPhotoFailed(true)}
              />
            ) : (
              <div className="portrait-fallback" aria-label={`Initial ${profile.initial}`}>
                <span>{profile.initial}</span>
                <small>YOUR PORTRAIT</small>
              </div>
            )}
          </div>
          <div className="portrait-caption"><span /> {profile.nativePlace}</div>
        </div>
        <a className="hero__scroll" href="#about"><span /> SCROLL TO EXPLORE</a>
      </section>

      <section className="intro-section section-wrap" id="about">
        <div className="section-heading">
          <p className="eyebrow">A LITTLE ABOUT ME</p>
          <h2>Rooted in values.<br /><em>Open to what’s next.</em></h2>
        </div>
        <div className="intro-section__content">
          <p>{biodata.about}</p>
          <div className="hobbies">
            <span className="detail-label">WHEN I’M NOT WORKING</span>
            <div className="hobbies__list">
              {biodata.hobbies.map((hobby) => <span key={hobby}>{hobby}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="details-section section-wrap" aria-labelledby="details-title">
        <div className="section-topline">
          <p className="eyebrow">THE ESSENTIALS</p>
          <span>01 — 04</span>
        </div>
        <h2 className="section-title" id="details-title">A few <em>details</em></h2>
        <dl className="details-grid">
          {biodata.details.map((item) => (
            <div className="detail-item" key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="career-section section-wrap">
        <div className="section-topline">
          <p className="eyebrow">LEARNING & GROWING</p>
          <span>02 — 04</span>
        </div>
        <h2 className="section-title">Education <em>& career</em></h2>
        <div className="career-grid">
          <article className="career-card">
            <span className="career-card__number">01</span>
            <span className="detail-label">EDUCATION</span>
            <h3>{biodata.education}</h3>
          </article>
          <article className="career-card career-card--accent">
            <span className="career-card__number">02</span>
            <span className="detail-label">PROFESSION</span>
            <h3>{biodata.company}</h3>
            <p>{biodata.designation}</p>
          </article>
        </div>
      </section>

      <section className="family-section section-wrap" id="family">
        <div className="section-topline">
          <p className="eyebrow">THE PEOPLE WHO MADE ME</p>
          <span>03 — 04</span>
        </div>
        <div className="family-heading">
          <h2 className="section-title">My <em>family</em></h2>
          <p>Every good story has a circle of people at its heart. These are mine.</p>
        </div>
        <div className="family-groups">
          {family.map((group) => (
            <div className="family-group" key={group.title}>
              <h3 className="family-group__title">{group.title}</h3>
              <div className="family-group__cards">
                {group.members.map((person) => (
                  <FamilyCard key={person.name} person={person} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="partner-section section-wrap">
        <div className="partner-section__ornament" aria-hidden="true">✳</div>
        <p className="eyebrow">A SHARED TOMORROW</p>
        <h2>Looking for <em>my person</em></h2>
        <p className="partner-section__copy">{expectations}</p>
      </section>

      <footer className="contact-section section-wrap" id="contact">
        <div className="contact-section__main">
          <p className="eyebrow">LET’S BEGIN A CONVERSATION</p>
          <h2>Some things are<br /><em>better shared.</em></h2>
          <p>{site.contactMessage}</p>
          <div className="contact-section__actions">
            <WhatsAppLink className="button button--gold" message={site.whatsappMessage}>
              <span aria-hidden="true">↗</span> Message on WhatsApp
            </WhatsAppLink>
            <button className="button button--outline" onClick={copyPageLink}>
              Copy link <span aria-hidden="true">⧉</span>
            </button>
          </div>
          <p className="copy-status" aria-live="polite">{copied}</p>
        </div>
        <div className="contact-section__bottom">
          <span>Made with warmth & intention</span>
          <span>{profile.name} <i>·</i> {new Date().getFullYear()}</span>
        </div>
      </footer>
    </main>
  );
}
