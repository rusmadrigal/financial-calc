import type { SchemaTypeDefinition } from "sanity";
import { blockContent } from "./blockContent";
import { toolCategory } from "./toolCategory";
import { calculatorPage } from "./calculatorPage";

export const schemaTypes: SchemaTypeDefinition[] = [
  blockContent,
  toolCategory,
  calculatorPage,
];
