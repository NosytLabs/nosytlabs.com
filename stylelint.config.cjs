module.exports = {
  extends: ["stylelint-config-standard", "stylelint-config-tailwindcss"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen"],
      },
    ],
    "declaration-property-value-no-unknown": null,
    "selector-class-pattern": null,
    "declaration-empty-line-before": null,
    "rule-empty-line-before": null,
    "alpha-value-notation": null,
    "custom-property-empty-line-before": null,
    "media-feature-name-value-no-unknown": null,
    "no-descending-specificity": null,
    "color-function-notation": null,
    "custom-property-pattern": null,
    "color-function-alias-notation": null,
    "property-no-deprecated": null,
    "selector-not-notation": null,
    "color-hex-length": null,
  },
};