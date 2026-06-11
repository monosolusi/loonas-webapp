export const RawMaterialUnit = {
  KG: "kg",
  GRAM: "gram",
  LITER: "liter",
  ML: "ml",
  PCS: "pcs",
  BUTIR: "butir",
} as const;

export type RawMaterialUnitType = (typeof RawMaterialUnit)[keyof typeof RawMaterialUnit];

export const RawMaterialUnitLabel: Record<RawMaterialUnitType, string> = {
  [RawMaterialUnit.KG]: "Kilogram (kg)",
  [RawMaterialUnit.GRAM]: "Gram (gram)",
  [RawMaterialUnit.LITER]: "Liter (liter)",
  [RawMaterialUnit.ML]: "Mililiter (ml)",
  [RawMaterialUnit.PCS]: "Pcs",
  [RawMaterialUnit.BUTIR]: "Butir",
};
