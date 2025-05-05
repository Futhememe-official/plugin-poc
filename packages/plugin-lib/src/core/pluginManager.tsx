import { Extension } from "./extension";
import { OnKeys, OnParameters, RenderKeys } from "./schema";

export class PluginManager {
  public plugins = new Map<string, Extension[]>();
  public current: Extension;

  constructor(plugins: Extension[], current?: string | null) {
    plugins.forEach((plugin) => {
      const { name } = plugin;
      if (!this.plugins.has(name)) {
        this.plugins.set(name, []);
      }
      this.plugins.get(name)?.push(plugin);
    });
    if (current) {
      this.current = this.plugins.get(current)?.[0] ?? plugins[0];
    } else {
      this.current = plugins[0];
    }
  }

  public chain: (extension: string) => {
    on<K extends OnKeys>(key: K, args: OnParameters<K>[0]): void;
    render: (name: RenderKeys) => any;
  } = (extension) => {
    const plugin = this.plugins.get(extension)?.[0];

    if (!plugin) {
      console.warn(`Plugin ${extension} not found`);
    }

    function on<K extends OnKeys>(key: K, args: OnParameters<K>[0]) {
      const onFunction = plugin?.on?.[key];
      if (!onFunction) {
        console.warn("function doesnt exist");
        return;
      }

      onFunction?.(args);
    }

    const render = (name: RenderKeys) => {
      const renderFunction = plugin?.render?.[name];
      if (!renderFunction) {
        console.warn("function doesnt exist");
        return;
      }

      return renderFunction;
    };

    return {
      on,
      render,
    };
  };
}
