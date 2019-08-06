
exports.permissionHandler = function(app,approved,logger){
  return app.app.pause(2000).then(()=>{
      logger.debug("pause 2 sec");
      return app.loadPage("permissionPopup");
  }).then((permissionPopup)=>{
    if(!permissionPopup.isFullyLoaded) throw "No Permission Popup";
    
    logger.debug("permisson popup section shows up");
    return approved? permissionPopup.Allow_Btn.click()
              : permissionPopup.Deny_Btn.click();
  }).catch((e)=>{
    logger.info(e);

  })
};

exports.eraseDataHandler = function(app,approved,logger){
  logger.info("running into erase previous data handler")
  return app.app.pause(2000).then(()=>{
    return app.isLoaded("Warning_Popup");
  }).then(()=>{
    return approved?app.getOrphanElem("Confirm_Btn"):app.getOrphanElem("Cancel_Btn");
  }).then((btn)=>{
    logger.info("see erase data warning");
    return btn.click();
  },()=>{
    logger.info("No warning for erasing previous data; no previous data");
    return Promise.resolve();
  })

};
