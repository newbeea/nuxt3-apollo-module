'use strict';

const pathe = require('pathe');
const url = require('url');
const kit = require('@nuxt/kit');

const index = kit.defineNuxtModule({
  meta: {
    name: "@nuxt3/apollo-module",
    configKey: "apollo"
  },
  setup(options, nuxt) {
    nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    nuxt.options.build.transpile.push("@apollo/client", "@vue/apollo-composable", "ts-invariant/process");
    const __dirname__ = pathe.dirname(url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('index.cjs', document.baseURI).href))));
    kit.addTemplate({
      filename: "apollo.options.mjs",
      getContents: () => `export default ${JSON.stringify(options)}`
    });
    kit.addPluginTemplate({
      src: pathe.resolve(__dirname__, "./plugin.mjs"),
      mode: "all"
    });
  }
});

module.exports = index;
