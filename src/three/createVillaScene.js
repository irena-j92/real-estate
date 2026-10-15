import { sitePath } from "../lib/sitePath.js";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { villaLighting, clamp } from "./villaLighting";

/** A demand-rendered architectural scene; callbacks own no React state per frame. */
export async function createVillaScene(host, { signal, onLoad, onError, onPhase, onProgress }) {
  if (signal?.aborted) return { dispose() {} };
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  const mobile = window.innerWidth < 768;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#bed0e4");
  scene.fog = new THREE.Fog("#bed0e4", 32, 92);
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 160);
  const daySky = new THREE.Color("#bed0e4"), nightSky = new THREE.Color("#081324");
  const sunDay = new THREE.Color("#fff3da"), sunNight = new THREE.Color("#b9cced");
  const hemisphere = new THREE.HemisphereLight(0xd3e4ff, 0x74714e, 2);
  scene.add(hemisphere);
  const sun = new THREE.DirectionalLight(0xfff3da, 3.8);
  sun.position.set(-10, 20, 18); sun.target.position.set(0, 3, 0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13, near: 0.5, far: 65 });
  sun.shadow.bias = -0.0002; sun.shadow.normalBias = 0.015;
  scene.add(sun, sun.target);
  const pmrem = new THREE.PMREMGenerator(renderer), roomEnvironment = new RoomEnvironment();
  const environment = pmrem.fromScene(roomEnvironment, 0.05);
  scene.environment = environment.texture; scene.environmentIntensity = 0.28;
  roomEnvironment.dispose(); pmrem.dispose();
  const groundMaterial = new THREE.MeshStandardMaterial({ color: "#69765a", roughness: 1 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), groundMaterial);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.43; ground.receiveShadow = true; scene.add(ground);
  // Quiet planting beyond the model's own trees keeps the focus on its architecture.
  const canopyMaterial = new THREE.MeshStandardMaterial({ color: "#415d42", roughness: 1 });
  const canopyGeometry = new THREE.IcosahedronGeometry(1, 2);
  const canopies = new THREE.InstancedMesh(canopyGeometry, canopyMaterial, 100);
  const placement = new THREE.Object3D();
  for (let index = 0; index < 100; index++) {
    const angle = (index / 100) * Math.PI * 2, radius = 17 + (index % 7) * 1.7;
    placement.position.set(Math.cos(angle) * radius, 1 + (index % 4) * 0.5, Math.sin(angle) * radius);
    placement.scale.set(1.6 + (index % 3) * 0.4, 2 + (index % 5) * 0.4, 1.8);
    placement.rotation.set(index * 0.1, index * 0.4, 0); placement.updateMatrix(); canopies.setMatrixAt(index, placement.matrix);
  }
  scene.add(canopies);
  const lamps = [
    [1.8, 1.1, 2.3], [-2.5, 3.6, 2], [0.8, 6.5, -0.1],
    [-3, 0.32, 4.8], [3.8, 0.32, 4.8],
  ].map((position, index) => {
    const light = new THREE.PointLight(0xffc379, 0, index < 3 ? 7 : 3, 2);
    light.position.set(...position); scene.add(light); return light;
  });
  const stripMaterials = [], fixtureGeometry = new THREE.BoxGeometry(0.07, 0.025, 0.08);
  for (let index = 0; index < 9; index++) {
    const material = new THREE.MeshStandardMaterial({ color: "#403b31", emissive: "#ffd08e", emissiveIntensity: 0 });
    const fixture = new THREE.Mesh(fixtureGeometry, material); fixture.position.set(-4.8 + index * 1.15, 0.12, 4.5); scene.add(fixture); stripMaterials.push(material);
  }
  const eaveMaterial = new THREE.MeshStandardMaterial({ color: "#ded6bf", emissive: "#ffca7c", emissiveIntensity: 0 });
  const eave = new THREE.Mesh(new THREE.BoxGeometry(6.7, 0.018, 0.025), eaveMaterial);
  eave.position.set(0.2, 2.37, 3.48); scene.add(eave);
  let model = null, windowMaterials = [], disposed = false, visible = true, frame = 0;
  let targetNight = 0, currentNight = 0, scrollProgress = 0, previousTime = 0, phase = "day", reduced = false;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduced = preference.matches;
  let lastWidth = 0, lastHeight = 0;
  const frameCamera = () => {
    const width = host.clientWidth || window.innerWidth, height = host.clientHeight || window.innerHeight;
    if (width !== lastWidth || height !== lastHeight) {
      renderer.setSize(width, height, false); camera.aspect = width / height; lastWidth = width; lastHeight = height;
    }
    const distance = Math.max(16, 14 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.84));
    const angle = 0.56 + (reduced ? 0 : scrollProgress * 0.06);
    camera.position.set(Math.sin(angle) * distance, 5.4 + distance * 0.12, Math.cos(angle) * distance);
    camera.lookAt(0, 4.7, 0); camera.updateProjectionMatrix();
  };
  const draw = now => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const delta = previousTime ? Math.min(0.06, (now - previousTime) / 1000) : 1 / 60; previousTime = now;
    currentNight = reduced ? targetNight : THREE.MathUtils.damp(currentNight, targetNight, 2.6, delta);
    if (Math.abs(currentNight - targetNight) < 0.001) currentNight = targetNight;
    const light = villaLighting(currentNight);
    scene.background.copy(daySky).lerp(nightSky, currentNight); scene.fog.color.copy(scene.background);
    hemisphere.intensity = light.sky; sun.intensity = light.sun;
    sun.color.copy(sunDay).lerp(sunNight, currentNight); renderer.toneMappingExposure = light.exposure;
    windowMaterials.forEach(({ material, level }) => { material.emissiveIntensity = light.rooms[level] * 1.6; material.color.setRGB(0.44 + light.rooms[level] * 0.28, 0.53 + light.rooms[level] * 0.08, 0.56 - light.rooms[level] * 0.3); });
    lamps.forEach((lamp, index) => { lamp.intensity = index < 3 ? light.rooms[index] * 32 : light.path * 7; });
    stripMaterials.forEach(material => { material.emissiveIntensity = light.path * 3; });
    eaveMaterial.emissiveIntensity = light.rooms[1] * 2;
    const nextPhase = currentNight > 0.52 ? "night" : "day";
    if (nextPhase !== phase) { phase = nextPhase; onPhase?.(phase); }
    frameCamera(); renderer.render(scene, camera);
    if (currentNight !== targetNight) frame = requestAnimationFrame(draw);
  };
  const invalidate = () => { if (!disposed && !frame && visible && !document.hidden) frame = requestAnimationFrame(draw); };
  const visibility = () => { if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else { previousTime = 0; invalidate(); } };
  const updatePreference = () => { reduced = preference.matches; invalidate(); };
  const resize = new ResizeObserver(() => { renderer.shadowMap.needsUpdate = true; invalidate(); }); resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) invalidate(); else { cancelAnimationFrame(frame); frame = 0; } }, { threshold: 0 }); intersection.observe(host);
  preference.addEventListener("change", updatePreference); document.addEventListener("visibilitychange", visibility);
  const lost = event => { event.preventDefault(); onError?.("The 3D view is unavailable. The architectural reference remains visible."); };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  const dispose = () => {
    if (disposed) return; disposed = true; cancelAnimationFrame(frame);
    resize.disconnect(); intersection.disconnect(); preference.removeEventListener("change", updatePreference); document.removeEventListener("visibilitychange", visibility);
    renderer.domElement.removeEventListener("webglcontextlost", lost);
    const geometries = new Set(), materials = new Set();
    scene.traverse(object => { if (object.geometry) geometries.add(object.geometry); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose());
    environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  };
  signal?.addEventListener("abort", dispose, { once: true });
  try {
    const response = await fetch(sitePath("/assets/models/sunter-villa.glb"), { signal });
    if (!response.ok) throw new Error("The villa model could not be loaded.");
    const reader = response.body?.getReader();
    let buffer;
    if (reader) {
      const chunks = []; let bytes = 0; const total = Number(response.headers.get("Content-Length")) || 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); bytes += value.length; if (total) onProgress?.(Math.min(99, Math.round(bytes / total * 100))); }
      const merged = new Uint8Array(bytes); let offset = 0; chunks.forEach(chunk => { merged.set(chunk, offset); offset += chunk.length; }); buffer = merged.buffer;
    } else buffer = await response.arrayBuffer();
    if (disposed || signal?.aborted) return { dispose };
    const gltf = await new GLTFLoader().parseAsync(buffer, "");
    model = gltf.scene;
    model.traverse(object => {
      if (!object.isMesh) return;
      const name = object.material.name;
      object.receiveShadow = true;
      object.castShadow = ["_auto_1", "_auto_5", "_auto_6", "_auto_10"].includes(name);
      if (["_auto_3", "_auto_7"].includes(name)) {
        object.material.dispose();
        const indices = object.geometry.index.array, positions = object.geometry.attributes.position;
        const floors = [[], [], []];
        for (let index = 0; index < indices.length; index += 3) {
          const height = (positions.getY(indices[index]) + positions.getY(indices[index + 1]) + positions.getY(indices[index + 2])) / 3;
          const floor = height < 2.65 ? 0 : height < 5.3 ? 1 : 2;
          floors[floor].push(indices[index], indices[index + 1], indices[index + 2]);
        }
        object.geometry.clearGroups();
        object.geometry.setIndex(floors.flat());
        let start = 0;
        object.material = floors.map((floor, level) => {
          object.geometry.addGroup(start, floor.length, level); start += floor.length;
          const material = new THREE.MeshPhysicalMaterial({ name: `${name}-floor-${level}`, color: "#778987", metalness: 0.1, roughness: 0.22, transparent: true, opacity: 0.72, depthWrite: false, clearcoat: 0.8, emissive: "#ffc276", emissiveIntensity: 0, side: THREE.DoubleSide });
          windowMaterials.push({ material, level }); return material;
        });
      }
    });
    if (disposed) { model.traverse(object => { object.geometry?.dispose(); if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => material.dispose()); }); return { dispose }; }
    scene.add(model); renderer.shadowMap.needsUpdate = true; onProgress?.(100); onLoad?.(); invalidate();
  } catch (error) { if (!disposed && error.name !== "AbortError") onError?.("The 3D view is unavailable. The architectural reference remains visible."); }
  return { setNight(value) { targetNight = clamp(value); invalidate(); }, setProgress(value) { scrollProgress = clamp(value); invalidate(); }, dispose };
}
