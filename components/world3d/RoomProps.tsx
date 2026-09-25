"use client";

import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Group, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { useRoomStore } from "@/store/room";
import CoffeePour, { POUR_POINTS } from "./CoffeePour";
import CoffeeSteam from "./CoffeeSteam";

export const MUG_HOME = new Vector3(1.858, -0.235, 1.009);
const MUG_REST = MUG_HOME.clone().add(new Vector3(0, 0.017, 0));
const CHAIR_PIVOT = new Vector3(0.747, -2.304, 2.633);
const PLANT_PIVOT = new Vector3(4.113, -3.315, -0.117);
export interface RoomMeshes { mug: Mesh; paper: Mesh; plant: Mesh; chairSeat: Mesh; chairBase: Mesh; desk: Mesh; computer: Mesh }
type RoomHover = "mug" | "paper" | "plant" | "pc" | "chair" | "desk";

export default function RoomProps({ meshes, interactive, paused }: { meshes: RoomMeshes; interactive: boolean; paused: boolean }) {
  const mug = useRef<Group>(null);
  const coffee = useRef<Mesh>(null);
  const chair = useRef<Group>(null);
  const plant = useRef<Group>(null);
  const targetRing = useRef<Mesh>(null);
  const powerOn = useRoomStore((state) => state.powerOn);
  const held = useRoomStore((state) => state.held);
  const wetPc = useRoomStore((state) => state.wetPc);
  const hasCoffee = useRoomStore((state) => state.fill > 0);
  const time = useRef(0);
  const plantAmount = useRef(0);
  const plantReaction = useRef(0);
  const targetPosition = useRef(new Vector3());
  const props = useMemo(() => {
    // The source uses world-space vertices. Shift object positions under explicit
    // pivots while retaining the original UVs, geometry and baked appearance.
    meshes.mug.position.copy(MUG_HOME).negate();
    meshes.chairSeat.position.copy(CHAIR_PIVOT).negate();
    meshes.chairBase.position.copy(CHAIR_PIVOT).negate();
    meshes.plant.position.copy(PLANT_PIVOT).negate();
    return meshes;
  }, [meshes]);

  function hover(event: ThreeEvent<PointerEvent>, object: RoomHover) {
    if (!interactive) return;
    event.stopPropagation();
    const state = useRoomStore.getState();
    state.setHovered(object);
  }
  function leave(object: RoomHover) {
    const state = useRoomStore.getState();
    if (state.hovered === object) state.setHovered(null);
  }
  function activate(event: ThreeEvent<MouseEvent>, object: RoomHover) {
    if (!interactive) return;
    event.stopPropagation();
    const state = useRoomStore.getState();
    if (object === "mug") { if (state.held) state.putDown(); else state.pickUp(); }
    else if (object === "paper") state.openNote();
    else if (object === "chair") state.swivelChair();
    else if (state.held) state.aim(object);
  }
  function handlers(object: RoomHover) {
    return { onClick: (event: ThreeEvent<MouseEvent>) => activate(event, object), onPointerOver: (event: ThreeEvent<PointerEvent>) => hover(event, object), onPointerOut: () => leave(object) };
  }

  useFrame((_, delta) => {
    const state = useRoomStore.getState();
    const step = Math.min(delta, 0.05);
    if (!paused) time.current += step;
    if (mug.current) {
      const destination = targetPosition.current;
      if (state.held) {
        destination.copy(POUR_POINTS[state.target]);
        destination.x += 0.32;
        destination.y += state.target === "plant" ? 3.46 : 1.08;
      }
      else destination.copy(MUG_REST);
      const ease = paused ? 1 : 1 - Math.exp(-step * 7);
      mug.current.position.lerp(destination, ease);
      const tilt = state.held && state.pouring && state.fill > 0 ? 1.16 : 0;
      mug.current.rotation.z += (tilt - mug.current.rotation.z) * ease;
      if (coffee.current) {
        coffee.current.position.y = -0.18 + state.fill * 0.42;
        coffee.current.visible = state.fill > 0.006;
      }
    }
    if (chair.current) {
      // Keep the full assembly together and stop the backrest before it reaches
      // the desktop. These angles were checked against the source mesh bounds.
      const rotation = [0, -0.58, 0.43][state.chairTurns % 3];
      chair.current.rotation.y += (rotation - chair.current.rotation.y) * (paused ? 1 : 1 - Math.exp(-step * 4));
    }
    if (state.spills.plant > plantAmount.current) plantReaction.current = 1;
    plantAmount.current = state.spills.plant;
    plantReaction.current = Math.max(0, plantReaction.current - step * 0.5);
    if (plant.current) plant.current.rotation.z = paused ? 0 : Math.sin(time.current * 5.5) * 0.009 * plantReaction.current;
    if (targetRing.current) {
      targetRing.current.visible = interactive && state.held;
      targetRing.current.position.copy(POUR_POINTS[state.target]);
      targetRing.current.position.y += 0.006;
      const size = state.target === "plant" ? 0.45 : 0.28;
      targetRing.current.scale.setScalar(size);
      (targetRing.current.material as MeshBasicMaterial).opacity = state.pouring ? 0.16 : 0.5;
    }
  }, -2); // Establish this frame's mug pose before CoffeePour reads its rim.

  return <group>
    <primitive object={props.desk} dispose={null} {...handlers("desk")} />
    <primitive object={props.computer} dispose={null} {...handlers("pc")} />
    <primitive object={props.paper} dispose={null} {...handlers("paper")} />
    <group ref={chair} position={CHAIR_PIVOT} {...handlers("chair")}>
      <primitive object={props.chairBase} dispose={null} />
      <primitive object={props.chairSeat} dispose={null} />
    </group>
    <group ref={plant} position={PLANT_PIVOT} {...handlers("plant")}><primitive object={props.plant} dispose={null} /></group>
    {/* A permanent cork coaster makes the source's baked contact shadow belong
        to something even while the mug is in hand. The mug rests on its top. */}
    <group position={[MUG_HOME.x, -0.491, MUG_HOME.z]}>
      <mesh><cylinderGeometry args={[0.278, 0.28, 0.018, 48]} /><meshBasicMaterial color="#695a43" toneMapped={false} /></mesh>
      <mesh position={[0, 0.0095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.264, 48]} /><meshBasicMaterial color="#807057" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.247, 0.251, 48]} /><meshBasicMaterial color="#a18b67" toneMapped={false} />
      </mesh>
    </group>
    <group ref={mug} position={MUG_REST} {...handlers("mug")}>
      <primitive object={props.mug} dispose={null} />
      <mesh ref={coffee} position={[0, 0.24, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.141, 32]} /><meshBasicMaterial color="#332117" toneMapped={false} />
      </mesh>
    </group>
    {!held && hasCoffee && <CoffeeSteam paused={paused} />}
    <CoffeePour mugRef={mug} paused={paused} />
    <mesh ref={targetRing} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
      <ringGeometry args={[0.94, 1, 48]} /><meshBasicMaterial color="#f2ead7" transparent opacity={0.5} depthWrite={false} toneMapped={false} />
    </mesh>
    {/* Generous invisible hit area over the source case's small power button. */}
    <group position={[-0.7, -0.13, 0.842]}>
      <mesh onClick={(event) => { if (!interactive) return; event.stopPropagation(); useRoomStore.getState().togglePower(); }} onPointerOver={(event) => hover(event, "pc")} onPointerOut={() => leave("pc")}>
        <boxGeometry args={[0.18, 0.17, 0.055]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh position={[0.085, -0.009, 0.012]}><circleGeometry args={[0.01, 12]} /><meshBasicMaterial color={wetPc ? "#91683e" : powerOn ? "#9bb890" : "#33352f"} toneMapped={false} /></mesh>
    </group>
  </group>;
}
