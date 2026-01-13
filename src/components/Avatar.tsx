import { NodeIO } from "@gltf-transform/core";
import { dedup, draco, prune, quantize } from "@gltf-transform/functions";
import { useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Group, AnimationClip, Mesh, Object3D, SkinnedMesh } from "three";
import { GLTFExporter } from "three-stdlib";
import { useConfiguratorStore } from "../store.js";
import { Asset } from "./Asset.js";
import { GLTF } from "three-stdlib";
import { CustomizationAsset } from "../utils/models/CustomizationAsset";

// Tipos para os nodes do GLTF
interface ArmatureNodes {
  mixamorigHips: Object3D;
  Plane: SkinnedMesh;
  [key: string]: Object3D | Mesh | SkinnedMesh;
}

export const Avatar = ({ ...props }: any) => {
  const group = useRef<Group>(null);
  
  // Use type assertion for the GLTF result
  const armatureGltf = useGLTF("/models/Armature.glb") as unknown as GLTF & { nodes: ArmatureNodes };
  const posesGltf = useGLTF("/models/Poses.glb") as GLTF & { animations: AnimationClip[] };
  
  const { nodes } = armatureGltf;
  const { animations } = posesGltf;
  
  const customization = useConfiguratorStore((state) => state.customization);
  const { actions } = useAnimations(animations, group);
  const setDownload = useConfiguratorStore((state) => state.setDownload);

  const pose = useConfiguratorStore((state) => state.pose);

  useEffect(() => {
    function download() {
      const exporter = new GLTFExporter();
      
      if (!group.current) {
        console.error("Group ref is not available");
        return;
      }

      exporter.parse(
        group.current,
        async function (result: ArrayBuffer | { [key: string]: any }) {
          try {
            if (result instanceof ArrayBuffer) {
              const io = new NodeIO();

              // Read.
              const document = await io.readBinary(new Uint8Array(result));
              await document.transform(
                prune(),
                dedup(),
                draco(),
                quantize()
              );

              // Write.
              const glb = await io.writeBinary(document);

              save(
                new Blob([glb], { type: "application/octet-stream" }),
                `avatar_${+new Date()}.glb`
              );
            } else {
              console.error("GLTFExporter result is not an ArrayBuffer");
            }
          } catch (error) {
            console.error("Error processing GLTF:", error);
          }
        },
        function (error: ErrorEvent) {
          console.error(error);
        },
        { binary: true }
      );
    }

    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob: Blob, filename: string) {
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      
      // Cleanup
      URL.revokeObjectURL(link.href);
    }
    
    setDownload(download);
    
    // Cleanup function
    return () => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
    };
  }, [setDownload]);

  useEffect(() => {
    const action = actions[pose];
    if (action) {
      action.fadeIn(0.2).play();
      
      return () => {
        action.fadeOut(0.2).stop();
      };
    }
  }, [actions, pose]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          {nodes.mixamorigHips && (
            <primitive object={nodes.mixamorigHips} />
          )}
          {Object.keys(customization).map(
            (key) => {
              const asset = customization[key]?.asset as CustomizationAsset | undefined;
              if (asset?.url && nodes.Plane?.skeleton) {
                return (
                  <Suspense key={asset.id}>
                    <Asset
                      categoryName={key}
                      url={asset.url}
                      skeleton={nodes.Plane.skeleton}
                    />
                  </Suspense>
                );
              }
              return null;
            }
          )}
        </group>
      </group>
    </group>
  );
};
useGLTF.preload("/models/Armature.glb");
useGLTF.preload("/models/Poses.glb");