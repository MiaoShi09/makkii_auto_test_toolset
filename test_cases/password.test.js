const TEST_NAME="password_test";
const logger = new (require("../libs/logger.js"))(TEST_NAME,true);
const {os, language, port} = require("../configs/os_lang.json");
const {remote} = require("webdriverio");
const ViewElements = require("../libs/ViewElements");
const desired_capabilities = (require("../configs/testCapabilies.json")).qa[1];
const assert = require("assert");
const utils = require("../libs/utils");

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
      let _longPassword = utils.generateInvalidPassword(1);
      logger.info("random generated password:   "+ _longPassword);
      await makkii.loadPage("registerPage");
      await makkii.views.registerPage.Password_TextField.setValue(_longPassword);
      await makkii.views.registerPage.Confirm_Password_TextField.setValue(_longPassword);
      await makkii.views.registerPage.Register_Btn.click();
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
        return makkii.getOrphanElem("Warning_Popup");
      }).then((Confirm_Btn)=>{
        return Confirm_Btn.click();
      },()=>{
        logger.info("No warning for erasing previous data; no previous data");
        return Promise.resolve();
      }).then(()=>{
        return makkii.loadPage("walletPage");
      }).catch((e)=>{
        logger.error(e);
        throw e;
      });
      logger.info("APR#4 passed\n");
    });

  });

  describe("password on change password",()=>{

  })

  describe("password on recovery",()=>{

  })


})
