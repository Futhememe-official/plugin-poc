import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { z } from "zod";

import { User } from "./models/user";
import { projectSubject } from "./subjects/project";
import { userSubject } from "./subjects/user";
import { Role } from "./roles";

export * from "./models/project";
export * from "./roles";

export type { User } from "./models/user";

const appAbilitiesSchema = z.union([
  userSubject,
  projectSubject,
  z.tuple([z.literal("manage"), z.literal("all")]),
]);

type AppAbilities = z.infer<typeof appAbilitiesSchema>;

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>
) => void;

export function defineAbilityFor(
  user: User,
  permissions: Record<Role, PermissionsByRole>
) {
  const builder = new AbilityBuilder(createAppAbility);

  if (typeof permissions[user.role] !== "function") {
    throw new Error(`permissions for role ${user.role} not found`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build({
    detectSubjectType(subject) {
      return subject.__typename;
    },
  });

  ability.can = ability.can.bind(ability);
  ability.cannot = ability.cannot.bind(ability);

  return ability;
}
