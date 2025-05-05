import { PermissionsByRole, Role, User } from "../auth/index";
import { z } from "zod";

export const renderFunction = z.function().args(z.any()).returns(z.void());
export const render = z.object({
  component: renderFunction,
});

export const renderKeys = render.keyof();

export const roleSchema = z.union([z.literal("ADMIN"), z.literal("DOCTOR")]);
export const typeSchema = z.union([
  z.literal("simple-calendar"),
  z.literal("extended-calendar"),
]);

export const onSchema = z.object({
  "create-schedule": z
    .function()
    .args(z.object({ name: z.string(), date: z.date() }))
    .returns(z.void()),
});

export const onKeys = onSchema.keyof();

export const optionsSchema = z.object({
  name: z.string(),
  type: typeSchema,
  on: onSchema.optional(),
  render: render.optional(),
  // policies: z.record(roleSchema)
});

export const extensionSchema = z
  .object({
    name: z.string(),
  })
  .merge(optionsSchema);

export type Type = z.infer<typeof typeSchema>;

export type Render = z.infer<typeof render>;
export type RenderKeys = z.infer<typeof renderKeys>;

export type OnParameters<O extends keyof z.infer<typeof onSchema>> = Parameters<
  z.infer<typeof onSchema>[O]
>;

export type On = z.infer<typeof onSchema>;
export type OnKeys = z.infer<typeof onKeys>;

export interface Options extends OptionsSchema {
  user?: User;
  policies?: Record<Role, PermissionsByRole>;
}

export interface ExtensionConfig extends ExtensionConfigSchema {
  user?: User;
  policies?: Record<Role, PermissionsByRole>;
}

export type OptionsSchema = z.infer<typeof optionsSchema>;

export type ExtensionConfigSchema = z.infer<typeof extensionSchema>;
