const webpack = require("webpack");

module.exports = function override(config, env) {
  // Modify the rule for source-map-loader
  config.module.rules.push({
    test: /\.js$/,
    enforce: "pre",
    use: ["source-map-loader"],
    exclude: /node_modules\/html5-qrcode/,
  });

  // Remove IgnorePlugin since it might not be helping here
  // Instead, we'll focus on making sure the source maps are handled correctly

  return config;
};
