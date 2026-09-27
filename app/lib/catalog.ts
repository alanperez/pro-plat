import { z } from "zod";
import type { ModelId } from "./models";

export const toolId = z.enum(["generate", "enhance"]);
export type ToolId = z.infer<typeof toolId>;

export const ratioId = z.enum(["1:1", "3:2", "2:3"]);
export type RatioId = z.infer<typeof ratioId>;

export const dimensions: Record<RatioId, readonly [number, number]> = {
    "1:1": [1024, 1024],
    "3:2": [1536, 1024],
    "2:3": [1024, 1536]
};

export type Control = {
    key: string;
    label: string;
    values: readonly string[]
};

export type Tool = {
    id: ToolId;
    name: string;
    description: string;
    icon: string;
    group: "create" | "utility";
    source: "none" | "optional" |"required";
    mask: boolean;
    models: readonly ModelId[];
    outputs: {default: number, max: number };
    controls: readonly Control[];
    note?: string;
}


export const tools: readonly Tool[] = [
    {
        id: "generate",
        name: "Text to Image",
        description: "Start with words, a reference, or a visual direction.",
        icon: "Image",
        group: "create",
        source: "optional",
        mask: false,
        models: ["openai", "bfl-kontext"],
        outputs: { default: 1, max: 1},
        controls: [
            {            
                key: "subject",
                label: "Visual starting point",
                values: ["None", "Skincare", "Furniture", "Architecture"]
            },
            {
                key: "style",
                label: "Look",
                values: ["Natural", "Editorial", "Minimal", "Cinematic", "Illustration"]
            }
        ]
    },
    {
        id: "enhance",
        name: "Enhancer",
        description: "Bring clarity to your image.",
        icon: "WandSparkles",
        group: "utility",
        source: "required",
        mask: false,
        models: ["local"],
        outputs: {
            default: 1, max: 1
        },
        controls: [
            {
                key: "scale",
                label: "Output size",
                values: ["1x2"]
            },
            {
                key: "strength",
                label: "Clarity",
                values: ["Gentle", "standard"]
            }
        ],
        note: "Conservative local processing. AI detail synthesis deferred"
    }
]

export const toolById = (id: string) => tools.find((t) => t.id === id)
