import React, { useEffect, useMemo, useRef, useState } from "react";

function LoaderCustom({ text = "Preparing insights...", onElapsed }) {
  const jokes = useMemo(
    () => [
      "Syncing with stakeholders, even the imaginary ones.",
      "Building a deck-worthy insight, one loading frame at a time.",
      "Reassuring the data before leadership asks tough questions.",
      "Preparing numbers that can survive a Monday review call.",
      "Aligning charts, metrics, and executive expectations.",
      "Turning raw numbers into something everyone can nod at confidently.",
      "Running a quick pre-meeting confidence check on the data.",
      "Making the dashboard look busy before the budget discussion starts.",
      "Optimizing for clarity, speed, and management-friendly storytelling.",
      "Polishing insights until they sound expensive.",
      "Giving the charts just enough confidence for the steering committee.",
      "Formatting results for maximum approval probability.",
      "Adding strategic alignment to whatever the data was already saying.",
      "Preparing something suitably impressive for the next review meeting.",
      "Reducing chaos into a format that fits on one slide.",
      "Checking whether the metrics are ready for senior management visibility.",
      "Turning analysis into something that feels action-oriented.",
      "Making sure the graphs look confident, even under questioning.",
      "Creating the illusion that this loaded instantly.",
      "Rehearsing the insights before they meet the leadership team.",
      "Organizing the numbers into a more promotion-friendly arrangement.",
      "Making the results look calm, structured, and meeting-safe.",
      "Adding just enough polish to pass the executive glance test.",
      "Preparing a version of reality suitable for presentation mode.",
      "Finalizing insights for optimum head-nodding in review meetings."
    ],
    []
  );

  const [currentJoke, setCurrentJoke] = useState(jokes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentJoke((prev) => {
        const filtered = jokes.filter((item) => item !== prev);
        return filtered[Math.floor(Math.random() * filtered.length)];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [jokes]);

  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => {
      clearInterval(timer);
      if (onElapsed) onElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    };
  }, [onElapsed]);

  const formatElapsed = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <>
      <div className="rr-loader-shell">
        <div className="rr-loader-card">
          <div className="rr-loader-animation-wrap">
            <div className="rr-loader-orbit rr-loader-orbit-1"></div>
            <div className="rr-loader-orbit rr-loader-orbit-2"></div>
            <div className="rr-loader-core">
              <div className="rr-loader-dot rr-loader-dot-1"></div>
              <div className="rr-loader-dot rr-loader-dot-2"></div>
              <div className="rr-loader-dot rr-loader-dot-3"></div>
            </div>
          </div>

          <h3 className="rr-loader-title">{text}</h3>

          <p className="rr-loader-subtitle">
            Please wait while we prepare your results.
          </p>

          <p className="rr-loader-elapsed">
            Elapsed: {formatElapsed(elapsed)}
          </p>

          <div className="rr-loader-joke-box">
            <span className="rr-loader-joke-label">While we work</span>
            <p className="rr-loader-joke-text mb-0">{currentJoke}</p>
          </div>
        </div>
      </div>

      <style>{`
        .rr-loader-shell {
          width: 100%;
          min-height: 52vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
        }

        .rr-loader-card {
          width: min(100%, 760px);
          border: 1px solid var(--rr-border);
          background: linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          border-radius: 16px;
          padding: 34px 28px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .rr-loader-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.04) 18%,
            transparent 36%
          );
          transform: translateX(-100%);
          animation: rrLoaderShine 3.2s linear infinite;
          pointer-events: none;
        }

        .rr-loader-animation-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rr-loader-orbit {
          position: absolute;
          border-radius: 50%;
          border: 3px solid rgba(13, 124, 102, 0.12);
        }

        .rr-loader-orbit-1 {
          width: 120px;
          height: 120px;
          border-top-color: #0D7C66;
          border-right-color: rgba(13, 124, 102, 0.4);
          animation: rrRotate 2.6s linear infinite;
        }

        .rr-loader-orbit-2 {
          width: 86px;
          height: 86px;
          border-color: rgba(23, 162, 184, 0.12);
          border-top-color: #17A2B8;
          border-right-color: rgba(23, 162, 184, 0.4);
          animation: rrRotateReverse 1.9s linear infinite;
        }

        .rr-loader-core {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(13, 124, 102, 0.28), rgba(13, 124, 102, 0.12));
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 0 16px rgba(13, 124, 102, 0.15), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .rr-loader-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #0D7C66;
          animation: rrPulse 1.2s ease-in-out infinite;
        }

        .rr-loader-dot-2 {
          animation-delay: 0.18s;
        }

        .rr-loader-dot-3 {
          animation-delay: 0.36s;
        }

        .rr-loader-title {
          margin: 0;
          color: var(--rr-text-main);
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.45rem;
          font-weight: 800;
          letter-spacing: 0.2px;
        }

        .rr-loader-subtitle {
          margin: 10px 0 0;
          color: var(--rr-text-muted);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 400;
          line-height: 1.65;
        }

        .rr-loader-elapsed {
          margin: 8px 0 0;
          color: var(--rr-accent, #0D7C66);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.3px;
        }

        .rr-loader-joke-box {
          margin-top: 24px;
          padding: 22px 20px 18px;
          border-radius: 16px;
          border: 1px solid var(--rr-border);
          background:
            radial-gradient(circle at top left, rgba(13, 124, 102, 0.10), transparent 38%),
            radial-gradient(circle at bottom right, rgba(23, 162, 184, 0.08), transparent 42%),
            linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
          box-shadow: var(--rr-shadow);
          position: relative;
          overflow: hidden;
        }

        .rr-loader-joke-box::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            115deg,
            transparent 0%,
            rgba(255,255,255,0.05) 18%,
            transparent 36%
          );
          transform: translateX(-120%);
          animation: rrJokeShine 3.8s linear infinite;
          pointer-events: none;
        }

        .rr-loader-joke-label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
          padding: 7px 14px;
          border-radius: 999px;
          background: linear-gradient(135deg, rgba(13, 124, 102, 0.18) 0%, rgba(23, 162, 184, 0.14) 100%);
          border: 1px solid rgba(13, 124, 102, 0.22);
          color: var(--rr-accent, #0D7C66);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .rr-loader-joke-text {
          color: var(--rr-text-main);
          font-family: 'Inter', system-ui, sans-serif;
          font-size: 1.03rem;
          font-weight: 700;
          line-height: 1.8;
          margin: 0;
          animation: rrFadeInUp 0.4s ease;
          max-width: 620px;
          margin-left: auto;
          margin-right: auto;
        }

        @keyframes rrJokeShine {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @keyframes rrFadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rrRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes rrRotateReverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }

        @keyframes rrPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        @keyframes rrLoaderShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Dark mode: green → teal */
        [data-rr-theme="dark"] .rr-loader-orbit {
          border-color: rgba(23, 162, 184, 0.12);
        }
        [data-rr-theme="dark"] .rr-loader-orbit-1 {
          border-top-color: #17A2B8;
          border-right-color: rgba(23, 162, 184, 0.4);
        }
        [data-rr-theme="dark"] .rr-loader-orbit-2 {
          border-color: rgba(32, 201, 151, 0.12);
          border-top-color: #20c997;
          border-right-color: rgba(32, 201, 151, 0.4);
        }
        [data-rr-theme="dark"] .rr-loader-core {
          background: radial-gradient(circle at 30% 30%, rgba(23, 162, 184, 0.28), rgba(32, 201, 151, 0.12));
          box-shadow: 0 0 16px rgba(23, 162, 184, 0.15), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        [data-rr-theme="dark"] .rr-loader-dot {
          background: #17A2B8;
        }
        [data-rr-theme="dark"] .rr-loader-elapsed {
          color: #17A2B8;
        }
        [data-rr-theme="dark"] .rr-loader-joke-box {
          background:
            radial-gradient(circle at top left, rgba(23, 162, 184, 0.10), transparent 38%),
            radial-gradient(circle at bottom right, rgba(32, 201, 151, 0.08), transparent 42%),
            linear-gradient(180deg, var(--rr-bg-panel) 0%, var(--rr-bg-soft) 100%);
        }
        [data-rr-theme="dark"] .rr-loader-joke-label {
          background: linear-gradient(135deg, rgba(23, 162, 184, 0.18) 0%, rgba(32, 201, 151, 0.14) 100%);
          border-color: rgba(23, 162, 184, 0.22);
          color: #17A2B8;
        }
      `}</style>
    </>
  );
}

export default LoaderCustom;