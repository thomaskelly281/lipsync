import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "./Experience";
import { Visualizer } from "./Visualizer";

const examples = [
  {
    label: "Visualizer",
    href: "#",
  },
  {
    label: "3D model",
    href: "#model",
  },
];

export const UI = () => {
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.replace("#", "")
  );

  useEffect(() => {
    // When hash in the url changes, update the href state
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <section className="flex flex-col-reverse lg:flex-row overflow-hidden h-full w-full">
      <div className="p-10 lg:max-w-2xl overflow-y-auto">
        <a
          className="pointer-events-auto select-none opacity-0 animate-fade-in-down animation-delay-200 "
          href="https://wawasensei.dev"
          target="_blank"
        >
          <img
            src="/images/wawasensei.png"
            alt="Wawa Sensei logo"
            className="w-20 h-20 object-contain"
          />
        </a>
        <Visualizer />
      </div>
      <div className="flex-1 bg-white relative">
        <Canvas
          shadows
          gl={{ antialias: false }}
          camera={{ position: [12, 8, 26], fov: 30 }}
        >
          <Suspense>
            <Experience />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};
