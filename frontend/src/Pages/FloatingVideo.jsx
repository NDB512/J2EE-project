import React, { useState, useRef } from "react";

const FloatingVideo = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const videoRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    const rect = videoRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <video
      ref={videoRef}
      src="/7184640572487.mp4"
      autoPlay
      loop
      muted
      playsInline
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: 200,
        borderRadius: 12,
        zIndex: 9999,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    />
  );
};

export default FloatingVideo;
