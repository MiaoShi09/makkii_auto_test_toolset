const DEFAULT_TIMEOUT= 1000;

exports.loginFlow = function(app,password,logger){
  logger.debug("fall in login flow")
  return app.loadPage("logInPage")
  .then((loginPage)=>{
    logger.debug("fall in login flow 1")
    return loginPage.Password_TextField.isExisting(DEFAULT_TIMEOUT);

  }).then((res)=>{
    if(res) return app.views.logInPage.Password_TextField.setValue(password);
    return Promise.reject("Not in login page, skip login flow.");
  }).then(()=>{
    return app.views.logInPage.Login_Btn.click();
  }).catch((e)=>{
    logger.debug(e);
  });
};

exports.logoutFlow = function(app,logger){
  logger.debug("fall in logout flow");
  return app.app.pause(DEFAULT_TIMEOUT).then(()=>{
    return app.loadPage("mainMenu");
  }).then((mainMenu)=>{
    logger.debug("fall in tracking main memu ");
    logger.debug(mainMenu);
    return mainMemu.Settings_Btn.isExisting(DEFAULT_TIMEOUT);
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
  }).catch((e)=>{
    logger.debug(e);
  })
}
