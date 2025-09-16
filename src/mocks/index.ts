export interface OptionType {
  label: string;
  value: string;
}

export const dropdownLoadOptions: OptionType[] = [
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
  { label: "Office Space", value: "office_space" },
  { label: "Retail Shop", value: "retail_shop" },
  { label: "Warehouse", value: "warehouse" },
];

export interface DocumentType {
  name: string;
  file: File;
}
