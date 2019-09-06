const { permissionHandler, eraseDataHandler } = require("./alterFlowHandlers");
const DEFAULT_TIMEOUT= 1000;

function loginFlow(app,password,logger){
  logger.debug("fall in login flow")
  return app.loadPage("logInPage")
  .then((loginPage)=>{
    logger.debug("fall in login flow 1")
    return loginPage.Recovery_Btn.isExisting(DEFAULT_TIMEOUT);

  }).then((res)=>{
    logger.debug(res);
    if(res) return app.views.logInPage.Password_TextField.setValue(password);
    return Promise.reject("Not in login page, skip login flow.");
  }).then(()=>{
    return app.views.logInPage.Login_Btn.click();
  }).catch((e)=>{
    logger.debug(e);
    return Promise.reject(e);
  });
};

function logoutFlow(app,logger){
  logger.debug("fall in logout flow");
  return app.app.pause(DEFAULT_TIMEOUT).then(()=>{
    return app.loadPage("mainMenu");
  }).then((mainMenu)=>{
    logger.debug("fall in tracking main memu ");
    logger.debug(mainMenu);
    logger.debug("checking mainMemu.Settings_Btn.isExisting()");

    return mainMenu.Settings_Btn.isExisting();
  }).then((isExist)=>{
    logger.debug("main memu exists: "+isExist);
    return isExist? app.views.mainMenu.Settings_Btn.click()
          : Promise.reject("No main menu on the screen; may not need to sign out account.");
  }).then(()=>{
    logger.debug("expected loading settings");
    return app.loadPage("settingsPage")
  }).then((settingsPage)=>{
    logger.debug("expected to logout");
    return settingsPage.Logout_Btn.click();
  }).then(()=>{
    // handling log out Popup
    return logoutPopup_handler(app,true,logger);
  }).catch((e)=>{
    logger.debug(e);
  })
};


async function logoutPopup_handler(app,approved,logger){
  await app.app.pause(DEFAULT_TIMEOUT);
  await app.getOrphanElem("Logout_Warning_Msg").then((msg)=>{
    if(msg.hasOwnProperty('error')){
      throw "No logout warning popup.";
    }else{
      return approved? app.getOrphanElem("Confirm_Btn"):app.getOrphanElem("Cancel_Btn");
    }
  }).then((button)=>{
    return button.click();
  })
}

async function recoveryFlow(app,seed_phrase,password,logger){
  logger.debug("fall in recovery flow");
  await app.loadPage("logInPage").then((loginPage)=>{

    if(loginPage.isFullyLoaded){
      return Promise.resolve(loginPage);
    }else{
      return logoutFlow(app,logger).then(()=>{return recoveryFlow(app,seed_phrase,password,logger);});
    }
  });
  await app.views.logInPage.Recovery_Btn.click();
  await app.app.pause(DEFAULT_TIMEOUT);
  await app.loadPage("recoveryPage").then((recoveryPage)=>{logger.debug(recoveryPage)});
  //await app.views.recoveryPage.Mnemonic_TextFiled.click();
  await app.app.pause(DEFAULT_TIMEOUT*10);
  logger.debug(seed_phrase);
  await app.views.recoveryPage.Mnemonic_TextFiled.setValue(seed_phrase);

  await app.app.pause(DEFAULT_TIMEOUT*10);
  await app.views.recoveryPage.Mnemonic_TextFiled.getText().then((content)=>{
    logger.debug("Mnemonic_TextFiled: "+ content);
  })
  await app.views.recoveryPage.Confirm_Btn.click();
  await app.loadPage("recoveryPasswordPage");

  await app.views.recoveryPasswordPage.Password_TextField.setValue(password);
  await app.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(password);
  await app.views.recoveryPasswordPage.Reset_Btn.click();
  await eraseDataHandler(app,true,logger);
  await permissionHandler(app,true,logger);
}



exports.loginFlow = loginFlow;
exports.logoutFlow = logoutFlow;
exports.recoveryFlow = recoveryFlow;
