/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../ui.scss';

/**
 * TextRing Component - Animated circular text ring using GSAP
 * @param {string} text - Text to display in circular format
 * @param {number} spinDuration - Duration for one full rotation in seconds (default: 20)
 * @param {string} onHover - Hover behavior: 'speedUp', 'slowDown', 'pause', 'goBonkers', or null
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} ref - Forwarded ref for parent component control
 */
const TextRing = ({ text, spinDuration = 20, onHover = 'speedUp', className = '', ...props }, ref) => {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const rotationTimelineRef = useRef(null);
  const currentRotationRef = useRef(0);
  const currentDurationRef = useRef(spinDuration);
  const isHoveringRef = useRef(false);

  const letters = Array.from(text);

  // Initialize letter positions
  useEffect(() => {
    if (!containerRef.current) return;

    // Wait for next frame to ensure DOM is ready and letters are rendered
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) return;

      // Calculate radius based on container size (default 200px, but can be overridden by CSS)
      const containerWidth = containerRef.current.offsetWidth || 200;
      const containerHeight = containerRef.current.offsetHeight || 200;
      const containerCenterX = containerWidth / 2;
      const containerCenterY = containerHeight / 2;
      const radius = Math.min(containerWidth, containerHeight) * 0.4; // 40% of container size

      letters.forEach((_, i) => {
        const letterEl = lettersRef.current[i];
        if (!letterEl) return;

        // Calculate angle for this letter (start from top, going clockwise)
        const angle = (360 / letters.length) * i;
        const angleRad = (angle * Math.PI) / 180;
        
        // Calculate position on circle (x and y from center of container)
        const x = containerCenterX + Math.sin(angleRad) * radius;
        const y = containerCenterY - Math.cos(angleRad) * radius;

        // Set position and rotation
        // Each letter should be rotated to face outward (perpendicular to radius)
        gsap.set(letterEl, {
          x: x,
          y: y,
          xPercent: -50, // Center the letter on its position
          yPercent: -50, // Center the letter on its position
          rotation: angle, // Rotate letter to face outward
          transformOrigin: 'center center',
        });
      });
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [text, letters]);

  // Create and manage rotation animation
  useEffect(() => {
    if (!containerRef.current) return;

    // Kill existing timeline
    if (rotationTimelineRef.current) {
      rotationTimelineRef.current.kill();
    }

    // Get current rotation
    const currentRot = gsap.getProperty(containerRef.current, 'rotation') || currentRotationRef.current;

    // Create new timeline for continuous rotation
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(containerRef.current, {
      rotation: currentRot + 360,
      duration: currentDurationRef.current,
      ease: 'none',
    });

    rotationTimelineRef.current = tl;
    currentRotationRef.current = currentRot + 360;

    return () => {
      if (rotationTimelineRef.current) {
        rotationTimelineRef.current.kill();
      }
    };
  }, [spinDuration, text]);

  const handleHoverStart = () => {
    if (!onHover || !containerRef.current || !rotationTimelineRef.current) return;

    isHoveringRef.current = true;
    const currentRot = gsap.getProperty(containerRef.current, 'rotation') || currentRotationRef.current;
    let newDuration = currentDurationRef.current;
    let scaleVal = 1;

    // Kill current timeline
    rotationTimelineRef.current.kill();

    switch (onHover) {
      case 'slowDown':
        newDuration = spinDuration * 2;
        break;
      case 'speedUp':
        newDuration = spinDuration / 4;
        break;
      case 'pause':
        // Pause animation but keep current rotation
        gsap.to(containerRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
        return;
      case 'goBonkers':
        newDuration = spinDuration / 20;
        scaleVal = 0.8;
        break;
      default:
        newDuration = spinDuration;
    }

    // Create new timeline with updated duration
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(containerRef.current, {
      rotation: currentRot + 360,
      duration: newDuration,
      ease: 'none',
    });

    // Animate scale
    gsap.to(containerRef.current, {
      scale: scaleVal,
      duration: 0.3,
      ease: 'power2.out',
    });

    rotationTimelineRef.current = tl;
    currentDurationRef.current = newDuration;
  };

  const handleHoverEnd = () => {
    if (!containerRef.current || !rotationTimelineRef.current) return;

    isHoveringRef.current = false;
    const currentRot = gsap.getProperty(containerRef.current, 'rotation') || currentRotationRef.current;

    // Kill current timeline
    rotationTimelineRef.current.kill();

    // Reset to normal speed
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(containerRef.current, {
      rotation: currentRot + 360,
      duration: spinDuration,
      ease: 'none',
    });

    // Reset scale
    gsap.to(containerRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });

    rotationTimelineRef.current = tl;
    currentDurationRef.current = spinDuration;
  };

  // Expose ref to parent if needed
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(containerRef.current);
      } else {
        ref.current = containerRef.current;
      }
    }
  }, [ref]);

  // Set initial transform origin (but don't override scale if already set externally)
  useEffect(() => {
    if (!containerRef.current) return;

    const currentScale = gsap.getProperty(containerRef.current, 'scale');
    
    gsap.set(containerRef.current, {
      transformOrigin: '50% 50%',
      rotation: 0,
      // Only set scale if it hasn't been set externally (e.g., by GalleryModal)
      ...(currentScale === undefined || currentScale === null ? { scale: 1 } : {}),
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`text-ring ${className}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      {...props}
    >
      {letters.map((letter, i) => (
        <span
          key={i}
          ref={(el) => {
            lettersRef.current[i] = el;
          }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
};

// Forward ref support
const TextRingWithRef = React.forwardRef(TextRing);
TextRingWithRef.displayName = 'TextRing';
export default TextRingWithRef;
