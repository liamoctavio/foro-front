module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-coverage"),
      require("karma-jasmine-html-reporter"),
      require("karma-spec-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      clearContext: false,
    },
    reporters: ["spec", "progress", "kjhtml", "coverage"],
    coverageReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      subdir: "foro-front",
      reporters: [{ type: "lcov", subdir: "." }, { type: "text-summary" }],
    },
    browsers: ["Chrome"],
    restartOnFileChange: true,
  });
};
