module.exports = {
    reporter: ['mocha-junit-reporter'],
    reporterOptions: {
        mochaFile: "./test_reports/test"+Date.now()+".xml"
    },
    timeout: 0
}
