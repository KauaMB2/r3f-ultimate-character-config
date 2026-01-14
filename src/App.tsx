import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Leva } from "leva";
import { useState } from "react";
import { DEFAULT_CAMERA_POSITION } from "./components/CameraManager.js";
import { Experience } from "./components/Experience.js";
import { UI } from "./components/UI.js";
import { MobileWarning, useMobileDetection } from "./components/MobileWarningComponent.js";

function App() {
  const isMobile = useMobileDetection();
  const [showWarning, setShowWarning] = useState(true);

  if (isMobile && showWarning) {
    return <MobileWarning onContinue={async () => setShowWarning(false)} />;
  }

  return (
    <>
      <Leva hidden />
      <Canvas camera={{ position: DEFAULT_CAMERA_POSITION, fov: 42 }}>
        <color attach="background" args={["#171720"]} />
        <fog attach="fog" args={["#171720", 60, 90]} />
        <ambientLight intensity={0.2} />
        <Experience />
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={1.42} />
        </EffectComposer>
      </Canvas>
      <UI />
    </>
  );
}

export default App;