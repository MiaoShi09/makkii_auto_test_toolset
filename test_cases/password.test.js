//external dependancies
const { remote } = require("webdriverio");
const assert = require("assert");

// configurations and data
const { os, language, port } = require("../configs/os_lang.json");
const desired_capabilities = (require("../configs/testCapabilies.json")).qa[1];
const TEST_DATA = require("../test_data/qa_data.json");
const TEST_NAME="password_test";
const FINAL_PASSWORD = "12345678";
const PAUSE_TIMEOUT=1000; // 1 SEC


// internal libs
const logger = new (require("../libs/logger.js"))(TEST_NAME,true);
const ViewElements = require("../libs/ViewElements");
const utils = require("../libs/utils");
const { permissionHandler, eraseDataHandler }  = require("../libs/test_helper/alterFlowHandlers")
const { loginFlow, logoutFlow } = require("../libs/test_helper/commonFlow");




describe("password format test suite",()=>{
  var client, makkii, oldPassword;

  before((done)=>{
    logger.info("Pre-steps: connect to MAKKII");
    remote({
      port:port,
      logLevel:"error",
      capabilities:desired_capabilities
    }).then((app)=>{
      client = app;
      makkii = new ViewElements(client,language,os);
      logger.info("Pre-steps: completed\n");
      done();
    })


  });


  describe("password on register",()=>{


    before(async()=>{
      await makkii.isLoaded("Login_Btn");
      await makkii.loadPage("logInPage");
      await makkii.views.logInPage.Register_Btn.click();

    });


    beforeEach((done)=>{
      logger.info("pre: checking if on registration section");
      makkii.loadPage("registerPage").then((done)=>{
        return makkii.views.registerPage.Register_Cap.getText();
      }).then((text)=>{

        return assert.equal(text,makkii.views.registerPage.Register_Cap[language]);
      }).catch((e)=>{
        logger.error(e);
        done(e);
      });
      logger.info("pre: completed\n");
      done();
    })



    it("APR#1:registration password too long",async()=>{
      console.log(this);
      let _longPassword = utils.generateInvalidPassword(1);
      logger.info("random generated password:   "+ _longPassword);
      await makkii.loadPage("registerPage");
      await makkii.views.registerPage.Password_TextField.setValue(_longPassword);
      await makkii.views.registerPage.Confirm_Password_TextField.setValue(_longPassword);
      await makkii.views.registerPage.Register_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------


      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Error_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
      logger.info("APR#1 passed\n");
    });


    it("APR#2:registration password too short",async()=>{
      let _shortPassword = utils.generateInvalidPassword(0);
      logger.info("random generated password:     "+ _shortPassword);
      await makkii.loadPage("registerPage");
      await makkii.views.registerPage.Password_TextField.setValue(_shortPassword);
      await makkii.views.registerPage.Confirm_Password_TextField.setValue(_shortPassword);
      await makkii.views.registerPage.Register_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------

      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Error_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
      logger.info("APR#2 passed\n");
    });


    it("APR#3:registration passwords unmatch",async()=>{
      let _password1 = utils.generateValidPassword();
      let _password2 = utils.generateValidPassword();

      logger.info("random generated password1:     "+ _password1);
      logger.info("random generated password2:     "+ _password2);
      await makkii.loadPage("registerPage");
      await makkii.views.registerPage.Password_TextField.setValue(_password1);
      await makkii.views.registerPage.Confirm_Password_TextField.setValue(_password2);
      await makkii.views.registerPage.Register_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------

      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Mismatch_Msg");
      }).then((Password_Mismatch_Msg)=>{
        return Password_Mismatch_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
      logger.info("APR#3 passed\n");
    });


    it("APR#4:registration password success",async()=>{
      let _password1 = utils.generateValidPassword();


      logger.info("random generated password1:     "+ _password1);

      await makkii.loadPage("registerPage");
      await makkii.views.registerPage.Password_TextField.setValue(_password1);
      await makkii.views.registerPage.Confirm_Password_TextField.setValue(_password1);
      await makkii.views.registerPage.Register_Btn.click();
      await makkii.isLoaded("Warning_Popup").then(()=>{
        return makkii.getOrphanElem("Confirm_Btn");
      }).then((Confirm_Btn)=>{
        logger.info("see erase data warning");


        return Confirm_Btn.click();
      },()=>{
        logger.info("No warning for erasing previous data; no previous data");
        return Promise.resolve();
      })
      await makkii.isLoaded("Mnemonic_Cap");
      await makkii.loadPage("mnemonicInitPage");

      await makkii.views.mnemonicInitPage.Skip_Btn.click().then(()=>{
        return permissionHandler(makkii,true,logger);
      }).then(()=>{
        return makkii.loadPage("walletPage");
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
      logger.info("APR#4 passed\n");
      oldPassword = _password1;
      logger.info("update original password to "+ oldPassword);
    });

  });


  describe("password on recovery",()=>{
    before(async ()=>{
      await logoutFlow(makkii, logger);
      await makkii.loadPage("logInPage");
      await makkii.views.logInPage.Recovery_Btn.click();
      await makkii.loadPage("recoveryPage");
      await makkii.views.recoveryPage.Mnemonic_TextFiled.setValue(TEST_DATA.seed_phrase);
      await makkii.views.recoveryPage.Confirm_Btn.click();
      await makkii.loadPage("recoveryPasswordPage");
    });

    // beforeEach(async ()=>{
    //
    //
    // })

    it("APC#1:recovery password too long",async ()=>{
      let _password1 = utils.generateInvalidPassword(1);
      logger.info("invalid long password:" + _password1);
      await makkii.views.recoveryPasswordPage.Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Reset_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------

      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Error_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
    });


    it("APC#2:recovery password too short",async ()=>{
      let _password1 = utils.generateInvalidPassword(0);
      logger.info("invalid short password:" + _password1);
      await makkii.views.recoveryPasswordPage.Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Reset_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------
      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Error_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
    });


    // currently skip APC#3 wait for MAK-84 fixed
    xit("APC#3:recovery passwords do not match",async ()=>{
      let _password1 = utils.generateValidPassword();
      let _password2 = utils.generateValidPassword();
      while(_password1 == _password2){
        _password2 = utils.generateValidPassword();
      }
      logger.info("unmatched passwords:" + _password1+",  "+_password2);
      await makkii.views.recoveryPasswordPage.Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(_password2);
      await makkii.views.recoveryPasswordPage.Reset_Btn.click();

      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------

      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Mismatch_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
    });


    it("APC#4:recovery password contains invalid character",async ()=>{
      let _password1 = utils.generateInvalidPassword(2);
      logger.info("invalid character password:" + _password1);
      await makkii.views.recoveryPasswordPage.Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Reset_Btn.click();
      //----------need to be removed after MAK-83 fixed----------
      await eraseDataHandler(makkii,true,logger);
      //----------------------------------------------------------
      await makkii.isLoaded("Error_Popup").then(()=>{
        return makkii.getOrphanElem("Password_Error_Msg");
      }).then((Password_Error_Msg)=>{
        return Password_Error_Msg.isExisting();
      }).then((isExist)=>{
        assert.equal(isExist,true);
        return makkii.getOrphanElem("Confirm_Btn")
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
    });

    it("APC#5:positive recovery account flow",async ()=>{
      let _password1 = utils.generateValidPassword();
      logger.info("correct password:" + _password1);
      await makkii.views.recoveryPasswordPage.Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Confirm_Password_TextField.setValue(_password1);
      await makkii.views.recoveryPasswordPage.Reset_Btn.click();
      await makkii.isLoaded("Warning_Popup").then(()=>{
        return makkii.getOrphanElem("Confirm_Btn");
      }).then((Confirm_Btn)=>{
        logger.info("see erase data warning");


        return Confirm_Btn.click();
      },()=>{
        logger.info("No warning for erasing previous data; no previous data");
        return Promise.resolve();
      })
      oldPassword = _password1;
      logger.info("new account password is:    "+ oldPassword);
      // TODO: to validate loading location

    });


  })




  describe("password on changing password",()=>{
    before(async ()=>{
      oldPassword = oldPassword || FINAL_PASSWORD;
      await makkii.isLoaded("Login_Btn").then(()=>{
        return loginFlow(makkii,oldPassword,logger);
      },()=>{
        return Promise.resolve();
      })
      await makkii.loadPage("mainMenu");
      await makkii.views.mainMenu.Settings_Btn.click();
      await makkii.loadPage("settingsPage");

    });


    beforeEach(async()=>{
      if(await makkii.views.settingsPage.ChangePassword_Btn.isExisting())
      await makkii.views.settingsPage.ChangePassword_Btn.click().then(()=>{
        return makkii.loadPage("changePasswordPage");
      }).then((changePasswordPage)=>{
        return changePasswordPage.Old_Password_TextField.isExisting(PAUSE_TIMEOUT);
      }).then((isExist)=>{
        if(!isExist) throw new Error("failed to load on change password settings");
      })
    })

    it("APCh#1: old password is incorrect", async ()=>{
      let _wrongPassword = utils.generateValidPassword();
      while(_wrongPassword == oldPassword){
        _wrongPassword = utils.generateValidPassword();
      }
      let _newPassword = utils.generateValidPassword();
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(_wrongPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click()
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Invalid_Old_Password_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });

    });


    it("APCh#2: new password is too long", async ()=>{

      let _newPassword = utils.generateInvalidPassword(1);
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click();
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Invalid_New_Password_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });
    });

    it("APCh#3: new password is too short", async ()=>{

      let _newPassword = utils.generateInvalidPassword(0);
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click();
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Invalid_New_Password_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });
    });

    it("APCh#4: new passwords do not match", async ()=>{

      let _newPassword1 = utils.generateValidPassword();
      let _newPassword2 = utils.generateValidPassword();
      while(_newPassword1 == _newPassword2){
        _newPassword2 = utils.generateValidPassword();
      }
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword1);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword2);
      await makkii.views.changePasswordPage.Save_Btn.click();
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Password_Change_Mismatch_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });
    });


    it("APCh#5: new password contains invalid character", async ()=>{

      let _newPassword = utils.generateInvalidPassword(2);
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click();
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Invalid_New_Password_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });
    });

    it("APCh#6: old password and new password are the same", async ()=>{

      let _newPassword = utils.generateInvalidPassword(2);
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click();
      await makkii.app.pause(PAUSE_TIMEOUT).then(()=>{
        return makkii.getOrphanElem("Same_Password_Msg");
      }).then((msg)=>{
        logger.debug(msg);
        assert.equal(msg.hasOwnProperty('error'),false);
        return makkii.getOrphanElem("Confirm_Btn");
      },(e)=>{
        logger.error(e);
        throw e;
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      });
    });

    it("APCh#7: positive changing password workflow", async ()=>{

      let _newPassword = FINAL_PASSWORD;
      await makkii.views.changePasswordPage.Old_Password_TextField.setValue(oldPassword);
      await makkii.views.changePasswordPage.New_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Confirm_Password_TextField.setValue(_newPassword);
      await makkii.views.changePasswordPage.Save_Btn.click();

      // TODO: validate the password have been changed

    });


  })


})
