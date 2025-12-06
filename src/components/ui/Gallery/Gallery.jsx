/* eslint-disable react/prop-types */
import { useState } from 'react';
import GalleryItem from './GalleryItem';
import GalleryModal from './GalleryModal';
import '../ui.scss';

/**
 * Gallery Component - A reusable hover gallery with modal preview
 * @param {Array} projects - Array of project objects with {title, src, color, description?}
 * @param {string} className - Additional CSS classes
 */
const Gallery = ({ projects = [], className = '' }) => {
  const [modal, setModal] = useState({ active: false, index: 0 });

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className={`gallery ${className}`.trim()}>
      <div className="gallery-body">
        {projects.map((project, index) => (
          <GalleryItem
            key={index}
            index={index}
            title={project.title}
            description={project.description}
            setModal={setModal}
          />
        ))}
      </div>
      <GalleryModal modal={modal} projects={projects} />
    </div>
  );
};

export default Gallery;

/*
 ============================================
 HOW TO USE THIS COMPONENT
 ============================================

 // Example 1: Basic usage with projects array
 const projects = [
   {
     title: "C2 Montreal",
     src: "c2montreal.png",
     color: "#000000",
     description: "Design & Development"
   },
   {
     title: "Office Studio",
     src: "officestudio.png",
     color: "#8C8C8C",
     description: "Design & Development"
   }
 ];

 <Gallery projects={projects} />

 // Example 2: With custom className
 <Gallery 
   projects={projects} 
   className="custom-gallery-class"
 />

 // Example 3: Projects array structure
 // Each project object should have:
 // - title: string (required) - The project title
 // - src: string (required) - Image filename (will be loaded from /images/)
 // - color: string (required) - Background color for modal preview
 // - description: string (optional) - Project description, defaults to "Design & Development"
*/
