
exports.permissionHandler = function(app,approved,logger){
  return app.loadPage("permissionPopup").then(()=>{

    return approved? app.views.permissionPopup.Allow_Btn.click()
              :app.views.permissionPopup.Deny_Btn.click();
  },()=>{
    logger.info("No Permission Popup");
    return Promise.resolve();
  })
};

exports.eraseDataHandler = function(app,approved.logger){

};
