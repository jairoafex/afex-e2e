export default  {
  default: {
    require: [
      'tests/ui/step-definitions/**/*.ts',
      'tests/ui/hooks/**/*.ts'
    ],
    requireModule: ['ts-node/register'],
    format: [
      'progress',
      'html:reports/cucumber-report.html'
    ],
    paths: ['tests/ui/features/**/*.feature'],
    publishQuiet: true
  }
};