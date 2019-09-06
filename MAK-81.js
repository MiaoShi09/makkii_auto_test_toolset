const { remote } = require('webdriverio');

const ViewElements = require("./libs/ViewElements");
const { eraseDataHandler, permissionHandler } = require("./libs/test_helper/alterFlowHandlers");
const { logoutFlow } = require("./libs/test_helper/commonFlow");
const SCRIPT_NAME = "MAK-81";
const { language , os } = require("./configs/os_lang.json");


var makkii,client;
var times = 1;
const desired_capabilities = (require("./configs/testCapabilies.json")).qa[1];
const opts = {
  port:4723,
  logLevel:'silent',
  capabilities:desired_capabilities
}

var logger = new (require("./libs/logger"))(SCRIPT_NAME,true);
var { generateValidPassword,haveSameWords } = require("./libs/utils.js");

var registration = async (i)=>{
  await makkii.isLoaded("Login_Btn");
  await makkii.loadPage("logInPage");
  await makkii.views.logInPage.Register_Btn.click();
  await client.pause(2000);
  await makkii.loadPage("registerPage");
  let newPassword = generateValidPassword();
  logger.info("new password is: "+ newPassword );
  await makkii.views.registerPage.Password_TextField.setValue(newPassword);
  await makkii.views.registerPage.Confirm_Password_TextField.setValue(newPassword);
  await makkii.views.registerPage.Register_Btn.click();
  await eraseDataHandler(makkii, true, logger);
  await makkii.isLoaded("Mnemonic_Cap");
  await makkii.loadPage("mnemonicInitPage");
  let _seedPhrase = await makkii.views.mnemonicInitPage.Mnemonic_Sec.$$("//android.widget.TextView");
  logger.debug(_seedPhrase.length);
  logger.info(_seedPhrase);
  if (await haveSameWords(_seedPhrase)){
    await makkii.views.mnemonicInitPage.Skip_Btn.click();
    logger.info("Total Register Time: "+ i);
  }else{
    await makkii.views.mnemonicInitPage.Skip_Btn.click();
    await permissionHandler(makkii,true,logger);
    await logoutFlow(makkii,logger);
    return registration(i+1)
  }
};


(async()=>{
  try{
    client = await remote(opts);
    makkii = new ViewElements(client,language,os);
    registration(times);
  }catch(e){
    logger.error(e);
    logger.info(times);
  }
})()
