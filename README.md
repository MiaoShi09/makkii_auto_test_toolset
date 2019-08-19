## Requirements:
* nodejs (recommend v10.16.1 or higher)
* [appium server](http://appium.io/docs/en/about-appium/getting-started/?lang=en)
  * may need to start with `--tmp` option to avoid permission issues
* java sdk
* android tools
  * set up `$ANDROID_HOME`
  * update PATH `PATH="$JAVA_HOME/bin:$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin"`

### Help tools
* android studio(simulator)
* appium client(appium inspector)

## Run:
1. connect and start the testing simulator/device;
2. start Appium; make sure the server start on the port matches the one on `configs/os_lang.json`
3. check `adb devices` to make sure the testing simulator/devices is connected
4. check `configs/testCapabilies.json` contains the correct desired capabilities and the test cases are using the correct test cases.
5. install the latest test app package on the testing simulator/device
6. make sure get testing data from sharepoint and put it into `test_data/qa_data.json`
7. run the test cases or tooling scripts

  * Test Cases: located at `./test_cases/`, run test cases `./node_modules/.bin/mocha <testcases>.test.js --no-timeouts`, Or `npm run testAll [-- [options]]`. Check all the test commands in `package.json`.
    * `addressBook.test.js` requires no address in address book before it run.
  * Tooling scripts:
    * `./MAK-81.js` - keep register accounts until the seed phrase contains same words; it is the precondition to check bug MAK-81. run the script `node MAK-81`; and go to `test_logs/MAK-81<time in ms>.txt` to find the password.
    * `test_build_tools/getSecuredSourceCode.js` - a script helps grab the source code of a screenshot-forbidden section - e.g. mnemonic related sections;  run script:`node test`
  * Test Reports/logs: all the test cases and tools will generate test logs under `test_logs`; all the test cases will generate JUnit test reports under `test_reports`. There are some samples test reports under `test_reports_samples` folder.
    * If you wish to run the test scripts with Mocha default test report "spec" and view its report on command line, you can run test with `npm run <testscriptname> -- --no-config`
  * Test Log Level: There are different log levels: 0.error/divider, 1.info, 2.debug. To change the log level, go to each test scripts and update `LOG_LEVEL` with value below:
    * *error* - something unexpected happened on the test flow which will fail the test case;
    * *divider* - just to make log file more readable;
    * *info* - (default value) short message that tells testers what happened during the tests
    * *debug* - detailed information provides usable object status to help testers and engineers to locate bugs

## Add Test Cases
Notes:
  1. NameMapping/inspect an element through appium inspector; put the useful info/identity into mappedViews folder:

    * If the element is expected on a page, often be used by testcases, and its xPath are relatively stable, please put this element into `{givenPage/SectionName}NameMapping.json` file;
    * Some elements which are not very dependent on xPath or may appear on different pages, can be add into `mappedViews/validationElemNameMapping.json`.

  2. To use the mapped elements, checkout `libs/ViewElements.js`

    * `loadPage(${givenPage/SectionName})` should load all the elements in `{givenPage/SectionName}NameMapping.json`, add it can be accessed on `(ViewElements)makkii.views.${givenPage/SectionName}.${element_mapped_name}`;
    * To add new page/section, the new page/section name need to be added into `ViewElements.mapped_views`(prox. line 29);
    * All the elements in `mappedViews/validationElemNameMapping.json` can be accessed from `(ViewElements) makkii.getOrphanElem(${element_mapped_name})`;

  3. `libs/test_helper` contains some reusable test flow, like login, logout. `alterFlowHandlers` deals with popup windows that may or may not appear during the testing process; `commonFlow` deals with the most common used test flow.

----
Known issues:
* Appium crashes occasionally.
* Different devices and simulators will have different delay time; sometimes, `PAUSE_TIMEOUT` needs to be updated.
* Need to update name mapping when major UI update happens.
* Be care of "cn" punctuation characters.



TO DOs:
* clean up code and logs

May NOT continue to work in near future:
* work around wdio.config.js to figure out how run test cases and generate reports in one script
* make test cases work for IOS as well

Notes:
xpath tool:[http://www.qutoric.com/xslt/analyser/xpathtool.html](http://www.qutoric.com/xslt/analyser/xpathtool.html)
IOS related docs:[http://appium.io/docs/en/drivers/ios-xcuitest-real-devices/](http://appium.io/docs/en/drivers/ios-xcuitest-real-devices/)
