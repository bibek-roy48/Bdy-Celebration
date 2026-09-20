import React, { useRef } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';
import './InstagramGlassLink.css';

/**
 * Modern Glassmorphic Instagram Social Link Component
 *
 * @param {string} href - Instagram profile URL
 * @param {string} username - Display handle / username
 * @param {string} label - Subtitle label (e.g. 'Birthday VIP', 'Instagram')
 * @param {string} variant - 'badge' (pill with handle) | 'compact' (round icon button)
 * @param {string} position - 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-left' | 'top-right'
 * @param {boolean} floating - Whether to automatically position as floating down side
 * @param {Function} onSparkle - Optional parent sparkle callback
 */
export default function InstagramGlassLink({
  href = "https://www.instagram.com/__bizzz___?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
  username = "@__bizzz__",
  label = "Instagram",
  variant = "badge",
  floating = false,
  position = "bottom-left",
  onSparkle,
  className = "",
  style = {},
}) {
  const linkRef = useRef(null);

  const handleClick = () => {
    // Play celebratory sound if available
    try {
      if (sounds && typeof sounds.playPop === 'function') {
        sounds.playPop();
      }
    } catch {
      // Audio fallback safe
    }

    // Trigger sweet mini confetti burst around the icon
    if (linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 16,
        spread: 45,
        origin: { x, y },
        colors: ['#e1306c', '#f77737', '#833ab4', '#fd1d1d', '#ffd1dc'],
        shapes: ['circle', 'star'],
        scalar: 0.8,
        ticks: 80,
      });

      if (onSparkle) {
        onSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
  };

  const isCompact = variant === 'compact';
  const floatClass = floating ? `instagram-floating-${position}` : '';

  return (
    <div
      className={`instagram-glass-wrapper ${floatClass} ${className}`}
      style={style}
    >
      <a
        ref={linkRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`instagram-glass-card ${isCompact ? 'variant-compact' : ''}`}
        title={`Visit ${username} on Instagram`}
        aria-label={`Open Instagram profile for ${username}`}
      >
        {/* Modern Instagram Gradient Orb with Icon */}
        <div className="instagram-icon-orb">
          <span className="instagram-icon-ring" />
          {/* Custom crisp vector Instagram camera icon */}
          <svg
            width={isCompact ? 14 : 16}
            height={isCompact ? 14 : 16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </div>

        {/* Handle and Title (hidden in compact variant) */}
        {!isCompact && (
          <>
            <div className="instagram-glass-text">
              <span className="instagram-glass-handle">
                {username}
                <Sparkles size={11} color="#e1306c" className="instagram-sparkle-icon" />
              </span>
              <span className="instagram-glass-subtitle">{label}</span>
            </div>

            {/* Micro subtle external arrow */}
            <div className="instagram-glass-arrow">
              <ArrowUpRight size={13} strokeWidth={2.4} />
            </div>
          </>
        )}
      </a>
    </div>
  );
}
