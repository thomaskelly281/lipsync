import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { NoToneMapping } from "three";
import { useEffect, useRef } from "react";
import { BlueDitherEffectImpl } from "./BlueDitherEffect";

export function PostProcessing({ settings }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef(null);
  const effect = useRef(null);
  const settingsRef = useRef(settings);

  settingsRef.current = settings;

  useEffect(() => {
    const ditherEffect = new BlueDitherEffectImpl(settingsRef.current);
    const comp = new EffectComposer(gl, { depthBuffer: true, multisampling: 0 });
    comp.addPass(new RenderPass(scene, camera));
    comp.addPass(new EffectPass(camera, ditherEffect));

    effect.current = ditherEffect;
    composer.current = comp;

    const previousToneMapping = gl.toneMapping;
    gl.toneMapping = NoToneMapping;

    return () => {
      gl.toneMapping = previousToneMapping;
      comp.dispose();
      composer.current = null;
      effect.current = null;
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [size]);

  useFrame((_, delta) => {
    effect.current?.updateSettings(settingsRef.current);

    if (!composer.current) {
      return;
    }

    const previousAutoClear = gl.autoClear;
    gl.autoClear = true;
    composer.current.render(delta);
    gl.autoClear = previousAutoClear;
  }, 1);

  return null;
}
