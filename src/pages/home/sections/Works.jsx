import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Heading from '@/components/ui/Heading/Heading';
import { works } from '@/data/works/works';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Works = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);


  return (
    <section ref={sectionRef} className="works">
      <div className="works-container">
        <div ref={headingRef} className="works-heading">
          <Heading
            labelText="Portfolio"
            mainHeading="Our Featured<br/>Works"
            subHeading="Explore our collection of beautifully crafted projects that showcase our expertise and passion for design."
            alignLeft={true}
          />
        </div>
        <div ref={gridRef} className="works-grid-wrapper">
          <div className="works-grid">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// WorkCard Component - Individual work card
/* eslint-disable react/prop-types */
const WorkCard = ({ work }) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || !imageRef.current || !overlayRef.current || !footerRef.current) return;

    const card = cardRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    const footer = footerRef.current;

    const handleMouseEnter = () => {
      gsap.to(image, {
        scale: 1.025,
        duration: 0.05,
        ease: 'power2.in',
      });
      // Bottom overlay animates in
      gsap.to(overlay, {
        opacity: 0.5,
        duration: 0.3,
        ease: 'power2.out',
      });
      // Footer animates in
      gsap.fromTo(
        footer,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
        }
      );
    };

    const handleMouseLeave = () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.05,
        ease: 'power2.in',
      });
      // Bottom overlay animates out
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
      // Footer animates out
      gsap.to(footer, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: 'power2.in',
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link
      ref={cardRef}
      to={`/work/${work.id}`}
      className="works-grid-card"
      style={{ backgroundColor: work.color }}
    >
      <div className="works-grid-card-image-wrapper">
        <img
          ref={imageRef}
          src={work.src}
          alt={work.title}
          className="works-grid-card-image"
        />
        <div className="works-grid-card-overlay-top" />
        <div ref={overlayRef} className="works-grid-card-overlay-bottom" />
      </div>
      
      <div className="works-grid-card-content">
        <div className="works-grid-card-header">
          <span className="works-grid-card-category">{work.category}</span>
          <span className="works-grid-card-client">{work.client}</span>
        </div>
        
        <h2 className="works-grid-card-title">{work.title}</h2>
        
        <div ref={footerRef} className="works-grid-card-footer">
          <span className="works-grid-card-tags">{work.tags.join(', ')}</span>
          <span className="works-grid-card-year">{work.year}</span>
        </div>
      </div>
    </Link>
  );
};

export default Works;

