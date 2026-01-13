import { create } from "zustand";
import { MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils.js";
import { CustomizationGroup } from "./utils/models/CustomizationGroup";
import { CustomizationAsset } from "./utils/models/CustomizationAsset";
import { CustomizationPalette } from "./utils/models/CustomizationPalette";
import { CameraPlacement } from "./utils/models/CameraPlacement";

// Importar dados locais
import { CustomizationGroupData } from "./utils/data/CustomizationGroup";
import { CustomizationAssetData } from "./utils/data/CustomizationAsset";
import { CustomizationPaletteData } from "./utils/data/CustomizationPalette";
import { CameraPlacementData } from "./utils/data/CameraPlacement";

export const PHOTO_POSES = {
  Idle: "Idle",
  Chill: "Chill",
  Cool: "Cool",
  Punch: "Punch",
  Ninja: "Ninja",
  King: "King",
  Busy: "Busy",
};

export const UI_MODES = {
  PHOTO: "photo",
  CUSTOMIZE: "customize",
};

export type PhotoPose = keyof typeof PHOTO_POSES;
export type UIMode = keyof typeof UI_MODES;

interface CustomizationCategory {
  [categoryName: string]: {
    asset?: CustomizationAsset | null;
    color?: string;
  };
}

export interface LockedGroupInfo {
  name: string;
  categoryName: string;
}

interface ConfiguratorStore {
  loading: boolean;
  mode: string;
  setMode: (mode: string) => void;
  pose: string;
  setPose: (pose: string) => void;
  categories: CustomizationGroup[];
  currentCategory: CustomizationGroup | null;
  assets: CustomizationAsset[];
  lockedGroups: Record<string, LockedGroupInfo[]>;
  skin: MeshStandardMaterial;
  customization: CustomizationCategory;
  download: () => void;
  setDownload: (download: () => void) => void;
  screenshot: () => void;
  setScreenshot: (screenshot: () => void) => void;
  updateColor: (color: string) => void;
  updateSkin: (color: string) => void;
  fetchCategories: () => Promise<void>;
  setCurrentCategory: (category: CustomizationGroup & { assets?: CustomizationAsset[] }) => void;
  changeAsset: (category: string, asset: CustomizationAsset | null) => void;
  randomize: () => void;
  applyLockedAssets: () => void;
}

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  loading: true,
  mode: UI_MODES.CUSTOMIZE,
  setMode: (mode: string) => {
    set({ mode });
    if (mode === UI_MODES.CUSTOMIZE) {
      set({ pose: PHOTO_POSES.Idle });
    }
  },
  pose: PHOTO_POSES.Idle,
  setPose: (pose: string) => set({ pose }),
  categories: [],
  currentCategory: null,
  assets: [],
  lockedGroups: {},
  skin: new MeshStandardMaterial({ color: 0xf5c6a5, roughness: 1 }),
  customization: {},
  download: () => {},
  setDownload: (download: () => void) => set({ download }),
  screenshot: () => {},
  setScreenshot: (screenshot: () => void) => set({ screenshot }),
  updateColor: (color: string) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [state.currentCategory!.name!]: {
          ...state.customization[state.currentCategory!.name!],
          color,
        },
      },
    }));
    if (get().currentCategory!.name === "Head") {
      get().updateSkin(color);
    }
  },
  updateSkin: (color: string) => {
    get().skin.color.set(color);
  },
  fetchCategories: async () => {
    // Usar dados locais em vez do PocketBase
    const categories = [...CustomizationGroupData];
    const assets = [...CustomizationAssetData];
    const palettes = [...CustomizationPaletteData];
    const cameraPlacements = [...CameraPlacementData];
    
    const customization: CustomizationCategory = {};
    
    categories.forEach((category) => {
      // Filtrar assets por group name
      category.assets = assets.filter((asset) => asset.group === category.name);
      
      // Adicionar objetos completos para paleta de cores e posição da câmera
      category.colorPalette = palettes.find(p => p.id === category.colorPaletteId);
      category.cameraPlacement = cameraPlacements.find(c => c.id === category.cameraPlacementId);
      
      // Inicializar customização
      customization[category.name!] = {
        color: category.colorPalette?.colors?.[0] || "",
      };
      
      if (category.startingAssetId) {
        customization[category.name!]!.asset = category.assets?.find(
          (asset) => asset.id === category.startingAssetId
        ) || null;
      }
    });

    set({
      categories: categories as (CustomizationGroup & { 
        assets?: CustomizationAsset[];
        colorPalette?: CustomizationPalette;
        cameraPlacementData?: CameraPlacement;
      })[],
      currentCategory: categories[0] as (CustomizationGroup & { 
        assets?: CustomizationAsset[];
        colorPalette?: CustomizationPalette;
        cameraPlacementData?: CameraPlacement;
      }),
      assets,
      customization,
    });

    await new Promise((resolve)=> {
      setInterval(() => resolve(true), 2000);
    });
    set({loading: false});
    
    // Aplicar cor inicial da pele
    const headCategory = categories.find(cat => cat.name === "Head");
    if (headCategory?.colorPalette?.colors?.[0]) {
      get().updateSkin(headCategory.colorPalette.colors[0]);
    }
    
    get().applyLockedAssets();
  },
  setCurrentCategory: (category: CustomizationGroup & { assets?: CustomizationAsset[] }) => 
    set({ currentCategory: category }),
  changeAsset: (category: string, asset: CustomizationAsset | null) => {
    set((state) => ({
      customization: {
        ...state.customization,
        [category]: {
          ...state.customization[category],
          asset,
        },
      },
    }));
    get().applyLockedAssets();
  },
  randomize: () => {
    const customization: CustomizationCategory = {};
    get().categories.forEach((category) => {
      let randomAsset = category.assets?.[randInt(0, category.assets!.length - 1)] || null;
      if (category.removable) {
        if (randInt(0, category.assets!.length - 1) === 0) {
          randomAsset = null;
        }
      }
      const randomColor =
        category.colorPalette?.colors?.[
          randInt(0, category.colorPalette.colors.length - 1)
        ] as string;
      customization[category.name!] = {
        asset: randomAsset,
        color: randomColor,
      };
      if (category.name === "Head") {
        get().updateSkin(randomColor);
      }
    });
    set({ customization });
    get().applyLockedAssets();
  },

  applyLockedAssets: () => {
    const customization = get().customization;
    const categories = get().categories;
    const lockedGroups: Record<string, LockedGroupInfo[]> = {};

    Object.values(customization).forEach((category) => {
      const cat = category as any;
      if (cat?.asset?.lockedGroups) {
        cat.asset.lockedGroups.forEach((group: string) => {
          const categoryName = categories.find(
            (category) => category.id === group
          )!.name!;
          if (!lockedGroups[categoryName]) {
            lockedGroups[categoryName] = [];
          }
          const lockingAssetCategoryName = categories.find(
            (cat) => cat.id === cat.asset?.id
          )!.name!;
          lockedGroups[categoryName].push({
            name: cat.asset.name,
            categoryName: lockingAssetCategoryName,
          });
        });
      }
    });

    set({ lockedGroups });
  },
}));

// Inicializar automaticamente
useConfiguratorStore.getState().fetchCategories();