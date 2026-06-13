import { useControls } from "leva";

export function useExperienceControls() {
  const dither = useControls("Dither Effect", {
    pixelSize: {
      value: 12,
      min: 2,
      max: 32,
      step: 1,
      label: "Pixel Size",
    },
    contrast: {
      value: 1.35,
      min: 0.5,
      max: 4,
      step: 0.05,
      label: "Contrast",
    },
    bias: {
      value: 0.08,
      min: -0.2,
      max: 0.5,
      step: 0.01,
      label: "Shadow Bias",
    },
    edgeStrength: {
      value: 18,
      min: 0,
      max: 80,
      step: 1,
      label: "Edge Sensitivity",
    },
    depthStrength: {
      value: 120,
      min: 0,
      max: 400,
      step: 5,
      label: "Depth Sensitivity",
    },
    detailMix: {
      value: 0.85,
      min: 0,
      max: 1,
      step: 0.05,
      label: "Motion Detail",
    },
    blueColor: {
      value: "#0000ff",
      label: "Dither Color",
    },
  });

  const lighting = useControls("Lighting", {
    keyIntensity: {
      value: 2,
      min: 0,
      max: 6,
      step: 0.1,
      label: "Key Light",
    },
    fillIntensity: {
      value: 2,
      min: 0,
      max: 6,
      step: 0.1,
      label: "Fill Light",
    },
    rimIntensity: {
      value: 2,
      min: 0,
      max: 6,
      step: 0.1,
      label: "Rim Light",
    },
    keyColor: {
      value: "#4444ff",
      label: "Key Color",
    },
    fillColor: {
      value: "#ff4444",
      label: "Fill Color",
    },
    rimColor: {
      value: "#ffffff",
      label: "Rim Color",
    },
  });

  const scene = useControls("Scene", {
    background: {
      value: "#ffffff",
      label: "Background",
    },
    autoRotate: {
      value: false,
      label: "Auto Rotate Camera",
    },
  });

  return { dither, lighting, scene };
}
