import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Avatar } from "./Avatar";
import { PostProcessing } from "./PostProcessing";
import { useExperienceControls } from "./useExperienceControls";

export const Experience = () => {
  const controls = useRef();
  const { dither, lighting, scene } = useExperienceControls();
  const autoRotate = useRef(scene.autoRotate);
  autoRotate.current = scene.autoRotate;

  useEffect(() => {
    controls.current.setLookAt(1, 2.2, 10, 0, 1.5, 0);
    controls.current.setLookAt(0.1, 1.7, 1, 0, 1.5, 0, true);
  }, []);

  useFrame(() => {
    if (autoRotate.current) {
      controls.current?.rotate(0.002, 0, true);
    }
  });

  return (
    <>
      <color attach="background" args={[scene.background]} />
      <CameraControls ref={controls} />
      <directionalLight
        position={[1, 0.5, -3]}
        intensity={lighting.keyIntensity}
        color={lighting.keyColor}
      />
      <directionalLight
        position={[-1, 0.5, -2]}
        intensity={lighting.fillIntensity}
        color={lighting.fillColor}
      />
      <directionalLight
        position={[1, 1, 3]}
        intensity={lighting.rimIntensity}
        color={lighting.rimColor}
      />
      <Avatar />
      <PostProcessing settings={dither} />
    </>
  );
};
