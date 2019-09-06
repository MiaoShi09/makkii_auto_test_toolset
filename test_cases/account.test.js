//external dependancies
const { remote } = require("webdriverio");
const assert = require("assert");

// configurations and data
const { os, language, port } = require("../configs/os_lang.json");
const desired_capabilities = (require("../configs/testCapabilies.json")).qa[1];
const TEST_DATA = require("../test_data/qa_data.json");
const TEST_NAME="account_test";
const DEFAULT_PASSWORD = "12345678";
const PAUSE_TIMEOUT=1000; // 1 SEC
const LOG_LEVEL = "debug";


// internal libs
const logger = new (require("../libs/logger.js"))(TEST_NAME,true,LOG_LEVEL);
const ViewElements = require("../libs/ViewElements");
const utils = require("../libs/utils");
const { permissionHandler, eraseDataHandler }  = require("../libs/test_helper/alterFlowHandlers")
const { loginFlow, recoveryFlow } = require("../libs/test_helper/commonFlow");


describe("account related test set",function(){
  var makkii, client;

  before(async function(){
    logger.updateTest(this.test);
    logger.divider("TEST NAME: "+ TEST_NAME);
    logger.divider("TEST INFORMATION ");
    logger.info(" > Operating System: "+ os);
    logger.info(" > System language: "+ language);
    logger.info(" > Desired Capabilities: " + JSON.stringify(desired_capabilities));
    logger.info(" > Test Log Level: "+ LOG_LEVEL);
    logger.info(" > Expected Test Password: " + DEFAULT_PASSWORD);

    logger.divider("Pre-condition: in order to track down all test data, recovery account from test seed phrase");
    client = await remote({
        port:port,
        logLevel: "silent",//"error",
        capabilities:desired_capabilities
    });
    await client.pause(PAUSE_TIMEOUT*6);
    makkii = new ViewElements(client,language,os);
    logger.info("connect to appium");
    await recoveryFlow(makkii,TEST_DATA.seed_phrase,DEFAULT_PASSWORD,logger);
    // await loginFlow(makkii, DEFAULT_PASSWORD,logger);
    logger.divider("Pre-condition: passed");
  });
  beforeEach(function(){
    logger.updateTest(this.currentTest);
  });
  describe("AAccImp#1: add crypto coin from HD",function(){


    it("AAccImp#1-Aion: add Aion account", async function(){
      logger.divider("AAccImp#1-Aion: add Aion account");
      await createCoin(makkii,"Aion");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Aion_hd"])
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Aion_hd"));

      });
      logger.divider("AAccImp#1-Aion: passed");
    });
    it("AAccImp#1-Ethereum: add Ethereum account", async function(){
      logger.divider("AAccImp#1-Ethereum: add Ethereum account");
      await createCoin(makkii,"Ethereum");
      await client.pause(PAUSE_TIMEOUT);

      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Ethereum_hd"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Ethereum_hd"));

      });
      logger.divider("AAccImp#1-Ethereum: passed");
    });
    it("AAccImp#1-BitCoin: add BitCoin account", async function(){
      logger.divider("AAccImp#1-BitCoin: add BitCoin account");
      await createCoin(makkii,"Bitcoin");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Bitcoin_hd"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Bitcoin_hd"));

      });
      logger.divider("AAccImp#1-BitCoin: passed");
    });
    it("AAccImp#1-LiteCoin:add LiteCoin account", async function(){
      logger.divider("AAccImp#1-LiteCoin: add LiteCoin account");
      await createCoin(makkii,"Litecoin");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client,makkii.views.walletPage.Acc_ListView,["text", "Litecoin_hd"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Litecoin_hd"));

      });
      logger.divider("AAccImp#1-LiteCoin: passed");
    });
    it("AAccImp#1-Tron:add Tron account", async function(){
      logger.divider("AAccImp#1-Tron: add Tron account");
      await createCoin(makkii,"Tron");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Tron_hd"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },(e)=>{
        logger.debug(e);
        return assert.doesNotReject(makkii.findElementByText("Tron_hd"));

      });
      logger.divider("AAccImp#1-Tron: passed");
    });
  });

  describe("AAccImp#2: add crypto coin from private key",function(){

    it("AAccImp#2-Aion: add Aion account", async function(){
      logger.divider("AAccImp#2-Aion: add Aion account");
      await importPKAcc(makkii,"Aion");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Aion_pk"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Aion_pk"));
      });
      logger.divider("AAccImp#2-Aion: passed");
    });

    it("AAccImp#2-Ethereum: add Ethereum account", async function(){
      logger.divider("AAccImp#2-Ethereum: add Ethereum account");
      await importPKAcc(makkii,"Ethereum");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Ethereum_pk"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Ethereum_pk"));
      });
      logger.divider("AAccImp#2-Ethereum: passed");
    });

    it("AAccImp#2-BitCoin: add BitCoin account", async function(){
      logger.divider("AAccImp#2-BitCoin: add BitCoin account");
      await importPKAcc(makkii,"Bitcoin");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Bitcoin_pk"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Bitcoin_pk"));
      });
      logger.divider("AAccImp#2-BitCoin: passed");
    });

    it("AAccImp#2-LiteCoin:add LiteCoin account", async function(){
      logger.divider("AAccImp#2-LiteCoin:add LiteCoin account");
      await importPKAcc(makkii,"Litecoin");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Litecoin_pk"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Litecoin_pk"));
      });
      logger.divider("AAccImp#2-LiteCoin: passed")
    });
    it("AAccImp#2-Tron:add Tron account", async function(){
      logger.divider("AAccImp#2-Tron:add Tron account");
      await importPKAcc(makkii,"Tron");
      await client.pause(PAUSE_TIMEOUT);
      await makkii.loadPage("walletPage");
      await utils.scrollElementIntoView(client, makkii.views.walletPage.Acc_ListView,["text", "Tron_pk"],150)
      .then((elem)=>{
        assert.equal(elem.hasOwnProperty("error"),false);
      },()=>{
        return assert.doesNotReject(makkii.findElementByText("Tron_pk"));
      });
      logger.divider("AAccImp#2-Tron: passed");
    });
  });
});





async function createCoin(app,coinType){
  await app.loadPage("walletPage");
  logger.info("click (+) to add address");
  await app.views.walletPage.Add_Account_Btn.click();
  await app.loadPage("selectCoinPage");
  logger.info("select "+coinType+" tab");
  await app.views.selectCoinPage[coinType+"_Btn"].click();
  await app.loadPage("addFromPage");
  logger.info("select create button");
  await app.views.addFromPage.Create_Btn.click();
  await app.loadPage("accountNamePage");

  await app.views.accountNamePage.Account_Name_TextField.setValue(coinType+"_hd");
  await app.views.accountNamePage.Save_Btn.click();
  logger.info("created "+coinType+" address from HD");
}

async function importPKAcc(app,coinType){
  await app.loadPage("walletPage");
  logger.info("click (+) to add address");
  await app.views.walletPage.Add_Account_Btn.click();
  await app.loadPage("selectCoinPage");
  logger.info("select "+coinType+" tab");
  await app.views.selectCoinPage[coinType+"_Btn"].click();
  await app.loadPage("addFromPage");
  logger.info("select import private key button");
  await app.views.addFromPage.Import_PK_Btn.click();
  await app.loadPage("privateKeyPage");
  logger.info("import "+coinType+" private key: "+ TEST_DATA.accounts[coinType][0].pk);
  await app.views.privateKeyPage.PK_TextField.setValue(TEST_DATA.accounts[coinType][0].pk);
  await app.views.privateKeyPage.Import_Btn.click();
  await app.loadPage("accountNamePage");
  await app.views.accountNamePage.Account_Name_TextField.setValue(coinType+"_pk");
  await app.app.hideKeyboard();
  await app.loadPage("accountNamePage");
  await app.views.accountNamePage.Save_Btn.click();
  logger.info("created "+coinType+" address from private key");
}
