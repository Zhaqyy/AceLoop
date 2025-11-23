import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

import './Slider.scss';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach(key => {
    if (key !== 'constructor' && typeof instance[key] === 'function') {
      instance[key] = instance[key].bind(instance);
    }
  });
}

function getResponsiveItemSize(breakpoints, currentWidth) {
  if (!breakpoints || !Array.isArray(breakpoints) || breakpoints.length === 0) {
    return 1.0;
  }
  
  // Sort breakpoints by maxWidth descending
  const sorted = [...breakpoints].sort((a, b) => (b.maxWidth || Infinity) - (a.maxWidth || Infinity));
  
  // Find first matching breakpoint
  for (const bp of sorted) {
    if (currentWidth <= (bp.maxWidth || Infinity)) {
      return bp.itemSize || 1.0;
    }
  }
  
  return 1.0;
}

function createTextTexture(gl, text, font = 'bold 30px monospace', color = 'black') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.2);
  canvas.width = textWidth + 20;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  constructor({ gl, plane, renderer, text, textColor = '#545050', font = '30px sans-serif' }) {
    autoBind(this);
    this.gl = gl;
    this.plane = plane;
    this.renderer = renderer;
    this.text = text;
    this.textColor = textColor;
    this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.1) discard;
          gl_FragColor = color;
        }
      `,
      uniforms: { tMap: { value: texture } },
      transparent: true
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    bend,
    textColor,
    borderRadius = 0,
    font,
    itemSize = 1.0,
    itemPadding = 2,
    scaleBase = 1500,
    showText = true,
    lazyLoad = false
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.bend = bend;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.itemSize = itemSize;
    this.itemPadding = itemPadding;
    this.scaleBase = scaleBase;
    this.showText = showText;
    this.lazyLoad = lazyLoad;
    this.imageLoaded = false;
    this.createShader();
    this.createMesh();
    if (this.showText) {
      this.createTitle();
    }
    this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        uniform float uSpeed;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          // p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          
          // Smooth antialiasing for edges
          float edgeSmooth = 0.002;
          float alpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          gl_FragColor = vec4(color.rgb, alpha);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uSpeed: { value: 0 },
        uTime: { value: 100 * Math.random() },
        uBorderRadius: { value: this.borderRadius }
      },
      transparent: true
    });
    this.texture = texture;
    
    // Lazy load if enabled, otherwise load immediately
    if (this.lazyLoad) {
      // Will be loaded via intersection observer
      this.shouldLoad = false;
    } else {
      this.loadImage();
    }
  }
  
  loadImage() {
    if (this.imageLoaded) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      this.texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
      this.imageLoaded = true;
    };
    img.onerror = () => {
      console.warn(`Failed to load image: ${this.image}`);
    };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({
      gl: this.gl,
      plane: this.plane,
      renderer: this.renderer,
      text: this.text,
      textColor: this.textColor,
      fontFamily: this.font
    });
  }
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;

    // Lazy loading: check if item is in viewport
    if (this.lazyLoad && !this.imageLoaded) {
      const planeOffset = this.plane.scale.x / 2;
      const viewportOffset = this.viewport.width / 2;
      const isInView = this.plane.position.x + planeOffset > -viewportOffset && 
                       this.plane.position.x - planeOffset < viewportOffset;
      if (isInView && !this.shouldLoad) {
        this.shouldLoad = true;
        this.loadImage();
      }
    }

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
      }
    }
    this.scale = this.screen.height / this.scaleBase;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale * this.itemSize)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale * this.itemSize)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = this.itemPadding;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      textColor = '#ffffff',
      borderRadius = 0,
      font = 'bold 30px',
      scrollSpeed = 2,
      scrollEase = 0.05,
      itemSize = 1.0,
      itemPadding = 2,
      scaleBase = 1500,
      showText = true,
      lazyLoad = false,
      breakpoints = null,
      ariaLabel = 'Image gallery slider'
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.itemSize = itemSize;
    this.itemPadding = itemPadding;
    this.scaleBase = scaleBase;
    this.showText = showText;
    this.lazyLoad = lazyLoad;
    this.breakpoints = breakpoints;
    this.ariaLabel = ariaLabel;
    this.currentItemIndex = 0;
    this.wheelDelta = 0;
    this.wheelTimeout = null;
    this.onCheckDebounce = debounce(this.onCheck, 200);
    
    // Accessibility: Add ARIA attributes
    this.container.setAttribute('role', 'region');
    this.container.setAttribute('aria-label', this.ariaLabel);
    this.container.setAttribute('tabindex', '0');
    this.container.setAttribute('aria-live', 'polite');
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    });
  }
  createMedias(items, bend = 1, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/800/600?grayscale`, text: 'Bridge' },
      { image: `https://picsum.photos/seed/2/800/600?grayscale`, text: 'Desk Setup' },
      { image: `https://picsum.photos/seed/3/800/600?grayscale`, text: 'Waterfall' },
      { image: `https://picsum.photos/seed/4/800/600?grayscale`, text: 'Strawberries' },
      { image: `https://picsum.photos/seed/5/800/600?grayscale`, text: 'Deep Diving' },
      { image: `https://picsum.photos/seed/16/800/600?grayscale`, text: 'Train Track' },
      { image: `https://picsum.photos/seed/17/800/600?grayscale`, text: 'Santorini' },
      { image: `https://picsum.photos/seed/8/800/600?grayscale`, text: 'Blurry Lights' },
      { image: `https://picsum.photos/seed/9/800/600?grayscale`, text: 'New York' },
      { image: `https://picsum.photos/seed/10/800/600?grayscale`, text: 'Good Boy' },
      { image: `https://picsum.photos/seed/21/800/600?grayscale`, text: 'Coastline' },
      { image: `https://picsum.photos/seed/12/800/600?grayscale`, text: 'Palm Trees' }
    ];
    const galleryItems = items && items.length ? items : defaultItems;
    this.mediasImages = galleryItems.concat(galleryItems);
    
    // Get responsive item size
    const responsiveItemSize = this.breakpoints 
      ? getResponsiveItemSize(this.breakpoints, this.screen.width)
      : this.itemSize;
    
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        bend,
        textColor,
        borderRadius,
        font,
        itemSize: responsiveItemSize,
        itemPadding: this.itemPadding,
        scaleBase: this.scaleBase,
        showText: this.showText,
        lazyLoad: this.lazyLoad
      });
    });
  }
  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
  }
  onWheel(e) {
    e.preventDefault();
    
    // Improved wheel detection with momentum
    const delta = e.deltaY || e.wheelDelta || e.detail;
    const normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 120);
    
    // Accumulate wheel delta for smoother scrolling
    this.wheelDelta += normalizedDelta;
    
    // Clear timeout if it exists
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    
    // Apply scroll with momentum
    const scrollAmount = (this.wheelDelta / 120) * this.scrollSpeed * 0.3;
    this.scroll.target += scrollAmount;
    
    // Reset wheel delta after a short delay
    this.wheelTimeout = setTimeout(() => {
      this.wheelDelta = 0;
    }, 150);
    
    this.onCheckDebounce();
  }
  
  onKeyDown(e) {
    // Keyboard navigation for accessibility
    if (!this.medias || !this.medias[0]) return;
    
    const width = this.medias[0].width;
    let newTarget = this.scroll.target;
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        newTarget -= width;
        this.scroll.target = newTarget;
        this.onCheck();
        this.updateAriaLabel();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newTarget += width;
        this.scroll.target = newTarget;
        this.onCheck();
        this.updateAriaLabel();
        break;
      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        this.onCheck();
        this.updateAriaLabel();
        break;
      case 'End':
        e.preventDefault();
        if (this.medias && this.medias.length > 0) {
          const totalWidth = this.medias[0].widthTotal;
          this.scroll.target = -totalWidth / 2;
        }
        this.onCheck();
        this.updateAriaLabel();
        break;
    }
  }
  
  updateAriaLabel() {
    if (!this.medias || !this.medias.length) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width) % (this.mediasImages.length / 2);
    this.currentItemIndex = itemIndex;
    const item = this.mediasImages[itemIndex];
    if (item && item.text) {
      this.container.setAttribute('aria-label', `${this.ariaLabel}, currently viewing: ${item.text}`);
    }
  }
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    
    // Update responsive item size if breakpoints are provided
    if (this.breakpoints && this.medias) {
      const responsiveItemSize = getResponsiveItemSize(this.breakpoints, this.screen.width);
      this.medias.forEach(media => {
        media.itemSize = responsiveItemSize;
        media.onResize({ screen: this.screen, viewport: this.viewport });
      });
    } else if (this.medias) {
      this.medias.forEach(media => media.onResize({ screen: this.screen, viewport: this.viewport }));
    }
  }
  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
    if (this.medias) {
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    
    // Update accessibility label periodically
    if (Math.abs(this.scroll.current - this.scroll.target) < 0.1) {
      this.updateAriaLabel();
    }
    
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnKeyDown = this.onKeyDown.bind(this);
    
    window.addEventListener('resize', this.boundOnResize);
    window.addEventListener('mousewheel', this.boundOnWheel);
    window.addEventListener('wheel', this.boundOnWheel, { passive: false });
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown);
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);
    
    // Accessibility: Keyboard navigation
    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    window.removeEventListener('resize', this.boundOnResize);
    window.removeEventListener('mousewheel', this.boundOnWheel);
    window.removeEventListener('wheel', this.boundOnWheel);
    window.removeEventListener('mousedown', this.boundOnTouchDown);
    window.removeEventListener('mousemove', this.boundOnTouchMove);
    window.removeEventListener('mouseup', this.boundOnTouchUp);
    window.removeEventListener('touchstart', this.boundOnTouchDown);
    window.removeEventListener('touchmove', this.boundOnTouchMove);
    window.removeEventListener('touchend', this.boundOnTouchUp);
    this.container.removeEventListener('keydown', this.boundOnKeyDown);
    if (this.renderer && this.renderer.gl && this.renderer.gl.canvas.parentNode) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

/* eslint-disable react/prop-types */
/**
 * CircularGallery - A 3D WebGL slider component with curved layout
 * @param {Array} items - Array of items with image and text properties
 * @param {number} bend - Curvature amount (0 = flat, higher = more curved)
 * @param {string} textColor - Color of the text labels
 * @param {number} borderRadius - Border radius of items (0-1 range)
 * @param {string} font - Font string for text labels
 * @param {number} scrollSpeed - Scroll speed multiplier
 * @param {number} scrollEase - Easing factor for smooth scrolling (0-1)
 * @param {number} itemSize - Size multiplier for items (1.0 = default, >1 = larger, <1 = smaller)
 * @param {number} itemPadding - Padding/spacing between items
 * @param {number} scaleBase - Base scale divisor for responsive sizing (lower = larger base size)
 * @param {boolean} showText - Whether to show text labels (default: true)
 * @param {boolean} lazyLoad - Enable lazy loading for images (default: false)
 * @param {Array} breakpoints - Responsive breakpoints array: [{maxWidth: 768, itemSize: 0.8}, ...]
 * @param {string} ariaLabel - ARIA label for accessibility (default: 'Image gallery slider')
 */
export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  font = 'bold 30px',
  scrollSpeed = 2,
  scrollEase = 0.05,
  itemSize = 1.0,
  itemPadding = 2,
  scaleBase = 1500,
  showText = true,
  lazyLoad = false,
  breakpoints = null,
  ariaLabel = 'Image gallery slider'
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    const app = new App(containerRef.current, { 
      items, 
      bend, 
      textColor, 
      borderRadius, 
      font, 
      scrollSpeed, 
      scrollEase,
      itemSize,
      itemPadding,
      scaleBase,
      showText,
      lazyLoad,
      breakpoints,
      ariaLabel
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, itemSize, itemPadding, scaleBase, showText, lazyLoad, breakpoints, ariaLabel]);
  return <div className="circular-gallery" ref={containerRef} />;
}
