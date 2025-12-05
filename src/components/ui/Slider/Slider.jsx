import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';

import '../ui.scss';

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
      generateMipmaps: true,
      premultiplyAlpha: false
    });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      blendFunc: {
        src: this.gl.SRC_ALPHA,
        dst: this.gl.ONE_MINUS_SRC_ALPHA
      },
      blend: true,
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
          float borderAlpha = 1.0 - smoothstep(-edgeSmooth, edgeSmooth, d);
          
          // Combine texture alpha with border alpha for proper transparency
          float finalAlpha = color.a * borderAlpha;
          
          gl_FragColor = vec4(color.rgb, finalAlpha);
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
    // Check if we want a true 360° ring (bend >= 360 or special value)
    const isFullRing = this.bend >= 360 || this.bend === -360;
    
    if (isFullRing) {
      // True 360° ring calculation
      // Calculate radius based on viewport to ensure items fit in view
      const H = Math.min(this.viewport.width, this.viewport.height) / 2;
      // Use itemPadding to control ring radius (acts as radius multiplier)
      // itemPadding = 1: tight ring (30% of viewport)
      // itemPadding = 5: medium ring (50% of viewport)  
      // itemPadding = 10: wide ring (70% of viewport)
      // Higher values = larger radius
      const radiusMultiplier = Math.max(0.2, Math.min(0.9, 0.2 + (this.itemPadding / 10) * 0.5));
      const radius = H * radiusMultiplier;
      
      // Calculate angle for this item based on its index
      // Each item gets an equal portion of the circle
      const anglePerItem = (2 * Math.PI) / this.length;
      const baseAngle = this.index * anglePerItem;
      
      // Add scroll rotation to animate the ring
      // Convert scroll position to rotation angle (negated for correct direction)
      const scrollRotation = -(scroll.current / this.width) * anglePerItem;
      const angle = baseAngle + scrollRotation;
      
      // Position items in a perfect circle (centered at origin)
      this.plane.position.x = Math.sin(angle) * radius;
      this.plane.position.y = -Math.cos(angle) * radius;
      this.plane.position.z = 0;
      
      // Rotate plane so top of image faces the center (inward)
      // angle points to the item's position, so we add PI to flip it to face center
      this.plane.rotation.z = angle + Math.PI;
      this.plane.rotation.y = 0;
    } else {
      // Original linear/arc calculation
      this.plane.position.x = this.x - scroll.current - this.extra;
      const x = this.plane.position.x;
      const H = this.viewport.width / 2;

      if (this.bend === 0) {
        this.plane.position.y = 0;
        this.plane.rotation.z = 0;
      } else {
        // Original arc calculation for partial curves
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

    // Skip wrapping logic for full ring mode (it's already circular)
    if (!(this.bend >= 360 || this.bend === -360)) {
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
      images,
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
      ariaLabel = 'Image gallery slider',
      seamlessScroll = false, // When true, slider responds to scroll without preventing default
      disableSnap = false, // When true, disables snapping to items for smooth continuous scrolling
      inertiaDeceleration = 0.95 // Friction factor for inertia (0.95 = 5% reduction per frame, only used when disableSnap is true)
    } = {}
  ) {
    document.documentElement.classList.remove('no-js');
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.disableSnap = disableSnap;
    // Use smoother easing when snap is disabled for more fluid motion
    const effectiveEase = this.disableSnap ? Math.max(scrollEase, 0.08) : scrollEase;
    this.scroll = { ease: effectiveEase, current: 0, target: 0, last: 0 };
    this.itemSize = itemSize;
    this.itemPadding = itemPadding;
    this.scaleBase = scaleBase;
    this.showText = showText;
    this.lazyLoad = lazyLoad;
    this.breakpoints = breakpoints;
    this.ariaLabel = ariaLabel;
    this.seamlessScroll = seamlessScroll;
    this.currentItemIndex = 0;
    this.wheelDelta = 0;
    this.wheelTimeout = null;
    this.onCheckDebounce = debounce(this.onCheck, 200);
    this.lastWheelTime = 0;
    this.momentumActive = false;
    this.momentumDeceleration = inertiaDeceleration; // Friction factor for inertia
    this.lastTouchTime = 0;
    this.lastTouchDistance = 0;
    this.isInView = false;
    this.isHovered = false;
    this.isPaused = false;
    this.intersectionObserver = null;
    this.scrollListener = null;
    
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
    this.createMedias(items, images, bend, textColor, borderRadius, font);
    this.setupIntersectionObserver();
    this.update();
    this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    
    // Enable proper blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Ensure canvas fills container
    const canvas = this.gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    
    this.container.appendChild(canvas);
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
  createMedias(items, images, bend = 1, textColor, borderRadius, font) {
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
    
    // Normalize images prop to items format
    let normalizedItems = null;
    if (images && images.length) {
      normalizedItems = images.map(img => {
        if (typeof img === 'string') {
          return { image: img, text: '' };
        } else if (img && typeof img === 'object' && img.image) {
          return { image: img.image, text: img.text || '' };
        }
        return null;
      }).filter(item => item !== null);
    }
    
    // Use images if provided, otherwise items, otherwise defaultItems
    const galleryItems = normalizedItems || (items && items.length ? items : defaultItems);
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
    // Only handle touch if slider is in view
    if (!this.isInView) return;
    
    // Check if touch is within container bounds
    const rect = this.container.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    
    if (
      touch.clientX < rect.left ||
      touch.clientX > rect.right ||
      touch.clientY < rect.top ||
      touch.clientY > rect.bottom
    ) {
      return;
    }
    
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = touch.clientX;
  }
  onTouchMove(e) {
    if (!this.isDown || !this.isInView) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
    
    // Track velocity for momentum on touch (only if snap is disabled)
    if (this.disableSnap) {
      const now = Date.now();
      const timeDelta = now - (this.lastTouchTime || now);
      if (timeDelta > 0) {
        const currentDistance = (this.start - x) * (this.scrollSpeed * 0.025);
        const previousDistance = this.lastTouchDistance || 0;
        const distanceDelta = currentDistance - previousDistance;
        this.scroll.velocity = distanceDelta / (timeDelta / 16); // Normalize to 60fps
        this.lastTouchTime = now;
        this.lastTouchDistance = currentDistance;
      }
      this.momentumActive = false; // Reset momentum during active drag
    }
  }
  onTouchUp() {
    if (!this.isDown) return;
    this.isDown = false;
    
    // Start momentum if there's significant velocity (only if snap is disabled)
    if (this.disableSnap) {
      if (Math.abs(this.scroll.velocity) > 0.1) {
        this.momentumActive = true;
      } else {
        this.scroll.velocity = 0;
      }
    }
    
    this.lastTouchTime = 0;
    this.lastTouchDistance = 0;
    
    if (!this.disableSnap && !this.momentumActive) {
      this.onCheck();
    }
  }
  onWheel(e) {
    // Seamless scroll mode: respond to scroll without preventing default
    if (this.seamlessScroll) {
      if (!this.isInView) {
        return;
      }
      
      // Check if mouse is over container
      const rect = this.container.getBoundingClientRect();
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      if (
        mouseX < rect.left ||
        mouseX > rect.right ||
        mouseY < rect.top ||
        mouseY > rect.bottom
      ) {
        return;
      }
      
      // Don't prevent default - allow page to scroll
      // But still update slider based on scroll delta
      const delta = e.deltaY || e.wheelDelta || e.detail;
      const normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 120);
      
      // Accumulate wheel delta for smoother scrolling
      this.wheelDelta += normalizedDelta;
      
      // Clear timeout if it exists
      if (this.wheelTimeout) {
        clearTimeout(this.wheelTimeout);
      }
      
    // Apply scroll with momentum (reduced sensitivity for seamless mode)
    const scrollAmount = (this.wheelDelta / 120) * this.scrollSpeed * 0.15;
    this.scroll.target += scrollAmount;
    
    // Track velocity for inertia (only if snap is disabled)
    if (this.disableSnap) {
      const now = Date.now();
      const timeDelta = now - this.lastWheelTime || 16; // Default to 60fps if first event
      this.scroll.velocity = scrollAmount / (timeDelta / 16); // Normalize to 60fps
      this.lastWheelTime = now;
      this.momentumActive = false; // Reset momentum when actively scrolling
    }
    
    // Reset wheel delta after a short delay
    this.wheelTimeout = setTimeout(() => {
      this.wheelDelta = 0;
      // Start momentum when wheel stops (only if snap is disabled)
      if (this.disableSnap && Math.abs(this.scroll.velocity) > 0.01) {
        this.momentumActive = true;
      }
    }, 150);
    
    // Only snap if not disabled
    if (!this.disableSnap) {
      this.onCheckDebounce();
    }
    return;
    }
    
    // Original behavior: prevent default when hovering
    // Only handle scroll if slider is in view and mouse is over the container
    if (!this.isInView || !this.isHovered) {
      return;
    }
    
    // Check if the event target is within the container
    const rect = this.container.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    if (
      mouseX < rect.left ||
      mouseX > rect.right ||
      mouseY < rect.top ||
      mouseY > rect.bottom
    ) {
      return;
    }
    
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
    // Use smoother, more direct scrolling when snap is disabled
    const sensitivity = this.disableSnap ? 0.4 : 0.3;
    const scrollAmount = (this.wheelDelta / 120) * this.scrollSpeed * sensitivity;
    this.scroll.target += scrollAmount;
    
    // Track velocity for inertia (only if snap is disabled)
    if (this.disableSnap) {
      const now = Date.now();
      const timeDelta = now - this.lastWheelTime || 16; // Default to 60fps if first event
      this.scroll.velocity = scrollAmount / (timeDelta / 16); // Normalize to 60fps
      this.lastWheelTime = now;
      this.momentumActive = false; // Reset momentum when actively scrolling
    }
    
    // Reset wheel delta after a short delay (shorter for smoother feel when snap disabled)
    const resetDelay = this.disableSnap ? 100 : 150;
    this.wheelTimeout = setTimeout(() => {
      this.wheelDelta = 0;
      // Start momentum when wheel stops (only if snap is disabled)
      if (this.disableSnap && Math.abs(this.scroll.velocity) > 0.01) {
        this.momentumActive = true;
      }
    }, resetDelay);
    
    // Only snap if not disabled
    if (!this.disableSnap) {
      this.onCheckDebounce();
    }
  }
  
  onPageScroll() {
    // In seamless mode, optionally respond to page scroll when in view
    // This is disabled by default to prioritize wheel events
    // Can be enabled if you want slider to progress with page scroll
    if (!this.seamlessScroll || !this.isInView) {
      return;
    }
    
    // Only update if there's no recent wheel activity
    // This prevents conflicts between wheel and page scroll
    if (this.wheelDelta !== 0) {
      return;
    }
    
    const rect = this.container.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;
    
    // Calculate slider center position
    const sliderCenter = rect.top + rect.height / 2;
    
    // Only respond when slider center is near viewport center
    const distanceFromCenter = Math.abs(sliderCenter - viewportCenter);
    const maxDistance = viewportHeight * 0.6; // Only respond when within 60% of viewport
    
    if (distanceFromCenter > maxDistance) {
      return;
    }
    
    // Calculate scroll progress based on position relative to viewport center
    const scrollProgress = Math.max(0, Math.min(1, 
      1 - (distanceFromCenter / maxDistance)
    ));
    
    // Map scroll progress to slider position (subtle effect)
    if (this.medias && this.medias[0]) {
      const totalWidth = this.medias[0].widthTotal;
      const targetPosition = -scrollProgress * totalWidth * 0.3; // Reduced multiplier for subtlety
      // Smoothly interpolate to avoid jarring movements
      this.scroll.target = lerp(this.scroll.target, targetPosition, 0.05);
    }
  }
  
  setupIntersectionObserver() {
    // Use Intersection Observer to detect when slider enters/leaves viewport
    const options = {
      root: null,
      rootMargin: '50px', // Start checking slightly before entering viewport
      threshold: 0.1 // Trigger when 10% visible
    };
    
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isInView = entry.isIntersecting;
        if (!this.isInView) {
          // Reset wheel delta when leaving view
          this.wheelDelta = 0;
        }
      });
    }, options);
    
    this.intersectionObserver.observe(this.container);
    
    // In seamless mode, also listen to page scroll
    if (this.seamlessScroll) {
      this.scrollListener = this.onPageScroll.bind(this);
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    }
  }
  
  onMouseEnter() {
    this.isHovered = true;
  }
  
  onMouseLeave() {
    this.isHovered = false;
    // Reset wheel delta when mouse leaves
    this.wheelDelta = 0;
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
        if (!this.disableSnap) {
          this.onCheck();
        }
        this.updateAriaLabel();
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newTarget += width;
        this.scroll.target = newTarget;
        if (!this.disableSnap) {
          this.onCheck();
        }
        this.updateAriaLabel();
        break;
      case 'Home':
        e.preventDefault();
        this.scroll.target = 0;
        if (!this.disableSnap) {
          this.onCheck();
        }
        this.updateAriaLabel();
        break;
      case 'End':
        e.preventDefault();
        if (this.medias && this.medias.length > 0) {
          const totalWidth = this.medias[0].widthTotal;
          this.scroll.target = -totalWidth / 2;
        }
        if (!this.disableSnap) {
          this.onCheck();
        }
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
    // Skip snapping if disabled
    if (this.disableSnap) return;
    
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  onResize() {
    // Get actual container dimensions
    const rect = this.container.getBoundingClientRect();
    this.screen = {
      width: rect.width || this.container.clientWidth,
      height: rect.height || this.container.clientHeight
    };
    
    // Ensure we have valid dimensions
    if (this.screen.width === 0 || this.screen.height === 0) {
      this.screen.width = window.innerWidth;
      this.screen.height = window.innerHeight;
    }
    
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
    // Only update if in view or if there's active scrolling
    if (!this.isInView && Math.abs(this.scroll.current - this.scroll.target) < 0.01 && !this.momentumActive) {
      // Pause animation when out of view and not scrolling
      this.raf = window.requestAnimationFrame(this.update.bind(this));
      return;
    }
    
    // Apply momentum/inertia when active (only if snap is disabled)
    if (this.disableSnap && this.momentumActive && Math.abs(this.scroll.velocity) > 0.01) {
      // Apply velocity to target
      this.scroll.target += this.scroll.velocity;
      
      // Decelerate velocity (friction)
      this.scroll.velocity *= this.momentumDeceleration;
      
      // Stop momentum when velocity is too small
      if (Math.abs(this.scroll.velocity) < 0.01) {
        this.scroll.velocity = 0;
        this.momentumActive = false;
      }
    }
    
    // Always lerp current to target for smooth motion
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
    this.boundOnMouseEnter = this.onMouseEnter.bind(this);
    this.boundOnMouseLeave = this.onMouseLeave.bind(this);
    
    window.addEventListener('resize', this.boundOnResize);
    // Only attach wheel listeners to window, but check if in view and hovered
    window.addEventListener('mousewheel', this.boundOnWheel, { passive: false });
    window.addEventListener('wheel', this.boundOnWheel, { passive: false });
    window.addEventListener('mousedown', this.boundOnTouchDown);
    window.addEventListener('mousemove', this.boundOnTouchMove);
    window.addEventListener('mouseup', this.boundOnTouchUp);
    window.addEventListener('touchstart', this.boundOnTouchDown);
    window.addEventListener('touchmove', this.boundOnTouchMove);
    window.addEventListener('touchend', this.boundOnTouchUp);
    
    // Track mouse hover state
    this.container.addEventListener('mouseenter', this.boundOnMouseEnter);
    this.container.addEventListener('mouseleave', this.boundOnMouseLeave);
    
    // Accessibility: Keyboard navigation
    this.container.addEventListener('keydown', this.boundOnKeyDown);
  }
  destroy() {
    window.cancelAnimationFrame(this.raf);
    if (this.wheelTimeout) {
      clearTimeout(this.wheelTimeout);
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
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
    this.container.removeEventListener('mouseenter', this.boundOnMouseEnter);
    this.container.removeEventListener('mouseleave', this.boundOnMouseLeave);
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
 * @param {Array} images - Array of image URLs (strings) or objects with image property to replace default images
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
 * @param {boolean} seamlessScroll - When true, slider responds to scroll without preventing default, allowing seamless page scrolling (default: false)
 * @param {boolean} disableSnap - When true, disables snapping to items for smooth continuous scrolling (default: false)
 * @param {number} inertiaDeceleration - Friction factor for inertia scrolling (0.95 = 5% reduction per frame, only used when disableSnap is true, default: 0.95)
 */
export default function CircularGallery({
  items,
  images,
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
  ariaLabel = 'Image gallery slider',
  seamlessScroll = false,
  disableSnap = false,
  inertiaDeceleration = 0.95
}) {
  const containerRef = useRef(null);
  useEffect(() => {
    const app = new App(containerRef.current, { 
      items,
      images, 
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
      ariaLabel,
      seamlessScroll,
      disableSnap,
      inertiaDeceleration
    });
    return () => {
      app.destroy();
    };
  }, [items, images, bend, textColor, borderRadius, font, scrollSpeed, scrollEase, itemSize, itemPadding, scaleBase, showText, lazyLoad, breakpoints, ariaLabel, seamlessScroll, disableSnap, inertiaDeceleration]);
  return <div className="circular-gallery" ref={containerRef} />;
}
