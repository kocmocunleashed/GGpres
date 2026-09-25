"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Color, ShaderMaterial, Vector2 } from "three";
import { coffeeFragment, coffeeVertex } from "./coffee-shaders";

export default function CoffeeSteam({ paused }: { paused: boolean }) {
  const material = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    vertexShader: coffeeVertex,
    fragmentShader: coffeeFragment,
    uniforms: { uTime: { value: 0 }, uTimeFrequency: { value: 0.001 }, uUvFrequency: { value: new Vector2(3, 5) }, uColor: { value: new Color("#c9c9c9") } },
  }), []);
  const materialRef = useRef(material);
  useEffect(() => () => material.dispose(), [material]);
  useFrame((_, delta) => { if (!paused) materialRef.current.uniforms.uTime.value += delta * 1000; });
  return <mesh position={[1670 / 900, 200 / 900, 900 / 900]} material={material}>
    <planeGeometry args={[280 / 900, 700 / 900]} />
  </mesh>;
}
