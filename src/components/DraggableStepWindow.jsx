import React, { useState, useEffect, useRef } from 'react';
import { Move, Minus, Maximize2, Minimize2, X } from 'lucide-react';

export default function DraggableStepWindow({ passageRef, iframeUrl, onClose, lang = 'nl' }) {
  const isEn = lang === 'en';
  const windowRef = useRef(null);
  const [position, setPosition] = useState({
    x: Math.max(10, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 680),
    y: 85
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mouse Drag Handler
  const handleMouseDown = (e) => {
    if (isMaximized || isMinimized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  // Touch Drag Handler for Tablets & Phones
  const handleTouchStart = (e) => {
    if (isMaximized || isMinimized || !e.touches[0]) return;
    setIsDragging(true);
    setDragOffset({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(5, Math.min(window.innerWidth - 120, e.clientX - dragOffset.x));
      const newY = Math.max(5, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches[0]) return;
      const newX = Math.max(5, Math.min(window.innerWidth - 120, e.touches[0].clientX - dragOffset.x));
      const newY = Math.max(5, Math.min(window.innerHeight - 80, e.touches[0].clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  if (isMinimized) {
    return (
      <div className="draggable-step-minimized" onClick={() => setIsMinimized(false)}>
        <span className="minimized-title">📖 STEP Bible — {passageRef}</span>
        <button type="button" className="minimized-btn" aria-label={isEn ? "Maximize window" : "Herstel venster"}>
          <Maximize2 size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={windowRef}
      className={`draggable-step-window ${isMaximized ? 'maximized' : ''}`}
      style={isMaximized ? {} : { top: `${position.y}px`, left: `${position.x}px` }}
    >
      {/* Draggable Header Bar (Mouse & Touch Enabled) */}
      <div
        className="step-window-header"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        title={isEn ? "Click or touch and drag to move window" : "Klik/raak aan en sleep om venster te verplaatsen"}
      >
        <div className="header-title-group">
          <Move size={16} className="drag-handle-icon" />
          <span className="step-window-title">STEP Bible — {passageRef}</span>
        </div>
        <div
          className="step-window-actions"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="window-btn"
            onClick={() => setIsMinimized(true)}
            title={isEn ? "Minimize" : "Minimaliseren"}
          >
            <Minus size={14} />
          </button>
          <button
            type="button"
            className="window-btn"
            onClick={() => setIsMaximized(!isMaximized)}
            title={isEn ? "Maximize" : "Maximaliseren"}
          >
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            type="button"
            className="window-btn window-btn-close"
            onClick={onClose}
            title={isEn ? "Close" : "Sluiten"}
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* iFrame Content Area */}
      <div className={`step-window-body ${isDragging ? 'dragging' : ''}`}>
        <iframe
          src={iframeUrl}
          title="STEP Bible Floating Window"
          className="draggable-step-iframe"
          allowFullScreen
        />
      </div>
    </div>
  );
}
