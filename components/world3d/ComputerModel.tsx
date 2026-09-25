"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { AdditiveBlending, DoubleSide, Mesh, MeshBasicMaterial, NoBlending, ShaderMaterial, SRGBColorSpace } from "three";
import { useRoomStore } from "@/store/room";
import RoomProps, { type RoomMeshes } from "./RoomProps";

/** Actual meshes and baked-lighting setup from Henry Heffernan's MIT website.
 * Coordinates stay at GLB scale instead of upstream ×900. Full source license
 * and artist attribution are distributed with public/models/henry. */
const modelPaths = ["computer_setup.glb", "environment.glb", "decor.glb"].map((name) => `/models/henry/${name}`);
const texturePaths = ["baked_computer.jpg", "baked_environment.jpg", "baked_decor_modified.jpg", "smudges.jpg", "shadow-compressed.png"].map((name) => `/models/henry/${name}`);
const screenWidth = 1280 / 900, screenHeight = 1024 / 900, glassDepth = 96 / 900;

export function preloadWorkstationAssets() {
  useGLTF.preload(modelPaths, false, false);
  useTexture.preload(texturePaths);
}

function CRTNoise({ paused }: { paused: boolean }) {
  const material = useMemo(() => new ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { uTime: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "uniform float uTime;varying vec2 vUv;void main(){float n=fract(sin(dot(floor(vUv*vec2(1280.0,1024.0)),vec2(12.9898,78.233))+floor(uTime*18.0))*43758.5453);float edge=smoothstep(0.0,0.055,min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y)));float scan=0.5+0.5*sin(vUv.y*3216.99);gl_FragColor=vec4(vec3(0.78,0.85,0.91),(n*0.024+scan*0.008)*edge);}",
  }), []);
  const materialRef = useRef(material);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => { if (!paused) materialRef.current.uniforms.uTime.value += delta; });
  return <mesh position={[0, 0, 60 / 900]} material={material}><planeGeometry args={[screenWidth, screenHeight]} /></mesh>;
}

export default function ComputerModel({ onClick, onScreenActivate, onScreenHover, onReady, paused, interactive = false }: {
  onClick: () => void; onScreenActivate: () => void; onScreenHover: () => void; onReady: () => void; paused: boolean; interactive?: boolean;
}) {
  const powerOn = useRoomStore((state) => state.powerOn);
  const models = useGLTF(modelPaths, false, false);
  const maps = useTexture(texturePaths);
  const assets = useMemo(() => {
    const textures = maps.map((source) => {
      const texture = source.clone();
      texture.colorSpace = SRGBColorSpace;
      texture.flipY = false;
      texture.needsUpdate = true;
      return texture;
    });
    const materials = textures.slice(0, 3).map((map) => new MeshBasicMaterial({ map, toneMapped: false }));
    const paperMaterial = new MeshBasicMaterial({ color: "#e4e2d8", toneMapped: false });
    const scenes = models.map((model, index) => {
      const scene = model.scene.clone(true);
      scene.traverse((child) => {
        if (child instanceof Mesh) child.material = child.name === "paper" ? paperMaterial : materials[index];
      });
      return scene;
    });
    function take(sceneIndex: number, name: string) {
      const mesh = scenes[sceneIndex].getObjectByName(name);
      if (!(mesh instanceof Mesh)) throw new Error(`Missing workstation prop: ${name}`);
      mesh.removeFromParent();
      return mesh;
    }
    const roomMeshes: RoomMeshes = {
      mug: take(2, "coffee"), paper: take(2, "paper"), plant: take(2, "plant"),
      chairSeat: take(1, "chair_seat"), chairBase: take(1, "chair_base"),
      desk: take(1, "desk"), computer: take(0, "computer"),
    };
    textures[3].flipY = true;
    textures[4].flipY = true;
    return { scenes, roomMeshes, materials: [...materials, paperMaterial], textures };
  }, [models, maps]);
  useEffect(() => { onReady(); }, [onReady]);
  useEffect(() => () => {
    assets.materials.forEach((material) => material.dispose());
    assets.textures.forEach((texture) => texture.dispose());
  }, [assets]);

  return <group onClick={(event) => {
    event.stopPropagation();
    const state = useRoomStore.getState();
    if (interactive && state.held) {
      state.aim(event.object.name === "monitor_base" ? "pc" : "desk");
      return;
    }
    onClick();
  }}>
    {assets.scenes.map((scene, index) => <primitive key={modelPaths[index]} object={scene} dispose={null} />)}
    <RoomProps meshes={assets.roomMeshes} interactive={interactive} paused={paused} />
    {/* CSS3D desktop is underneath the WebGL canvas. NoBlending writes an
        alpha-zero opening, so the real DOM is visible through the CRT housing. */}
    <group position={[0, 950 / 900, 255 / 900]} rotation={[-Math.PI / 60, 0, 0]}
      onClick={(event) => {
        event.stopPropagation();
        const state = useRoomStore.getState();
        if (interactive && state.held) state.aim("pc");
        else if (state.powerOn) onScreenActivate();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        const state = useRoomStore.getState();
        if (interactive && state.held) state.setHovered("pc");
        else if (state.powerOn && event.pointerType !== "touch") onScreenHover();
      }}
      onPointerOut={() => { const state = useRoomStore.getState(); if (state.hovered === "pc") state.setHovered(null); }}>
      <mesh>
        <planeGeometry args={[screenWidth, screenHeight]} />
        {powerOn
          ? <meshBasicMaterial key="screen-on" color="black" opacity={0} transparent blending={NoBlending} side={DoubleSide} depthWrite />
          : <meshBasicMaterial key="screen-off" color="#101210" side={DoubleSide} toneMapped={false} depthWrite />}

      </mesh>
      <mesh position={[0, 0, 20 / 900]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial map={assets.textures[4]} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {powerOn && <CRTNoise paused={paused} />}
      <mesh position={[0, 0, glassDepth]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial map={assets.textures[3]} blending={AdditiveBlending} opacity={0.08} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {[-1, 1].map((side) => <group key={side}>
        <mesh position={[side * screenWidth / 2, 0, glassDepth / 2]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[glassDepth, screenHeight]} /><meshBasicMaterial color="#48493f" side={DoubleSide} />
        </mesh>
        <mesh position={[0, side * screenHeight / 2, glassDepth / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[screenWidth, glassDepth]} /><meshBasicMaterial color="#48493f" side={DoubleSide} />
        </mesh>
      </group>)}
    </group>
  </group>;
}
