import React from 'react';
import { X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const photoData = [
  {
    src: '/assets/photo-night-peace.png',
    frame: '/assets/frame-right.png',
    caption: '“!”',
    title: '',
    isVideo: false,
  },
  {
    src: '/assets/photo-mirror-bnw.png',
    frame: '/assets/frame-center.png',
    caption: '“”',
<<<<<<< HEAD
    title: 'Birthday Queen',
=======
    title: '',
>>>>>>> 9442b3e9a0d44535625cb8570868d40aacad17b0
    isVideo: false,
  },
  {
    src: '/assets/memory-video.mp4',
    frame: '/assets/frame-center.png',
    caption: '“”',
    title: '',
    isVideo: true,
  }
];

export default function PhotoModal({ photoIndex, onClose }) {
  if (photoIndex === null || photoIndex === undefined) return null;

  const data = photoData[photoIndex] || photoData[1];

  const handleHeartClick = (e) => {
    e.stopPropagation();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      },
      colors: ['#ff69b4', '#ff85a2', '#ffd1dc', '#ffffff'],
      shapes: ['star', 'circle'],
    });
  };

  return (
    <div className="photo-modal-backdrop" onClick={onClose}>
      <div className="photo-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="modal-frame-wrapper">
          {data.isVideo ? (
            <video
              src={data.src}
              autoPlay
              loop
              muted
              playsInline
              className="modal-photo-img"
              style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
            />
          ) : (
            <img src={data.src} alt={data.title} className="modal-photo-img" />
          )}
        </div>

        <div className="modal-text-content">
          <div className="modal-title-row">
            <h3>{data.title}</h3>
            <button className="modal-heart-btn" onClick={handleHeartClick}>
              <Heart size={20} fill="#ff4d88" color="#ff4d88" />
            </button>
          </div>
          <p className="modal-caption">{data.caption}</p>
        </div>
      </div>
    </div>
  );
}
