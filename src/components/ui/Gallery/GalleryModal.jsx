/* eslint-disable react/prop-types */
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import TextRing from '../TextRing/TextRing';
import '../ui.scss';

/**
 * GalleryModal Component - Modal preview that follows cursor
 * @param {Object} modal - Modal state object with {active, index}
 * @param {Array} projects - Array of project objects
 */
const GalleryModal = ({ modal, projects }) => {
  const { active, index } = modal;
  const modalContainer = useRef(null);
  const cursor = useRef(null);
  const cursorLabel = useRef(null);
  const modalSlider = useRef(null);

  useEffect(() => {
    if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

    // Move Container - using x and y transforms for better positioning
    let xMoveContainer = gsap.quickTo(modalContainer.current, 'x', {
      duration: 0.8,
      ease: 'power3',
    });
    let yMoveContainer = gsap.quickTo(modalContainer.current, 'y', {
      duration: 0.8,
      ease: 'power3',
    });

    // Move cursor
    let xMoveCursor = gsap.quickTo(cursor.current, 'x', {
      duration: 0.5,
      ease: 'power3',
    });
    let yMoveCursor = gsap.quickTo(cursor.current, 'y', {
      duration: 0.5,
      ease: 'power3',
    });

    // Move cursor label
    let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'x', {
      duration: 0.45,
      ease: 'power3',
    });
    let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'y', {
      duration: 0.45,
      ease: 'power3',
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      xMoveContainer(clientX);
      yMoveContainer(clientY);
      xMoveCursor(clientX);
      yMoveCursor(clientY);
      xMoveCursorLabel(clientX);
      yMoveCursorLabel(clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Animate modal scale and visibility with GSAP
  useEffect(() => {
    if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

    if (active) {
      // Enter animation - set transform origin and scale
      gsap.to(modalContainer.current, {
        scale: 1,
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1],
      });
      gsap.to(cursor.current, {
        scale: 1,
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1],
      });
      gsap.to(cursorLabel.current, {
        scale: 1,
        duration: 0.4,
        ease: [0.76, 0, 0.24, 1],
      });
    } else {
      // Close animation
      gsap.to(modalContainer.current, {
        scale: 0,
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0],
      });
      gsap.to(cursor.current, {
        scale: 0,
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0],
      });
      gsap.to(cursorLabel.current, {
        scale: 0,
        duration: 0.4,
        ease: [0.32, 0, 0.67, 0],
      });
    }
  }, [active]);

  // Animate modal slider position
  useEffect(() => {
    if (!modalSlider.current) return;

    gsap.to(modalSlider.current, {
      top: `${index * -100}%`,
      duration: 0.05,
      ease: 'sine.out',
    });
  }, [index]);

  // Set initial state
  useEffect(() => {
    if (!modalContainer.current || !cursor.current || !cursorLabel.current) return;

    // Set initial position and scale
    gsap.set(modalContainer.current, {
      scale: 0,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(cursor.current, {
      scale: 0,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
    });
    gsap.set(cursorLabel.current, {
      scale: 0,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
    });
  }, []);

  return (
    <>
      <div ref={modalContainer} className="gallery-modal-container">
        <div ref={modalSlider} className="gallery-modal-slider">
          {projects.map((project, idx) => {
            const { src, color } = project;
            return (
              <div
                key={`modal_${idx}`}
                className="gallery-modal"
                style={{ backgroundColor: color }}
              >
                <img src={`${src}`} alt={project.title || 'Gallery image'} />
              </div>
            );
          })}
        </div>
      </div>
      <TextRing
        ref={cursor}
        text="♠View♠Services"
        spinDuration={20}
        onHover="pause"
        className="gallery-cursor"
      />
      <div ref={cursorLabel} className="gallery-cursor-label">
      ♠
      </div>
    </>
  );
};

export default GalleryModal;

