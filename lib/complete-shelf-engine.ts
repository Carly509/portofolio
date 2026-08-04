import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

import type { Book } from '@/content/books';

export type ShelfMode = 'browse' | 'focusing' | 'inspect' | 'returning';

type ShelfCallbacks = {
  onActiveIndex: (index: number) => void;
  onMode: (mode: ShelfMode, selectedIndex: number | null) => void;
  onReady: () => void;
  onStatus: (message: string) => void;
};

type RuntimeBook = {
  data: Book;
  index: number;
  slot: THREE.Group;
  content: THREE.Group;
  idle: THREE.Group;
  pickProxy: THREE.Mesh;
  textures: THREE.Texture[];
  x: number;
  hover: number;
  targetHover: number;
};

const shelfTop = 0.34;
const browseCamera = new THREE.Vector3(0, 1.42, 6.65);
const browseTarget = new THREE.Vector3(0, 1.28, 0.15);
const shelvedYaw = Math.PI / 2;
const presentedYaw = 0;
const shelvedZ = -0.64;
const presentedZ = 0.4;
const focusInDuration = 0.46;
const focusOutDuration = 0.34;
const clamp = THREE.MathUtils.clamp;

function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.damp(current, target, lambda, delta);
}

function smooth(value: number) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  width: number,
  maxLines: number,
) {
  const lines: string[] = [];
  let line = '';

  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, maxLines);
}

function seeded(seed: string) {
  let value = 2166136261;
  for (const character of seed) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCover(book: Book, spine = false) {
  const canvas = document.createElement('canvas');
  canvas.width = spine ? 128 : 512;
  canvas.height = spine ? 1024 : 768;
  const context = canvas.getContext('2d');
  if (!context) return canvas;

  const width = canvas.width;
  const height = canvas.height;
  const random = seeded(book.id);
  context.fillStyle = book.cover;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = book.accent;
  context.fillStyle = book.accent;
  context.globalAlpha = 0.7;
  for (let index = 0; index < (spine ? 8 : 24); index += 1) {
    const x = random() * width;
    const y = random() * height;
    const radius = 8 + random() * (spine ? 18 : 70);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    if (index % 3 === 0) {
      context.fill();
    } else {
      context.stroke();
    }
  }
  context.globalAlpha = 1;

  if (spine) {
    context.fillStyle = book.ink;
    context.translate(width / 2, height - 72);
    context.rotate(-Math.PI / 2);
    context.font = '600 48px Georgia, serif';
    context.textBaseline = 'middle';
    context.fillText(book.shortTitle, 0, 0, height - 135);
    context.font = '500 22px system-ui, sans-serif';
    context.fillText(book.author, 0, 54, height - 135);
    return canvas;
  }

  context.strokeStyle = book.ink;
  context.globalAlpha = 0.25;
  context.lineWidth = 2;
  context.strokeRect(15, 15, width - 30, height - 30);
  context.globalAlpha = 1;
  context.fillStyle = book.ink;
  context.font = '600 11px system-ui, sans-serif';
  context.letterSpacing = '2px';
  context.fillText("CARLY'S SHELF", 38, 48);
  context.letterSpacing = '0px';
  context.font = `600 ${book.title.length > 24 ? 44 : 57}px Georgia, serif`;
  const lines = wrapText(context, book.title, width - 76, 4);
  lines.forEach((line, index) => context.fillText(line, 38, 116 + index * 52));
  context.font = '500 18px system-ui, sans-serif';
  context.fillText(book.author, 38, Math.max(350, 134 + lines.length * 52));
  context.globalAlpha = 0.78;
  context.font = '500 10px system-ui, sans-serif';
  context.letterSpacing = '2px';
  context.fillText('A BOOK WORTH PASSING ON', 38, height - 44);
  return canvas;
}

function makeBackCover(book: Book) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  if (!context) return canvas;

  context.fillStyle = book.cover;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = book.ink;
  context.font = '500 25px Georgia, serif';
  context.textBaseline = 'top';
  const lines = wrapText(context, book.description, 346, 9);
  lines.forEach((line, index) => context.fillText(line, 82, 112 + index * 36));
  context.fillStyle = book.accent;
  context.fillRect(82, 112 + lines.length * 36 + 38, 92, 5);
  context.fillStyle = book.ink;
  context.font = 'italic 500 29px Georgia, serif';
  wrapText(context, `“${book.quote}”`, 346, 5).forEach((line, index) =>
    context.fillText(line, 82, 112 + lines.length * 36 + 86 + index * 38),
  );
  return canvas;
}

export class CompleteShelfEngine {
  private canvas: HTMLCanvasElement;
  private booksData: Book[];
  private callbacks: ShelfCallbacks;
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private shelfGroup = new THREE.Group();
  private shelfFurniture = new THREE.Group();
  private runtimeBooks: RuntimeBook[] = [];
  private pickTargets: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(10, 10);
  private resizeObserver: ResizeObserver;
  private animationFrame = 0;
  private activeIndex = 0;
  private selectedIndex: number | null = null;
  private scrollIndex = 0;
  private targetScrollIndex = 0;
  private focusProgress = 0;
  private mode: ShelfMode = 'browse';
  private pointerDown = false;
  private pointerId: number | null = null;
  private pointerStartX = 0;
  private pointerLastX = 0;
  private pointerTravel = 0;
  private reducedMotion = false;
  private lastTimestamp = 0;
  private disposed = false;

  constructor(canvas: HTMLCanvasElement, books: Book[], callbacks: ShelfCallbacks) {
    this.canvas = canvas;
    this.booksData = books;
    this.callbacks = callbacks;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.03;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    this.camera = new THREE.PerspectiveCamera(27, 1, 0.08, 80);
    this.camera.position.copy(browseCamera);
    this.camera.lookAt(browseTarget);
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enabled = false;
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
    this.controls.minDistance = 2.7;
    this.controls.maxDistance = 7.2;
    this.controls.minPolarAngle = Math.PI * 0.22;
    this.controls.maxPolarAngle = Math.PI * 0.78;

    this.resizeObserver = new ResizeObserver(this.handleResize);
    this.setupScene();
    this.createBooks();
    this.bindEvents();
    this.resizeObserver.observe(canvas);
    this.handleResize();
    this.callbacks.onReady();
    this.callbacks.onStatus(`${books.length} volumes ready`);
    this.animate();
  }

  private setupScene() {
    this.scene.background = new THREE.Color('#eee8db');
    this.scene.fog = new THREE.Fog('#eee8db', 10, 26);
    this.scene.add(new THREE.HemisphereLight('#fff8ea', '#6e5848', 2.4));

    const key = new THREE.DirectionalLight('#fff6e7', 4.6);
    key.position.set(-4.2, 7.4, 5.5);
    key.castShadow = true;
    key.shadow.mapSize.set(window.innerWidth < 700 ? 1024 : 2048, window.innerWidth < 700 ? 1024 : 2048);
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 6;
    key.shadow.camera.bottom = -2;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 22;
    key.shadow.bias = -0.0005;
    this.scene.add(key);

    const rim = new THREE.DirectionalLight('#c8d5e5', 2.1);
    rim.position.set(5, 3, -4);
    this.scene.add(rim);

    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(34, 18),
      new THREE.MeshStandardMaterial({ color: '#eee8db', roughness: 1 }),
    );
    wall.position.set(0, 5, -3.2);
    wall.receiveShadow = true;
    this.scene.add(wall);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 18),
      new THREE.MeshStandardMaterial({ color: '#e7dfd0', roughness: 0.94 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.24;
    ground.receiveShadow = true;
    this.scene.add(ground, this.shelfGroup);
    this.shelfGroup.add(this.shelfFurniture);
  }

  private toTexture(canvas: HTMLCanvasElement, anisotropy = 8) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(anisotropy, this.renderer.capabilities.getMaxAnisotropy());
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    return texture;
  }

  private createBooks() {
    let cursor = 0;
    const gap = 0.045;

    this.booksData.forEach((book, index) => {
      cursor += book.thickness * 0.5;
      const runtime = this.createBook(book, index, cursor);
      this.runtimeBooks.push(runtime);
      this.shelfGroup.add(runtime.slot);
      cursor += book.thickness * 0.5 + gap;
    });

    const shelfWidth = cursor + 8;
    const shelf = new THREE.Mesh(
      new RoundedBoxGeometry(shelfWidth, 0.22, 1.72, 4, 0.045),
      new THREE.MeshStandardMaterial({ color: '#5a4132', roughness: 0.62 }),
    );
    shelf.position.set(cursor * 0.5, shelfTop - 0.14, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    this.shelfFurniture.add(shelf);

    const shelfEdge = new THREE.Mesh(
      new RoundedBoxGeometry(shelfWidth, 0.12, 0.16, 3, 0.025),
      new THREE.MeshPhysicalMaterial({ color: '#4b3429', roughness: 0.46, clearcoat: 0.14 }),
    );
    shelfEdge.position.set(cursor * 0.5, shelfTop - 0.08, 0.85);
    shelfEdge.castShadow = true;
    this.shelfFurniture.add(shelfEdge);
  }

  private createBook(book: Book, index: number, x: number): RuntimeBook {
    const width = 1.31 + ((index % 5) - 2) * 0.018;
    const slot = new THREE.Group();
    slot.position.set(x, shelfTop + book.height * 0.5, 0.04);

    const content = new THREE.Group();
    content.position.set(0, 0, index === 0 ? presentedZ : shelvedZ);
    content.rotation.y = index === 0 ? presentedYaw : shelvedYaw;
    slot.add(content);

    const idle = new THREE.Group();
    content.add(idle);
    const boardMaterial = new THREE.MeshPhysicalMaterial({
      color: book.cover,
      roughness: 0.78,
      sheen: 0.36,
      sheenColor: new THREE.Color(book.ink),
    });
    const paperMaterial = new THREE.MeshStandardMaterial({ color: '#e9dfca', roughness: 0.88 });
    const pageBlock = new THREE.Mesh(
      new RoundedBoxGeometry(width - 0.075, book.height - 0.105, Math.max(0.08, book.thickness - 0.052), 3, 0.018),
      paperMaterial,
    );
    pageBlock.castShadow = true;
    pageBlock.receiveShadow = true;
    idle.add(pageBlock);

    const boardGeometry = new RoundedBoxGeometry(width, book.height, 0.034, 4, 0.025);
    const frontBoard = new THREE.Mesh(boardGeometry, boardMaterial);
    frontBoard.position.z = book.thickness * 0.5;
    frontBoard.castShadow = true;
    idle.add(frontBoard);
    const backBoard = frontBoard.clone();
    backBoard.position.z = -book.thickness * 0.5;
    idle.add(backBoard);

    const spine = new THREE.Mesh(
      new RoundedBoxGeometry(0.055, book.height - 0.01, book.thickness + 0.012, 3, 0.018),
      boardMaterial,
    );
    spine.position.x = -width * 0.5 + 0.022;
    spine.castShadow = true;
    idle.add(spine);

    const frontTexture = this.toTexture(makeCover(book));
    const backTexture = this.toTexture(makeBackCover(book));
    const spineTexture = this.toTexture(makeCover(book, true), 4);
    const textures = [frontTexture, backTexture, spineTexture];
    const front = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.065, book.height - 0.065),
      new THREE.MeshPhysicalMaterial({ map: frontTexture, roughness: 0.66, clearcoat: 0.05 }),
    );
    front.position.z = book.thickness * 0.5 + 0.019;
    idle.add(front);
    const back = new THREE.Mesh(
      new THREE.PlaneGeometry(width - 0.065, book.height - 0.065),
      new THREE.MeshStandardMaterial({ map: backTexture, roughness: 0.72 }),
    );
    back.position.z = -book.thickness * 0.5 - 0.019;
    back.rotation.y = Math.PI;
    idle.add(back);
    const spineSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(book.thickness - 0.02, book.height - 0.04),
      new THREE.MeshPhysicalMaterial({ map: spineTexture, roughness: 0.68 }),
    );
    spineSurface.rotation.y = -Math.PI / 2;
    spineSurface.position.x = -width * 0.5 - 0.019;
    idle.add(spineSurface);

    const pickProxy = new THREE.Mesh(
      new THREE.BoxGeometry(width, book.height, book.thickness + 0.07),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    pickProxy.userData.bookIndex = index;
    idle.add(pickProxy);
    this.pickTargets.push(pickProxy);

    return { data: book, index, slot, content, idle, pickProxy, textures, x, hover: 0, targetHover: 0 };
  }

  private bindEvents() {
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false });
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.addEventListener('keydown', this.handleKeyDown);
  }

  private handleWheel = (event: WheelEvent) => {
    if (this.mode !== 'browse') return;
    event.preventDefault();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    this.targetScrollIndex = clamp(this.targetScrollIndex + delta * 0.0024, 0, this.runtimeBooks.length - 1);
  };

  private handlePointerDown = (event: PointerEvent) => {
    if (this.mode !== 'browse') return;
    this.pointerDown = true;
    this.pointerId = event.pointerId;
    this.pointerStartX = event.clientX;
    this.pointerLastX = event.clientX;
    this.pointerTravel = 0;
    this.canvas.setPointerCapture(event.pointerId);
  };

  private handlePointerMove = (event: PointerEvent) => {
    this.updatePointer(event);
    if (this.mode !== 'browse') return;
    if (this.pointerDown && event.pointerId === this.pointerId) {
      const delta = event.clientX - this.pointerLastX;
      this.pointerLastX = event.clientX;
      this.pointerTravel += Math.abs(delta);
      this.targetScrollIndex = clamp(
        this.targetScrollIndex - delta / Math.max(105, this.canvas.clientWidth * 0.11),
        0,
        this.runtimeBooks.length - 1,
      );
      this.canvas.classList.add('is-dragging');
      return;
    }
    this.updateHover();
  };

  private handlePointerUp = (event: PointerEvent) => {
    if (event.pointerId !== this.pointerId) return;
    const wasClick = this.pointerTravel < 7 && Math.abs(event.clientX - this.pointerStartX) < 7;
    this.pointerDown = false;
    this.pointerId = null;
    this.canvas.classList.remove('is-dragging');
    if (this.canvas.hasPointerCapture(event.pointerId)) this.canvas.releasePointerCapture(event.pointerId);
    if (this.mode === 'browse' && wasClick) {
      this.updatePointer(event);
      const index = this.raycastBook();
      if (index !== null) this.focusBook(index);
    }
  };

  private handlePointerCancel = () => {
    this.pointerDown = false;
    this.pointerId = null;
    this.canvas.classList.remove('is-dragging');
  };

  private handlePointerLeave = () => {
    if (!this.pointerDown) this.runtimeBooks.forEach((book) => { book.targetHover = 0; });
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      this.returnToShelf();
      return;
    }
    if (event.key.toLowerCase() === 'r' && this.mode === 'inspect') {
      this.resetFocusView();
      return;
    }
    if (this.mode !== 'browse') return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.browseBy(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.browseBy(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.browseTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      this.browseTo(this.runtimeBooks.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.focusBook(this.activeIndex);
    }
  };

  private updatePointer(event: PointerEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  private raycastBook() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickTargets, false)[0];
    return typeof hit?.object.userData.bookIndex === 'number' ? hit.object.userData.bookIndex as number : null;
  }

  private updateHover() {
    const active = this.raycastBook();
    this.runtimeBooks.forEach((book) => { book.targetHover = book.index === active ? 1 : 0; });
  }

  private xAtIndex(index: number) {
    const lower = Math.floor(index);
    const upper = Math.min(this.runtimeBooks.length - 1, Math.ceil(index));
    return THREE.MathUtils.lerp(this.runtimeBooks[lower]?.x ?? 0, this.runtimeBooks[upper]?.x ?? 0, index - lower);
  }

  private animate = () => {
    if (this.disposed) return;
    this.animationFrame = requestAnimationFrame(this.animate);
    const timestamp = performance.now();
    const delta = clamp((timestamp - this.lastTimestamp) / 1000 || 1 / 60, 0, 0.05);
    this.lastTimestamp = timestamp;
    this.updateState(delta, timestamp / 1000);
    if (this.controls.enabled) this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  private updateState(delta: number, elapsed: number) {
    if (this.mode === 'browse') {
      this.scrollIndex = damp(this.scrollIndex, this.targetScrollIndex, this.reducedMotion ? 20 : 10, delta);
      const nextIndex = clamp(Math.round(this.scrollIndex), 0, this.runtimeBooks.length - 1);
      if (nextIndex !== this.activeIndex) {
        this.activeIndex = nextIndex;
        this.callbacks.onActiveIndex(nextIndex);
      }
      this.focusProgress = damp(this.focusProgress, 0, 12, delta);
      this.camera.position.lerp(browseCamera, 1 - Math.exp(-7 * delta));
      this.camera.lookAt(browseTarget);
    } else if (this.mode === 'focusing') {
      this.focusProgress = clamp(this.focusProgress + delta / (this.reducedMotion ? 0.08 : focusInDuration), 0, 1);
      this.updateFocusCamera(delta);
      if (this.focusProgress >= 1) {
        this.mode = 'inspect';
        this.controls.enabled = true;
        this.callbacks.onMode(this.mode, this.selectedIndex);
        this.callbacks.onStatus('Drag to orbit, scroll to zoom');
      }
    } else if (this.mode === 'returning') {
      this.controls.enabled = false;
      this.focusProgress = clamp(this.focusProgress - delta / (this.reducedMotion ? 0.08 : focusOutDuration), 0, 1);
      this.camera.position.lerp(browseCamera, 1 - Math.exp(-14 * delta));
      this.camera.lookAt(browseTarget);
      if (this.focusProgress <= 0) {
        this.selectedIndex = null;
        this.mode = 'browse';
        this.callbacks.onMode(this.mode, null);
        this.callbacks.onStatus(`${this.booksData.length} volumes ready`);
      }
    }

    this.shelfGroup.position.x = -this.xAtIndex(this.scrollIndex);
    const focus = smooth(this.focusProgress);
    this.shelfFurniture.visible = focus < 0.72;
    const mobile = this.canvas.clientWidth < 760;
    for (const book of this.runtimeBooks) {
      const active = book.index === this.activeIndex;
      const selected = book.index === this.selectedIndex;
      const targetZ = selected ? THREE.MathUtils.lerp(presentedZ, mobile ? 1.4 : 1.66, focus) : active ? presentedZ : shelvedZ;
      const targetYaw = selected || active ? presentedYaw : shelvedYaw;
      const targetScale = selected ? THREE.MathUtils.lerp(1.035, mobile ? 0.92 : 1.08, focus) : active ? 1.035 : 1;
      const targetX = selected ? (mobile ? 0 : -0.58 * focus) : 0;
      book.content.position.x = damp(book.content.position.x, targetX, 12, delta);
      book.content.position.z = damp(book.content.position.z, targetZ, 12, delta);
      book.content.rotation.y = damp(book.content.rotation.y, targetYaw, 12, delta);
      book.content.scale.setScalar(damp(book.content.scale.x, targetScale, 12, delta));
      book.hover = damp(book.hover, book.targetHover, 12, delta);
      book.content.position.y = selected ? focus * 0.04 : book.hover * 0.035;
      book.content.visible = focus < 0.72 || selected;
      if (selected && this.mode === 'inspect' && !this.reducedMotion) {
        const phase = elapsed * 0.78 + book.index * 0.37;
        book.idle.position.y = Math.sin(phase) * 0.014;
        book.idle.rotation.set(Math.sin(phase * 0.73) * 0.005, Math.sin(phase * 0.61) * 0.008, 0);
      } else {
        book.idle.position.y = damp(book.idle.position.y, 0, 8, delta);
        book.idle.rotation.x = damp(book.idle.rotation.x, 0, 8, delta);
        book.idle.rotation.y = damp(book.idle.rotation.y, 0, 8, delta);
      }
    }
  }

  private updateFocusCamera(delta: number) {
    if (this.selectedIndex === null) return;
    const selected = this.runtimeBooks[this.selectedIndex];
    const position = new THREE.Vector3();
    selected.content.getWorldPosition(position);
    const mobile = this.canvas.clientWidth < 760;
    const target = position.clone();
    const camera = new THREE.Vector3(position.x + (mobile ? 0 : 0.58), position.y + 0.12, position.z + (mobile ? 5.8 : 5.4));
    this.camera.position.lerp(camera, 1 - Math.exp(-13 * delta));
    this.camera.lookAt(target);
    if (this.focusProgress > 0.92) this.controls.target.copy(target);
  }

  browseBy(direction: number) {
    this.browseTo(Math.round(this.targetScrollIndex) + direction);
  }

  browseTo(index: number) {
    if (this.mode !== 'browse') return;
    this.targetScrollIndex = clamp(Math.round(index), 0, this.runtimeBooks.length - 1);
  }

  focusBook(index = this.activeIndex) {
    if (this.mode !== 'browse') return;
    const next = clamp(Math.round(index), 0, this.runtimeBooks.length - 1);
    this.targetScrollIndex = next;
    this.scrollIndex = next;
    this.activeIndex = next;
    this.selectedIndex = next;
    this.focusProgress = 0;
    this.mode = 'focusing';
    this.callbacks.onActiveIndex(next);
    this.callbacks.onMode(this.mode, next);
    this.callbacks.onStatus(`Opening ${this.runtimeBooks[next].data.shortTitle}`);
  }

  returnToShelf() {
    if (this.mode === 'browse' || this.mode === 'returning') return;
    this.controls.enabled = false;
    this.mode = 'returning';
    this.callbacks.onMode(this.mode, this.selectedIndex);
    this.callbacks.onStatus('Returning to the shelf');
  }

  resetFocusView() {
    if (this.mode !== 'inspect' || this.selectedIndex === null) return;
    const selected = this.runtimeBooks[this.selectedIndex];
    const position = new THREE.Vector3();
    selected.content.getWorldPosition(position);
    const mobile = this.canvas.clientWidth < 760;
    this.controls.target.copy(position);
    this.camera.position.set(position.x + (mobile ? 0 : 0.58), position.y + 0.12, position.z + (mobile ? 5.8 : 5.4));
    this.controls.update();
  }

  private handleResize = () => {
    const width = Math.max(1, this.canvas.clientWidth);
    const height = Math.max(1, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, width < 760 ? 1.5 : 1.75));
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.fov = width < 600 ? 33 : width < 920 ? 30 : 27;
    this.camera.updateProjectionMatrix();
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrame);
    this.resizeObserver.disconnect();
    this.controls.dispose();
    this.canvas.removeEventListener('wheel', this.handleWheel);
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointercancel', this.handlePointerCancel);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
    this.canvas.removeEventListener('keydown', this.handleKeyDown);
    this.scene.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => material.dispose());
    });
    this.runtimeBooks.forEach((book) => book.textures.forEach((texture) => texture.dispose()));
    this.renderer.dispose();
  }
}
