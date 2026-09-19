import React from 'react';

export default function PhoneContainer({ children }) {
  return (
    <div className="phone-wrapper">
      <div className="phone-screen-card">
        {/* Interactive Screen Content (Keychains & Balloons) */}
        <div className="screen-content">
          {children}
        </div>
      </div>
    </div>
  );
}


