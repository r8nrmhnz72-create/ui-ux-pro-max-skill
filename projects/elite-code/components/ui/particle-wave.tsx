"use client";

import * as React from "react";
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from "three";

export interface ParticleWaveProps extends Omit<React.ComponentProps<"canvas">, "children" | "color"> {
  /**
   * Particle colour as any CSS colour. Defaults to the canvas's computed `color`
   * (currentColor), so `text-foreground` makes the wave follow the theme:
   * light particles on a dark page, dark particles on a light page.
   */
  color?: string;
  /** Particle opacity, 0–1. */
  opacity?: number;
  /** Wave speed multiplier. 1 matches the original (0.05 rad per 60 Hz frame). */
  speed?: number;
  /** Point size multiplier. */
  size?: number;
  /** Lets the camera drift a little with the mouse. */
  interactive?: boolean;
}

const GAP = 0.3;
const AMOUNT = 200;
/** The original advanced the wave by 0.05 rad per frame; expressed per second so 120 Hz screens don't run it twice as fast. */
const RADIANS_PER_SECOND = 3;

const VERTEX = `
  attribute float scale;
  uniform float uTime;
  uniform float uSize;
  void main() {
    vec3 p = position;
    float s = scale;
    p.y += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    p.x += (sin(p.y + uTime) * 0.5);
    s += (sin(p.x + uTime) * 0.5) + (cos(p.y + uTime) * 0.1) * 2.0;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = s * uSize * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT = `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - vec2(0.5);
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

let probe: CanvasRenderingContext2D | null | undefined;

/** Resolves any CSS colour (hex, oklch(), color-mix()…) to 0–1 sRGB components by painting one pixel. */
function resolveColor(css: string, target: Vector3) {
  if (probe === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    probe = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!probe) return;
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = "#000";
  probe.fillStyle = css;
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  target.set(r / 255, g / 255, b / 255);
}

/**
 * A field of 40 000 points rolling as a wave, drawn with three.js on a transparent canvas.
 * The canvas fills its box (`block size-full` by default), so position it with `className`.
 * It pauses while off screen or in a background tab, holds a still frame under
 * `prefers-reduced-motion`, and hides itself when WebGL is unavailable.
 */
export function ParticleWave({
  className = "",
  color,
  opacity = 0.5,
  speed = 1,
  size = 1,
  interactive = true,
  ...rest
}: ParticleWaveProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const live = React.useRef({ color, opacity, speed, size, interactive });
  const refresh = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    live.current = { color, opacity, speed, size, interactive };
    refresh.current();
  }, [color, opacity, speed, size, interactive]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      // No WebGL (blocked, or an old GPU): step aside and let whatever is behind the canvas show.
      canvas.hidden = true;
      return;
    }
    renderer.setClearColor(0x000000, 0);

    const camera = new PerspectiveCamera(75, 1, 0.01, 1000);
    camera.position.set(0, 6, 5);
    const scene = new Scene();

    const total = AMOUNT * AMOUNT;
    const positions = new Float32Array(total * 3);
    const scales = new Float32Array(total).fill(1);
    let i = 0;
    for (let ix = 0; ix < AMOUNT; ix++) {
      for (let iy = 0; iy < AMOUNT; iy++) {
        positions[i] = ix * GAP - (AMOUNT * GAP) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * GAP - (AMOUNT * GAP) / 2;
        i += 3;
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new BufferAttribute(scales, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 15 },
      uOpacity: { value: live.current.opacity },
      uColor: { value: new Vector3(1, 1, 1) },
    };
    const material = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
    });
    const particles = new Points(geometry, material);
    particles.frustumCulled = false;
    scene.add(particles);

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { raf: 0, last: 0, inView: true, mx: 0, my: 0, tx: 0, ty: 0, ready: false, disposed: false };

    const render = () => {
      camera.position.set(state.mx * 0.9, 6 + state.my * 0.35, 5);
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      if (!state.ready) {
        state.ready = true;
        canvas.dataset.ready = "true";
      }
    };

    const frame = (now: number) => {
      state.raf = 0;
      if (state.disposed) return;
      const dt = state.last ? Math.min(0.1, (now - state.last) / 1000) : 1 / 60;
      state.last = now;
      uniforms.uTime.value += dt * RADIANS_PER_SECOND * live.current.speed;
      const ease = 1 - Math.exp(-dt * 2.2);
      state.mx += (state.tx - state.mx) * ease;
      state.my += (state.ty - state.my) * ease;
      render();
      schedule();
    };

    const running = () => state.inView && !document.hidden && !motion.matches && !state.disposed;

    function schedule() {
      if (state.raf || !running()) return;
      state.raf = requestAnimationFrame(frame);
    }

    const halt = () => {
      if (state.raf) cancelAnimationFrame(state.raf);
      state.raf = 0;
      state.last = 0;
    };

    const sync = () => {
      if (state.disposed) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      // Points are sized in device pixels, so scale with the pixel ratio and (gently) with the canvas height.
      uniforms.uSize.value = 15 * live.current.size * (1 + (ratio - 1) * 0.6) * Math.min(1.35, Math.max(0.75, height / 900));
      uniforms.uOpacity.value = live.current.opacity;
      resolveColor(live.current.color ?? getComputedStyle(canvas).color, uniforms.uColor.value);
      if (running()) schedule();
      else {
        halt();
        if (motion.matches) {
          state.mx = 0;
          state.my = 0;
        }
        render();
      }
    };
    refresh.current = sync;

    const onVisibility = () => {
      if (running()) schedule();
      else halt();
    };

    const onPointer = (event: PointerEvent) => {
      if (!live.current.interactive || event.pointerType !== "mouse" || motion.matches) return;
      state.tx = (event.clientX / window.innerWidth) * 2 - 1;
      state.ty = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      halt();
    };
    const onContextRestored = () => sync();

    const resize = new ResizeObserver(sync);
    resize.observe(canvas);
    const intersection = new IntersectionObserver((entries) => {
      state.inView = entries.some((entry) => entry.isIntersecting);
      onVisibility();
    });
    intersection.observe(canvas);
    // The particle colour follows the theme: re-read it whenever the root's theme attributes change.
    const theme = new MutationObserver(sync);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pointermove", onPointer, { passive: true });
    motion.addEventListener("change", sync);
    scheme.addEventListener("change", sync);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    sync();

    return () => {
      state.disposed = true;
      halt();
      refresh.current = () => {};
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      motion.removeEventListener("change", sync);
      scheme.removeEventListener("change", sync);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      scene.remove(particles);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      {...rest}
      ref={canvasRef}
      aria-hidden="true"
      data-slot="particle-wave"
      className={`block size-full ${className}`}
    />
  );
}

export default ParticleWave;
