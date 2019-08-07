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


// internal libs
const logger = new (require("../libs/logger.js"))(TEST_NAME,true);
const ViewElements = require("../libs/ViewElements");
const utils = require("../libs/utils");
const { permissionHandler, eraseDataHandler }  = require("../libs/test_helper/alterFlowHandlers")
const { loginFlow, recoveryFlow } = require("../libs/test_helper/commonFlow");


describe("account related test set",()=>{
  var makkii, client;

  before(async ()=>{
    logger.divider("Pre-condition: in order to track down all test data, recovery account from test seed phrase");
    client = await remote({
        port:port,
        logLevel: "silent",//"error",
        capabilities:desired_capabilities
    });
    makkii = new ViewElements(client,language,os);
    logger.info("connect to appium");
    await recoveryFlow(makkii,TEST_DATA.seed_phrase,DEFAULT_PASSWORD,logger);
    logger.divider("Pre-condition: passed");
  })

  describe("AAccImp#1: add crypto coin from HD",()=>{

    it("AAccImp#1-Aion: add Aion account", async ()=>{
      await createCoin(makkii,"Aion");
      await client.pause(PAUSE_TIMEOUT);
      await assert.doesNotReject(makkii.findElementByText("Aion_hd"));
    });
    it("AAccImp#1-Ethereum: add Ethereum account", async ()=>{
      await createCoin(makkii,"Ethereum");
      await client.pause(PAUSE_TIMEOUT);
      await assert.doesNotReject(makkii.findElementByText("Ethereum_hd"));
    });
    it("AAccImp#1-BitCoin: add BitCoin account", async ()=>{
      await createCoin(makkii,"Bitcoin");
      await client.pause(PAUSE_TIMEOUT);
      await assert.doesNotReject(makkii.findElementByText("Bitcoin_hd"));
    });
    it("AAccImp#1-LiteCoin:add LiteCoin account", async ()=>{
      await createCoin(makkii,"Litecoin");
      await client.pause(PAUSE_TIMEOUT);
      await assert.doesNotReject(makkii.findElementByText("Litecoin_hd"));
    });
    it("AAccImp#1-Tron:add Tron account", async ()=>{
      await createCoin(makkii,"Tron");
      await client.pause(PAUSE_TIMEOUT);

      await assert.doesNotReject(makkii.findElementByText("Tron_hd"));
    });
  });

  describe("AAccImp#2: add crypto coin from private key",()=>{

    it("AAccImp#2-Aion: add Aion account", async ()=>{

    });
    it("AAccImp#2-Ethereum: add Ethereum account", async ()=>{

    });
    it("AAccImp#2-BitCoin: add BitCoin account", async ()=>{

    });
    it("AAccImp#2-LiteCoin:add LiteCoin account", async ()=>{

    });
    it("AAccImp#2-Tron:add Tron account", async ()=>{

    });
  });
});





async function createCoin(app,coinType){
  await app.loadPage("walletPage");
  await app.views.walletPage.Add_Account_Btn.click();
  await app.loadPage("selectCoinPage");
  await app.views.selectCoinPage[coinType+"_Btn"].click();
  await app.loadPage("addFromPage");
  await app.views.addFromPage.Create_Btn.click();
  await app.loadPage("accountNamePage");
  await app.views.accountNamePage.Account_Name_TextField.setValue(coinType+"_hd");
  await app.views.accountNamePage.Save_Btn.click();
}

async function validateAccount(app, accountName, address){
  app.views.wallet
}
