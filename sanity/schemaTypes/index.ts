import type { SchemaTypeDefinition } from "sanity";
import { toolCategory } from "./toolCategory";
import { calculatorPage } from "./calculatorPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  toolCategory,
  calculatorPage,
];
