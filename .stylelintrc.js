module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'function-no-unknown': null,
    "no-duplicate-selectors": null,
    "number-leading-zero": "always",
    "block-no-empty": null,
    "selector-class-pattern": null,
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { "ignoreShorthands": ["/flex/"] },
    ],
    "custom-property-pattern": null,
    "keyframes-name-pattern": null,
    "no-empty-source": null,
    "font-family-no-missing-generic-family-keyword": [
      true,
      {
        "ignoreFontFamilies": ["PingFangSC-Regular", "PingFangSC-Medium", "t"],
      }
    ],
    "unit-no-unknown": [true, { "ignoreUnits": ["rpx"] }],
    "function-url-quotes": null,
    "max-line-length": null,
    "at-rule-empty-line-before": ["always", { "ignore": ["after-comment"] }],
    "declaration-colon-newline-after": null,
    "no-descending-specificity": null,
    "selector-type-no-unknown": null,
    "color-function-notation": "legacy",
  },
  overrides: [
    { 
      files: ["**/*.less"],
      customSyntax: "postcss-less",
    },
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
    },
    {
      files: ['*.html', '**/*.{html,vue}'],
      customSyntax: 'postcss-html',
    },
  ],
};
