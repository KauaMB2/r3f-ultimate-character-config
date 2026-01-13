import { CameraPlacement } from "./CameraPlacement";
import { CustomizationAsset } from "./CustomizationAsset";
import { CustomizationPalette } from "./CustomizationPalette";

export interface CustomizationGroup {
  id: string;
  name: string;
  position: number;
  startingAssetId: string;
  assets?: CustomizationAsset[] | undefined;
  asset?: CustomizationAsset;
  colorPaletteId: string;
  colorPalette?: CustomizationPalette | undefined;
  cameraPlacementId: string;
  cameraPlacement?: CameraPlacement | undefined;
  removable: boolean;
}