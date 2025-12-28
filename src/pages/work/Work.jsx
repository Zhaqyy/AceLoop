import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getWorkById } from '@/data/works/works';
import Heading from '@/components/ui/Heading/Heading';
import { Button } from '@/components/ui';
import './Work.scss';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Work = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const work = getWorkById(id);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!work) {
      navigate('/');
      return;
    }

    if (!containerRef.current || !imageRef.current || !contentRef.current) return;

    // Animate hero image
    gsap.fromTo(
      imageRef.current,
      {
        scale: 1.2,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      }
    );

    // Animate content
    gsap.fromTo(
      contentRef.current,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      }
    );

    // Parallax effect on scroll
    gsap.to(imageRef.current, {
      y: -100,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [work, navigate]);

  if (!work) {
    return null;
  }

  return (
    <div ref={containerRef} className="work-page">
      <div className="work-hero" style={{ backgroundColor: work.color }}>
        <div className="work-hero-image" ref={imageRef}>
          <img src={work.src} alt={work.title} />
        </div>
      </div>

      <div className="work-content">
        <div ref={contentRef} className="work-content-inner">
          <div className="work-header">
            <div className="work-meta">
              <span className="work-category">{work.category}</span>
              <span className="work-year">{work.year}</span>
              <span className="work-client">{work.client}</span>
            </div>
            <Heading
              mainHeading={work.title}
              subHeading={work.description}
              alignLeft={true}
            />
          </div>

          <div className="work-details">
            <div className="work-details-content">
              <p className="work-description">{work.details}</p>
              
              <div className="work-tags">
                {work.tags.map((tag, index) => (
                  <span key={index} className="work-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="work-gallery">
              {work.images.map((image, index) => (
                <div key={index} className="work-gallery-item">
                  <img src={image} alt={`${work.title} - Image ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="work-actions">
            <Button variant="underline-arrow" to="/">
              Back to Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;

