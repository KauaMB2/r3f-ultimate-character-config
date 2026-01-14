import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager.js";
import { Experience } from "./components/Experience.js";
import { UI } from "./components/UI.js";
import { MobileWarning, useMobileDetection } from "./components/MobileWarningComponent.js";
import { useState } from "react";

function App() {
  const isMobile = useMobileDetection();
  const [showWarning, setShowWarning] = useState(true);
  if (isMobile && showWarning) {
    return <MobileWarning onContinue={async () => setShowWarning(false)} />;
  }

  return (
    <>
      <Leva hidden />
      <UI />
      <Canvas
        camera={{
          position: DEFAULT_CAMERA_POSITION,
          fov: 45,
        }}
        gl={{
          preserveDrawingBuffer: true,
        }}
        shadows
      >
        <color attach="background" args={["#130f30"]} />
        <fog attach="fog" args={["#130f30", 10, 40]} />
        <group position-y={-1}>
          <Experience />
        </group>
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1.2} intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
