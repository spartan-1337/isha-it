import {
  Float,
  OrbitControls,
  Line,
  PerspectiveCamera,
  useScroll,
} from "@react-three/drei";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

const LINE_NB_POINTS = 42;

export const Experience = () => {
  const curve = new useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(-2, 0, -20),
        new THREE.Vector3(-3, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50),
        new THREE.Vector3(7, 0, -60),
        new THREE.Vector3(5, 0, -70),
        new THREE.Vector3(0, 0, -80),
        new THREE.Vector3(0, 0, -90),
        new THREE.Vector3(0, 0, -100),
      ],
      false,
      "catmullrom",
      0.5
    );
  });

  const linePoint = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  });

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoint.length),
      linePoint.length - 1
    );

    const curPoint = linePoint[curPointIndex];

    cameraGroup.current.position.lerp(curPoint, delta * 24);
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <Float floatIntensity={2} speed={2}>
          <Airplane
            rotation-y={Math.PI / 2}
            scale={[0.2, 0.2, 0.2]}
            position-y={0.1}
          />
        </Float>
      </group>
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"white"}
            // ref={lineMaterialRef}
            transparent
            envMapIntensity={2}
            // onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>
      <Cloud
        scale={[0.3, 0.3, 0.4]}
        rotation-y={Math.PI / 9}
        position={[2, -0.2, -2]}
      />
      <Cloud
        scale={[0.3, 0.3, 0.4]}
        rotation-y={Math.PI / 9}
        position={[-1.5, -0.5, -2]}
      />
    </>
  );
};
