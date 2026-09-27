import { z } from "zod";
import { ratioId, toolById, toolId} from "./catalog";
import type { ToolId } from "./catalog";
import { LIMITS } from "./limits";
import { modelId } from "./models";
export const settingsSchema = z.object({
    prompt: z.string().trim().max(LIMITS.promptChars),
    count: z.number().int().min(1).max(LIMITS.maxOutputs),
    ratio: ratioId,
    options: z.record(z.string().max(40), z.string().max(LIMITS.optionValueChars)),
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
});

export type Settings = z.infer<typeof settingsSchema>;

export function defaults(id: ToolId): Settings {
    const tool = toolById(id);

    return {
        prompt: "",
        count: tool?.outputs.default ?? 1,
        ratio: "1:1",
        options: Object.fromEntries((tool?.controls ?? []).map((c) => [c.key, c.values[0] ?? ""])),
        x: 50,
        y: 60
    };
}

const runShape = z.object({
    requestKey: z.uuid(),
    tool: toolId,
    model: modelId,
    inputId: z.uuid().optional(),
    maskId: z.uuid().optional(),
    settings: settingsSchema,
});

type RunShape = z.infer<typeof runShape>;

const toolRules: Partial<Record<ToolId, (run: RunShape) => string | undefined>> = {
    generate: (run) => {
        const subject = run.settings.options.subject;
        const hasVisual = Boolean(run.inputId) || (subject !== undefined && subject !== "None");
        return !run.settings.prompt && !hasVisual ? "Add a prompt, a reference, or a visual starting point." : undefined
    }
}

export const runRequest = runShape.superRefine((run, ctx) => {
    const tool = toolById(run.tool);
    if(!tool) {
        return;
    }
    const fail = (message: string) => ctx.addIssue({
        code: "custom",
        message
    })

    if(!tool.models.includes(run.model)) {
        fail("That model isn't available for this tool.");
    }
    if(tool.source === "required" && !run.inputId) {
        fail("Add a source image first.")
    }
    if(tool.source === "none" && run.inputId) {
        fail("This tool doesn't take a source image")
    }

    for(const control of tool.controls) {
        if(!control.values.includes(run.settings.options[control.key] ?? "")) {
            fail(`Choose a valid ${control.label.toLowerCase()}.`);
        }
    }
    const message = toolRules[run.tool]?.(run);
    if(message) {
        fail(message);
    }
});

export type RunRequest = z.infer<typeof runRequest>;