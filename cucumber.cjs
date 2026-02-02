
module.exports = {
  default: {
    import: [
      'src/tests/ui/step-definitions/**/*.ts',
      'src/tests/ui/hooks/**/*.ts'
    ],

    loader: ['ts-node/esm'],

    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],

    paths: ['src/tests/ui/features/**/*.feature'],
    publishQuiet: true
  }
};
