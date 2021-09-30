const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const semver = require('semver');

function injectSassVariables(
  config,
  file,
  modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
) {
  modules.forEach((match) => {
    for (let i = 0; i < 2; i++) {
      const boolean = Boolean(i);
      const rule = boolean ? 'sass' : 'scss';
      const end = boolean ? "'" : "';";

      config.module
        .rule(rule)
        .oneOf(match)
        .use('sass-loader')
        .tap((opt) => mergeSassVariables(opt, `'${file}${end}`));
    }
  });
}

// Create an import statement
// to bootstrap a users variables
function mergeSassVariables(opt, file) {
  const variables = `@import ${file}`;

  let sassLoaderVersion;
  try {
    sassLoaderVersion = semver.major(
      require('sass-loader/package.json').version
    );
  } catch (e) {}

  // Merge with user-defined loader data config
  if (sassLoaderVersion < 8) opt.data = variables;
  else if (sassLoaderVersion < 9) opt.prependData = variables;
  else opt.additionalData = variables;

  return opt;
}

module.exports = {
  chainWebpack: (config) => {
    config.devtool('source-map');

    // remove typecheck
    config.plugins.delete('fork-ts-checker');

    config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
      {
        // Languages are loaded on demand at runtime
        languages: ['json'],
      },
    ]);

    //injectSassVariables(config, `~/dev/presets/shrine/preset/variables.scss`);

    return config;
  },
  devServer: {
    watchOptions: {
      ignored: ['node_modules'],
      poll: true,
    },
  },
  transpileDependencies: ['vuetify'],
};
