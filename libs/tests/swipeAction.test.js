const DEFAULT_PASSWORD = "12345678";
//external dependancies
const { remote } = require("webdriverio");
const { os, language, port } = require("../../configs/os_lang.json");
const desired_capabilities = (require("../../configs/testCapabilies.json")).qa[1];

const ViewElements = require("../ViewElements");
const utils = require("../utils");
const { permissionHandler, eraseDataHandler }  = require("../test_helper/alterFlowHandlers")
const { loginFlow, recoveryFlow } = require("../test_helper/commonFlow");
const logger = new (require("../logger.js"))("debugswipeaction",true);

var client, makkii;
(async ()=>{
  client = await remote({
      port:port,
      logLevel: "debug",//"error",
      capabilities:desired_capabilities
  });
  await client.pause(4000);
  makkii = new ViewElements(client,language,os);
  await loginFlow(makkii,DEFAULT_PASSWORD,logger);
  let newAccountName = utils.generateValidPassword();
  await createCoin(makkii,"Aion",newAccountName);

  await client.pause(1000);
  await makkii.loadPage("walletPage");
  await utils.scrollElementIntoView(client,makkii.views.walletPage.Acc_ListView,["text", newAccountName])
  .then((elem)=>{
    console.log("check if newAccount exist:\t",elem.hasOwnProperty("error"));
  },()=>{
    return makkii.findElementByText(newAccountName);
  });

})();


async function createCoin(app,coinType,name){
  await app.loadPage("walletPage");
  await app.views.walletPage.Add_Account_Btn.click();
  await app.loadPage("selectCoinPage");
  await app.views.selectCoinPage[coinType+"_Btn"].click();
  await app.loadPage("addFromPage");
  await app.views.addFromPage.Create_Btn.click();
  await app.loadPage("accountNamePage");
  await app.views.accountNamePage.Account_Name_TextField.setValue(name);
  await app.views.accountNamePage.Save_Btn.click();
}
