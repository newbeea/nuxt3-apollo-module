import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';
import { defineNuxtModule, addTemplate, addPluginTemplate } from '@nuxt/kit';

const index = defineNuxtModule({
  meta: {
    name: "@nuxt3/apollo-module",
    configKey: "apollo"
  },
  setup(options, nuxt) {
    nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    nuxt.options.build.transpile.push("@apollo/client", "ts-invariant/process");
    const __dirname__ = dirname(fileURLToPath(import.meta.url));
    addTemplate({
      filename: "apollo.options.mjs",
      getContents: () => `export default ${JSON.stringify(options)}`
    });
    addPluginTemplate({
      src: resolve(__dirname__, "./plugin.mjs"),
      mode: "all"
    });
  }
});

export { index as default };
