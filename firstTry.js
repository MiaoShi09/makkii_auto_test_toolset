const { remote } = require('webdriverio');
var { generateValidPassword } = require("./libs/utils.js");
const ViewElements = require("./libs/ViewElements");
const lang = "cn";
const os = "android";


(async ()=>{
  const desired_capabilities = (require("./configs/testCapabilies.json")).qa[0];
  const opts = {
    port:4723,
    logLevel:'info',
    capabilities:desired_capabilities
  }


  const client = await remote(opts);
  console.log("\n\n\n\n");
  console.log(await client.getCurrentActivity());
  console.log("\n\n\n\n");
  const makkii = new ViewElements(client,lang,os);
  await makkii.isLoaded("Login_Btn");
  await makkii.loadPage("logInPage");
  makkii.views.logInPage.Register_Btn.click();

  await client.pause(2000);
  await makkii.loadPage("registerPage");
  let _caption =  await makkii.views.registerPage.Register_Cap.getText()
  console.log("\n\n\n ------ "+ _caption);
  if(_caption != "注册")
      throw new Error("Not landing on Register Page; the current caption is "+_caption);

  // await makkii.views.registerPage.Password_TextField.click();
  // await client.pause(1000);
  // client.isKeyboardShown();
  // await client.pause(1000);

  let newPassword = generateValidPassword();
  await makkii.views.registerPage.Password_TextField.setValue(newPassword);
  await makkii.views.registerPage.Confirm_Password_TextField.setValue(newPassword);
  await makkii.views.registerPage.Register_Btn.click();


  await makkii.isLoaded("Warning_Popup");
  await makkii.getOrphanElem("Warning_Popup").then((warningPopup)=>{
    return makkii.getOrphanElem("Confirm_Btn");
  },()=>{
    console.log("Is it first time registration?");
    return Promise.resolve();
  }).then((confirmBtn)=>{
    return confirmBtn.click();
  });







})();
