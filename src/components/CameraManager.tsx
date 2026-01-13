import { CameraControls } from "@react-three/drei";
import { button, useControls } from "leva";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { UI_MODES, useConfiguratorStore } from "../store.js";
import { CameraPlacement } from "../utils/models/CameraPlacement";
import { CameraControls as CameraControlsRefType } from "@react-three/drei";

export const START_CAMERA_POSITION = [500, 10, 1000] as const;
export const DEFAULT_CAMERA_POSITION = [-1, 1, 5] as const;
export const DEFAULT_CAMERA_TARGET = [0, 0, 0] as const;

interface CameraManagerProps {
  loading: boolean;
}

export const CameraManager = ({ loading }: CameraManagerProps) => {
  const controls = useRef<CameraControlsRefType>(null);
  const currentCategory = useConfiguratorStore(
    (state) => state.currentCategory
  );
  const initialLoading = useConfiguratorStore((state) => state.loading);
  const mode = useConfiguratorStore((state) => state.mode);
  
  useControls({
    getCameraPosition: button(() => {
      if (controls.current) {
        const position = new Vector3();
        controls.current.getPosition(position);
        console.log("Camera Position", [...position]);
      }
    }),
    getCameraTarget: button(() => {
      if (controls.current) {
        const target = new Vector3();
        controls.current.getTarget(target);
        console.log("Camera Target", [...target]);
      }
    }),
  });

  useEffect(() => {
    if (!controls.current) return;

    if (initialLoading) {
      controls.current.setLookAt(
        START_CAMERA_POSITION[0],
        START_CAMERA_POSITION[1],
        START_CAMERA_POSITION[2],
        DEFAULT_CAMERA_TARGET[0],
        DEFAULT_CAMERA_TARGET[1],
        DEFAULT_CAMERA_TARGET[2]
      );
    } else if (
      !loading &&
      mode === UI_MODES.CUSTOMIZE &&
      currentCategory?.cameraPlacement
    ) {
      const cameraPlacement = currentCategory.cameraPlacement as CameraPlacement;
      const position = cameraPlacement.position.map(Number);
      const target = cameraPlacement.target.map(Number);
      
      controls.current.setLookAt(
        position[0] ?? 0,
        position[1] ?? 0,
        position[2] ?? 0,
        target[0] ?? 0,
        target[1] ?? 0,
        target[2] ?? 0,
        true
      );
    } else {
      controls.current.setLookAt(
        DEFAULT_CAMERA_POSITION[0],
        DEFAULT_CAMERA_POSITION[1],
        DEFAULT_CAMERA_POSITION[2],
        DEFAULT_CAMERA_TARGET[0],
        DEFAULT_CAMERA_TARGET[1],
        DEFAULT_CAMERA_TARGET[2],
        true
      );
    }
  }, [currentCategory, mode, initialLoading, loading]);

  return (
    <CameraControls
      ref={controls}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minDistance={2}
      maxDistance={8}
    />
  );
};