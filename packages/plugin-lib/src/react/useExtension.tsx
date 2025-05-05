import { useMemo } from "react";
import { PluginManager } from "../core/pluginManager";
import { Extension } from "../core/extension";

interface UseExtensionOptions {
  plugins: Extension[];
  current?: string | null;
}

export function useExtension({ plugins, current }: UseExtensionOptions) {
  return useMemo(() => new PluginManager(plugins, current), [plugins]);
}
