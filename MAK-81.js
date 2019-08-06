const { remote } = require('webdriverio');
var { generateValidPassword,haveSameWords } = require("./libs/utils.js");
const ViewElements = require("./libs/ViewElements");
const lang = "cn";
const os = "android";
var makkii,client;

var times = 1;

var registration = async (i)=>{

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


  await makkii.isLoaded("Mnemonic_Cap");
  await makkii.loadPage("mnemonicInitPage");
  let _seedPhrase = await makkii.views.mnemonicInitPage.Mnemonic_Sec.$$("//android.widget.TextView");
  console.log(_seedPhrase.length);
  console.log(_seedPhrase);
  if (await haveSameWords(_seedPhrase)){
    await makkii.views.mnemonicInitPage.Skip_Btn.click();
    console.log("Total Register Time: "+ i);
  }else{
    await makkii.views.mnemonicInitPage.Skip_Btn.click();
    await makkii.loadPage("mainMenu");
    await makkii.views.mainMenu.Settings_Btn.click();
    await makkii.loadPage("settingsPage");
    await makkii.views.settingsPage.Logout_Btn.click();


    await makkii.isLoaded("Warning_Popup");
    await makkii.getOrphanElem("Warning_Popup").then((warningPopup)=>{
      return makkii.getOrphanElem("Confirm_Btn");
    },()=>{
      console.log("Is it first time registration?");
      return Promise.resolve();
    }).then((confirmBtn)=>{
      return confirmBtn.click();
    });

    return registration(i+1)
  }
};




(async()=>{
  try{
    const desired_capabilities = (require("./configs/testCapabilies.json")).qa[0];
    const opts = {
      port:4723,
      logLevel:'info',
      capabilities:desired_capabilities
    }


    client = await remote(opts);
    makkii = new ViewElements(client,lang,os);
    registration(times);
  }catch(e){
    console.log(e);
    console.log(times);
  }
})()
