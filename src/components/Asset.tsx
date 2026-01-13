import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import { useConfiguratorStore } from "../store.js";
import { Object3D, Mesh, Material, BufferGeometry, Skeleton, MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";

interface AssetProps {
  url: string;
  categoryName: string;
  skeleton: Skeleton;
}

interface AttachedItem {
  geometry: BufferGeometry;
  material: Material;
  morphTargetDictionary?: { [key: string]: number } | undefined;
  morphTargetInfluences?: number[] | undefined;
}

export const Asset = ({ url, categoryName, skeleton }: AssetProps) => {
  const gltf = useGLTF(url) as GLTF;
  const { scene } = gltf;

  const customization = useConfiguratorStore((state) => state.customization);
  const lockedGroups = useConfiguratorStore((state) => state.lockedGroups);

  const assetColor = customization[categoryName]?.color;

  const skin = useConfiguratorStore((state) => state.skin);

  useEffect(() => {
    scene.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (mesh.isMesh && mesh.material) {
        const material = mesh.material as MeshStandardMaterial;
        if (material.name.includes("Color_")) {
          material.color.set(assetColor || "#ffffff");
        }
      }
    });
  }, [assetColor, scene]);

  const attachedItems = useMemo(() => {
    const items: AttachedItem[] = [];
    
    scene.traverse((child: Object3D) => {
      const mesh = child as Mesh;
      if (mesh.isMesh && mesh.geometry && mesh.material) {
        const material = mesh.material as Material;
        
        items.push({
          geometry: mesh.geometry,
          material: material.name.includes("Skin_") ? skin : material,
          morphTargetDictionary: mesh.morphTargetDictionary,
          morphTargetInfluences: mesh.morphTargetInfluences,
        });
      }
    });
    
    return items;
  }, [scene, skin]);

  if (lockedGroups[categoryName]) {
    return null;
  }

  return (
    <>
      {attachedItems.map((item, index) => (
        <skinnedMesh
          key={index}
          geometry={item.geometry}
          material={item.material}
          skeleton={skeleton}
          morphTargetDictionary={item.morphTargetDictionary}
          morphTargetInfluences={item.morphTargetInfluences}
          castShadow
          receiveShadow
        />
      ))}
    </>
  );
};