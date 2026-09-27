import {z} from "zod";

export const modelId = z.enum([
    "openai",
    "bfl-kontext",
    "bfl-fill",
    "local"
]);

export type ModelId = z.infer<typeof modelId>;

export const modelLabels: Record<ModelId, string> = {
    openai: "GPT Image",
    "bfl-kontext": "FLUX Kontext Pro",
    "bfl-fill": "FLUX Fill Pro",
    local: "Local processing"
}
