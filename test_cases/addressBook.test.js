//external dependancies
const { remote } = require("webdriverio");
const assert = require("assert");

// configurations and data
const { os, language, port } = require("../configs/os_lang.json");
const desired_capabilities = (require("../configs/testCapabilies.json")).qa[0];
const TEST_DATA = require("../test_data/qa_data.json");
const TEST_NAME="address_book_test";
const DEFAULT_PASSWORD = "12345678";
const PAUSE_TIMEOUT=1000; // 1 SEC


// internal libs
const logger = new (require("../libs/logger.js"))(TEST_NAME,true);
const ViewElements = require("../libs/ViewElements");
const utils = require("../libs/utils");
const { permissionHandler, eraseDataHandler }  = require("../libs/test_helper/alterFlowHandlers")
const { loginFlow, recoveryFlow } = require("../libs/test_helper/commonFlow");




describe("import accouts into address book",()=>{
  var makkii, client;
  var test_accs = TEST_DATA.accounts;

  before(async ()=>{
    logger.divider("Pre-condition: connect to device and login Makkii");

    client = await remote({
        port:port,
        logLevel: "silent",//"error",
        capabilities:desired_capabilities
    });
    await client.pause(PAUSE_TIMEOUT*6);
    makkii = new ViewElements(client,language,os);
    logger.info("connect to appium");
    await loginFlow(makkii, DEFAULT_PASSWORD,logger)
    await client.pause(PAUSE_TIMEOUT);
    await makkii.getOrphanElem("Error_Popup").then((Error_Popup)=>{
      logger.debug("fall in alternal flow");
      logger.debug(Error_Popup)
      if(!Error_Popup.hasOwnProperty("error")){
        return makkii.getOrphanElem("Confirm_Btn").then((Confirm_Btn)=>{
          logger.debug(Confirm_Btn)
          return Confirm_Btn.click();
        }).then(()=>{
          return recoveryFlow(makkii, TEST_DATA.seed_phrase,DEFAULT_PASSWORD,logger);
        })
      }
      return Promise.resolve();
    })
    //test_accs = TEST_DATA.accounts;
    logger.divider("Pre-condition: passed");
  })


  beforeEach(async ()=>{
    logger.divider("Pre-condition: make sure makkii navigate to address book section");
    await makkii.loadPage("addressBookPage");
    await makkii.views.addressBookPage.Caption.getText().catch(async(e)=>{
      await makkii.loadPage("mainMenu");
      await makkii.views.mainMenu.Settings_Btn.click();
      await makkii.loadPage("settingsPage");
      await makkii.views.settingsPage.AddressBook_Btn.click();
      await makkii.loadPage("addressBookPage");
    })



  });

  describe("AAddr#1: add new valid address into address book",()=>{

    for(let coinType in test_accs){
      it("AAddr#1-"+coinType,async()=>{
        await makkii.views.addressBookPage.Add_Btn.click();
        await client.pause(PAUSE_TIMEOUT);
        await makkii.loadPage("newContactPage");
        await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
        await client.pause(PAUSE_TIMEOUT*2);
        await makkii.loadPage("selectCoinPage");
        await makkii.views.selectCoinPage[coinType+"_Btn"].click();
        await makkii.loadPage("newContactPage");
        assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coinType));
        await makkii.views.newContactPage.Contact_Name_TextField.setValue(coinType+"_pk");
        await makkii.views.newContactPage.Address_TextField.setValue(test_accs[coinType][0].address);
        await makkii.views.newContactPage.Save_Btn.click();
        // go back to address book section to check if new address exists

        await makkii.loadPage("addressBookPage");
        await utils.scrollElementIntoView(client, makkii.views.addressBookPage.Address_List,["text", coinType+"_pk"],150)
        .then((elem)=>{
          assert.equal(elem.hasOwnProperty("error"),false);
        },()=>{
          return assert.doesNotReject(makkii.findElementByText(coinType+"_pk"));
        });
      });
    }

  });


  describe("AAddr#2: add valid address checksum into address book",()=>{
    for(let coinType in test_accs){

      if(test_accs[coinType][1].checksum !== undefined){
        it("AAddr#2-"+coinType,async()=>{
          await makkii.views.addressBookPage.Add_Btn.click();
          await client.pause(PAUSE_TIMEOUT);
          await makkii.loadPage("newContactPage");
          await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
          await client.pause(PAUSE_TIMEOUT*2);
          await makkii.loadPage("selectCoinPage");
          await makkii.views.selectCoinPage[coinType+"_Btn"].click();
          await makkii.loadPage("newContactPage");
          assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coinType));
          await makkii.views.newContactPage.Contact_Name_TextField.setValue(coinType+"2_checksum");
          await makkii.views.newContactPage.Address_TextField.setValue(test_accs[coinType][1].checksum);
          await makkii.views.newContactPage.Save_Btn.click();
          // go back to address book section to check if new address exists

          await makkii.loadPage("addressBookPage");
          await utils.scrollElementIntoView(client, makkii.views.addressBookPage.Address_List,["text", coinType+"2_checksum"],150)
          .then((elem)=>{
            assert.equal(elem.hasOwnProperty("error"),false);
          },()=>{
            return assert.doesNotReject(makkii.findElementByText(coinType+"2_checksum"));
          });
        });
      }
    }
  });


  describe("AAddr#3: add some address",()=>{
    // add same address for each coin coinType

    // add address checksum for aion/ethereum
  })







  describe("AAddr#4: remove address",()=>{
    for(let coinType in test_accs){
      it("AAddr#4-"+coinType,async()=>{


        await makkii.loadPage("addressBookPage");
        await utils.scrollElementIntoView(client, makkii.views.addressBookPage.Address_List,["text", coinType+"_pk"],150)
        // .then((elem)=>{
        //   logger.debug(elem);
        //   return elem.$('/..')
        // })
        .then((parent)=>{
          logger.debug(parent);
          return utils.hScrollPanel(client,parent,-1);
        });
        let Delete_Btn = await makkii.getOrphanElem("Delete_Btn");
        await Delete_Btn.click();
        await makkii.isLoaded("Warning_Popup").then(()=>{
          return makkii.getOrphanElem("Delete_Addr_Msg");
        }).then((Delete_Addr_Msg)=>{
          return Delete_Addr_Msg.isExisting();
        }).then((isExist)=>{
          assert.equal(isExist,true);
          return makkii.getOrphanElem("Delete_Btn")
        }).then((Confirm_Btn)=>{
          return Confirm_Btn.click();
        }).catch((e)=>{
          logger.error(e);
          throw e;
        });

        await makkii.loadPage("addressBookPage");
        await utils.scrollElementIntoView(client, makkii.views.addressBookPage.Address_List,["text", coinType+"_pk"],150)
        .then((elem)=>{
          assert.equal(elem.hasOwnProperty("error"),true);
        },()=>{
          return assert.rejects(makkii.findElementByText(coinType+"_pk"));
        });

      });
    }
  })

});
