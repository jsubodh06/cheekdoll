import React, { useRef } from 'react';

interface SwipeOptions {
  onPrev: () => void;
  onNext: () => void;
  threshold?: number;
}

/**
 * Provides unified touch swipe, mouse drag, and horizontal trackpad wheel
 * handlers while preserving native vertical page scrolling.
 */
export function useHorizontalSwipe({
  onPrev,
  onNext,
  threshold = 42,
}: SwipeOptions) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const wheelLock = useRef<number>(0);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - startX.current;
    const dy = touch.clientY - startY.current;
    startX.current = null;
    startY.current = null;

    // Only trigger horizontal navigation when gesture is predominantly horizontal
    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy) * 1.15) {
      if (dx > 0) onPrev();
      else onNext();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return; // handled by touch events for smoother scroll coexistence
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (startX.current === null || startY.current === null) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;
    startX.current = null;
    startY.current = null;

    if (Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) onPrev();
      else onNext();
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    // Only capture deliberate horizontal trackpad/wheel gestures; never block vertical scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.25 && Math.abs(e.deltaX) > 22) {
      const now = Date.now();
      if (now - wheelLock.current < 380) return;
      wheelLock.current = now;
      if (e.deltaX > 0) onNext();
      else onPrev();
    }
  };

  return {
    onTouchStart,
    onTouchEnd,
    onPointerDown,
    onPointerUp,
    onWheel,
  };
}
