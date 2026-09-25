"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, DynamicDrawUsage, Group, InstancedMesh, Mesh, MeshBasicMaterial, Object3D, TubeGeometry, Vector3 } from "three";
import { useRoomStore } from "@/store/room";

export const POUR_POINTS = {
  plant: new Vector3(4.113, -2.421, -0.117),
  pc: new Vector3(-0.55, 0.034, 0.73),
  desk: new Vector3(-1.27, -0.49, 1.43),
};
const segments = 24, sides = 6;
const coffeeColor = new Color("#50321e");

/** A small deterministic stream, not a physics simulation. Geometry is allocated
 * once; pouring updates its vertices and the same twelve instanced droplets. */
export default function CoffeePour({ mugRef, paused }: { mugRef: RefObject<Group | null>; paused: boolean }) {
  const stream = useRef<Mesh>(null);
  const droplets = useRef<InstancedMesh>(null);
  const puddles = useRef<(Mesh | null)[]>([]);
  const drip = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const scratch = useMemo(() => ({ start: new Vector3(), end: new Vector3(), object: new Object3D() }), []);
  const geometry = useMemo(() => {
    const result = new BufferGeometry();
    const positions = new Float32Array((segments + 1) * sides * 3);
    const indices: number[] = [];
    for (let segment = 0; segment < segments; segment++) for (let side = 0; side < sides; side++) {
      const a = segment * sides + side, b = segment * sides + (side + 1) % sides;
      indices.push(a, b, a + sides, b, b + sides, a + sides);
    }
    result.setAttribute("position", new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage));
    result.setIndex(indices);
    return result;
  }, []);
  const geometryRef = useRef(geometry);
  const dripGeometry = useMemo(() => new TubeGeometry(new CatmullRomCurve3([
    new Vector3(-0.55, 0.037, 0.74), new Vector3(-0.54, 0.02, 0.845),
    new Vector3(-0.53, -0.22, 0.849), new Vector3(-0.55, -0.47, 0.845),
    new Vector3(-0.58, -0.49, 0.93),
  ]), 18, 0.016, 5, false), []);
  useEffect(() => () => { geometry.dispose(); dripGeometry.dispose(); }, [geometry, dripGeometry]);

  useFrame((_, delta) => {
    const state = useRoomStore.getState();
    if (!paused) elapsed.current += Math.min(delta, 0.05);
    const flowing = state.held && state.pouring && state.fill > 0 && !!mugRef.current && mugRef.current.rotation.z > 0.4;
    if (stream.current) stream.current.visible = flowing;
    if (droplets.current) droplets.current.visible = flowing && !paused;
    if (flowing && mugRef.current) {
      mugRef.current.updateWorldMatrix(true, false);
      // The source rim is irregular. This is its near, left-hand lip vertex
      // [1.6982, .01757, 1.06245] relative to MUG_HOME, just outside the ceramic.
      scratch.start.set(-0.164, 0.253, 0.055);
      mugRef.current.localToWorld(scratch.start);
      scratch.end.copy(POUR_POINTS[state.target]);
      const liveGeometry = geometryRef.current;
      const positions = liveGeometry.attributes.position as BufferAttribute;
      for (let segment = 0; segment <= segments; segment++) {
        const t = segment / segments;
        const radius = 0.011 - t * 0.003;
        const x = scratch.start.x + (scratch.end.x - scratch.start.x) * t - Math.sin(t * Math.PI) * 0.07;
        const y = scratch.start.y + (scratch.end.y - scratch.start.y) * (0.25 * t + 0.75 * t * t);
        const z = scratch.start.z + (scratch.end.z - scratch.start.z) * t;
        for (let side = 0; side < sides; side++) {
          const angle = side / sides * Math.PI * 2;
          positions.setXYZ(segment * sides + side, x + Math.cos(angle) * radius, y, z + Math.sin(angle) * radius);
        }
      }
      positions.needsUpdate = true;
      liveGeometry.computeBoundingSphere();
      if (droplets.current) {
        for (let index = 0; index < 12; index++) {
          const phase = (elapsed.current * 2.1 + index / 12) % 1;
          const angle = index * 2.39996;
          const radius = phase * (0.1 + (index % 3) * 0.03);
          scratch.object.position.set(scratch.end.x + Math.cos(angle) * radius, scratch.end.y + Math.sin(phase * Math.PI) * 0.055, scratch.end.z + Math.sin(angle) * radius);
          scratch.object.scale.setScalar((1 - phase) * 0.008 + 0.002);
          scratch.object.updateMatrix();
          droplets.current.setMatrixAt(index, scratch.object.matrix);
        }
        droplets.current.instanceMatrix.needsUpdate = true;
      }
    }
    (["plant", "pc", "desk"] as const).forEach((target, index) => {
      const puddle = puddles.current[index];
      if (!puddle) return;
      const amount = state.spills[target];
      puddle.visible = amount > 0.003;
      const size = target === "plant" ? Math.min(0.42, 0.13 + amount * 0.5) : Math.min(0.5, 0.055 + Math.sqrt(amount) * 0.44);
      puddle.scale.set(size, size * (target === "plant" ? 1 : 0.62), 1);
      (puddle.material as MeshBasicMaterial).opacity = Math.min(target === "plant" ? 0.72 : 0.8, 0.3 + amount * 2);
    });
    if (drip.current) drip.current.visible = state.spills.pc > 0.075;
  }, -1); // After the mug's -2 pose update, before the normal render pass.

  return <group>
    <mesh ref={stream} geometry={geometry} visible={false} renderOrder={3}>
      <meshBasicMaterial color={coffeeColor} transparent opacity={0.88} toneMapped={false} />
    </mesh>
    <instancedMesh ref={droplets} args={[undefined, undefined, 12]} visible={false} frustumCulled={false}>
      <sphereGeometry args={[1, 6, 4]} /><meshBasicMaterial color="#705034" toneMapped={false} />
    </instancedMesh>
    {(["plant", "pc", "desk"] as const).map((target, index) => <mesh key={target} ref={(mesh) => { puddles.current[index] = mesh; }} position={POUR_POINTS[target]} rotation={[-Math.PI / 2, 0, target === "desk" ? 0.24 : 0]} visible={false}>
      <circleGeometry args={[1, 32]} /><meshBasicMaterial color={target === "plant" ? "#211810" : "#432919"} transparent opacity={0.7} depthWrite={false} toneMapped={false} />
    </mesh>)}
    <mesh ref={drip} geometry={dripGeometry} visible={false}><meshBasicMaterial color="#51341f" transparent opacity={0.82} toneMapped={false} /></mesh>
  </group>;
}
