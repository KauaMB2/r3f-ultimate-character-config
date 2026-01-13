import { CustomizationGroup } from "../models/CustomizationGroup";

export const CustomizationGroupData: CustomizationGroup[] = [
  {
    id: "group-head-001",
    name: "Head",
    position: 1,
    startingAssetId: "head-001",
    colorPaletteId: "skin-tones-001",
    cameraPlacementId: "camera-head-001",
    removable: false
  },
  {
    id: "group-hair-001",
    name: "Hair",
    position: 2,
    startingAssetId: "hair-001",
    colorPaletteId: "hair-colors-001",
    cameraPlacementId: "camera-hair-001",
    removable: true
  },
  {
    id: "group-face-001",
    name: "Face",
    position: 3,
    startingAssetId: "face-001",
    colorPaletteId: "skin-tones-001",
    cameraPlacementId: "camera-head-001",
    removable: false
  },
  {
    id: "group-eyes-001",
    name: "Eyes",
    position: 4,
    startingAssetId: "eyes-001",
    colorPaletteId: "", // Os olhos provavelmente não terão paleta de cores personalizável
    cameraPlacementId: "camera-head-001",
    removable: false
  },
  {
    id: "group-eyebrows-001",
    name: "Eyebrows",
    position: 5,
    startingAssetId: "eyebrows-001",
    colorPaletteId: "hair-colors-001",
    cameraPlacementId: "camera-head-001",
    removable: true
  },
  {
    id: "group-nose-001",
    name: "Nose",
    position: 6,
    startingAssetId: "nose-001",
    colorPaletteId: "", // O nariz geralmente usa a cor da pele
    cameraPlacementId: "camera-head-001",
    removable: false
  },
  {
    id: "group-facial-hair-001",
    name: "Facial Hair",
    position: 7,
    startingAssetId: "facialhair-001",
    colorPaletteId: "hair-colors-001",
    cameraPlacementId: "camera-head-001",
    removable: true
  },
  {
    id: "group-glasses-001",
    name: "Glasses",
    position: 8,
    startingAssetId: "glasses-001",
    colorPaletteId: "", // Óculos podem ter cores fixas ou outra paleta específica
    cameraPlacementId: "camera-head-001",
    removable: true
  },
  {
    id: "group-hat-001",
    name: "Hat",
    position: 9,
    startingAssetId: "hat-001",
    colorPaletteId: "", // Chapéus podem ter cores fixas ou paleta própria
    cameraPlacementId: "camera-head-001",
    removable: true
  },
  {
    id: "group-top-001",
    name: "Top",
    position: 10,
    startingAssetId: "top-001",
    colorPaletteId: "top-colors-001",
    cameraPlacementId: "camera-top-001",
    removable: false
  },
  {
    id: "group-bottom-001",
    name: "Bottom",
    position: 11,
    startingAssetId: "bottom-001",
    colorPaletteId: "bottom-colors-001",
    cameraPlacementId: "camera-bottom-001",
    removable: false
  },
  {
    id: "group-shoes-001",
    name: "Shoes",
    position: 12,
    startingAssetId: "shoes-001",
    colorPaletteId: "shoes-colors-001",
    cameraPlacementId: "camera-bottom-001",
    removable: true
  },
  {
    id: "group-accessories-001",
    name: "Accessories",
    position: 13,
    startingAssetId: "accessory-earring-001",
    colorPaletteId: "", // Acessórios podem ter cores variadas ou fixas
    cameraPlacementId: "camera-head-001",
    removable: true
  }
];