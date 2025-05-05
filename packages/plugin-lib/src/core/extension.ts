import {
  ExtensionConfig,
  On,
  Options,
  optionsSchema,
  Render,
  Type,
} from "./schema";
import { AppAbility, defineAbilityFor, User } from "../auth/index";

export class Extension {
  public name: string;
  public type: Type;
  public on?: On;
  public render?: Render;
  public user?: User;
  public policies?: AppAbility;

  constructor(config: ExtensionConfig) {
    this.name = config.name || "extension";
    this.type = config.type || "simple-calendar";
    this.on = config.on;
    this.render = config.render;

    this.user = config.user;
    if (config.user && config.policies) {
      this.policies = defineAbilityFor(config.user, config.policies);
    }
  }

  static create(config: ExtensionConfig) {
    return new Extension(config);
  }

  static configure(options: Options) {
    const safed = optionsSchema.safeParse(options);
    if (!safed.success) {
      throw new Error("Invalid options provided");
    }
    const extension = new Extension({ ...options });

    return extension;
  }
}
