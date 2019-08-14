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
const logger = new (require("../libs/logger.js"))(TEST_NAME,true,"debug");
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

    logger.divider("Pre-condition: passed");

  });

  describe("AAddr#1: add new valid address into address book",()=>{
    // TODO: need to add precondition that check and navigate to address book section in case some test broke/failed in the middle of the excution

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

  describe("AAddr#3: add same address",()=>{
    // add same address for each coin coinType
    beforeEach(async ()=>{
      logger.divider("make sure landing on add new contact");
      await client.pause(10000);
        await makkii.loadPage("newContactPage").then((newContactPage)=>{
          logger.debug(newContactPage);
          if(newContactPage.isFullyLoaded){
            return Promise.resolve();
          }else{
            return makkii.loadPage("addressBookPage")
                  .then((addressBookPage)=>{
                    logger.debug(addressBookPage);
                    return addressBookPage.Add_Btn.click();
                  });
          }
        });
        logger.divider("passed");
    })

    for(let coinType in test_accs){
      it("AAddr#3-"+coinType,async()=>{

        await client.pause(PAUSE_TIMEOUT);
        await makkii.loadPage("newContactPage");
        await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
        await client.pause(PAUSE_TIMEOUT*2);
        await makkii.loadPage("selectCoinPage");
        await makkii.views.selectCoinPage[coinType+"_Btn"].click();
        await makkii.loadPage("newContactPage");
        assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coinType));
        await makkii.views.newContactPage.Contact_Name_TextField.setValue(coinType+"_dup");
        await client.isKeyboardShown().then((isShown)=>{
          return isShown? client.hideKeyboard(): Promise.resolve();
        }).then(()=>{
          return client.pause(PAUSE_TIMEOUT);
        })
        await makkii.loadPage("newContactPage");
        await makkii.views.newContactPage.Address_TextField.setValue(test_accs[coinType][0].address);
        await makkii.views.newContactPage.Save_Btn.click();
        // go back to address book section to check if new address exists
        await client.pause(PAUSE_TIMEOUT/2);
        let ErrorMsg = await makkii.getOrphanElem("Existing_Address_Msg");
        assert.equal(ErrorMsg.hasOwnProperty("error"),false);

      });
    }

    for(let coinType in test_accs){
      if(coinType == "Aion" || coinType == "Ethereum"){
        it("AAddr#3-"+coinType + " checksum duplication",async()=>{

          await client.pause(PAUSE_TIMEOUT);
          await makkii.loadPage("newContactPage");
          await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
          await client.pause(PAUSE_TIMEOUT*2);
          await makkii.loadPage("selectCoinPage");
          await makkii.views.selectCoinPage[coinType+"_Btn"].click();
          await makkii.loadPage("newContactPage");
          assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coinType));
          await makkii.views.newContactPage.Contact_Name_TextField.setValue(coinType+"_cs_dup");
          await client.isKeyboardShown().then((isShown)=>{
            return isShown? client.hideKeyboard(): Promise.resolve();
          }).then(()=>{
            return client.pause(PAUSE_TIMEOUT);
          })
          await makkii.loadPage("newContactPage");
          await makkii.views.newContactPage.Address_TextField.setValue(test_accs[coinType][0].checksum);
          await makkii.views.newContactPage.Save_Btn.click();
          // go back to address book section to check if new address exists
          await client.pause(PAUSE_TIMEOUT/2);
          let ErrorMsg = await makkii.getOrphanElem("Existing_Address_Msg");
          assert.equal(ErrorMsg.hasOwnProperty("error"),false);

        });
      }
    }

  })

  describe("AAddr#4: remove address",()=>{
    before(async()=>{
      logger.divider("AAddr#4-precondition: must land on address book page");
       await makkii.loadPage("addressBookPage").then((addressBookPage)=>{

        return makkii.views.addressBookPage.Caption.getText();
      }).then((caption)=>{
        if(caption == makkii.views.addressBookPage.Caption[language]){
          return Promise.resolve();
        }else{
          return makkii.loadPage("newContactPage").then((newContactPage)=>{
            if(newContactPage.isFullyLoaded) return newContactPage.Back_Btn.click();
            logger.debug("unexpected location");
            throw new Error("unexpected location");
          });
        }
      });


      await client.pause(PAUSE_TIMEOUT);
    });

    for(let coinType in test_accs){
      it("AAddr#4-"+coinType,async()=>{

        await makkii.loadPage("addressBookPage");
        await utils.scrollElementIntoView(client, makkii.views.addressBookPage.Address_List,["text", coinType+"_pk"],150)

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
  });

  describe("AAddr#6: ETH/AION no prefix is invalid format",()=>{

    var testdata = {};
    testdata.Aion={};
    testdata.Ethereum={};
    for(let coin in testdata){
      testdata[coin].noprefix = test_accs[coin][0].address.substring(2,66);
      testdata[coin].checksumNoPrefix = test_accs[coin][0].checksum.substring(2,66);
    }
    beforeEach (async ()=>{

      logger.divider("AAddr#6: make sure makkii land on new Contact section")
      await makkii.loadPage("newContactPage").then((newContactPage)=>{

       return makkii.views.newContactPage.Caption.getText();
       }).then((caption)=>{
         if(caption == makkii.views.newContactPage.Caption[language]){
           return Promise.resolve();
         }else{
           return makkii.loadPage("addressBookPage").then((addressBookPage)=>{
             if(addressBookPage.isFullyLoaded) return addressBookPage.Add_Btn.click();
             logger.debug("unexpected location");
             throw new Error("unexpected location");
           });
         }
       });
    logger.divider("AAddr#6: precondition completed")

    });

    for(let coin in testdata){
      for(let field in testdata[coin]){
        it("AAddr#6-"+coin+" fill with "+ field, async()=>{

          await client.pause(PAUSE_TIMEOUT);
          await makkii.loadPage("newContactPage");
          await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
          await client.pause(PAUSE_TIMEOUT*2);
          await makkii.loadPage("selectCoinPage");
          await makkii.views.selectCoinPage[coin+"_Btn"].click();
          await makkii.loadPage("newContactPage");
          assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coin));
          await makkii.views.newContactPage.Contact_Name_TextField.setValue(coin+field);

          await client.isKeyboardShown().then((isShown)=>{
            return isShown? client.hideKeyboard(): Promise.resolve();
          }).then(()=>{
            return client.pause(PAUSE_TIMEOUT);
          });

          await makkii.loadPage("newContactPage");
          await makkii.views.newContactPage.Address_TextField.setValue(test_accs[coin][field]);
          logger.debug("click back button");
          await makkii.views.newContactPage.Save_Btn.click();
          await client.pause(PAUSE_TIMEOUT/2).then(()=>{
            // go back to address book section to check if new address exists
            logger.debug("check error msg");
            logger.debug(invalidFormatMsg(coin)[language]);
            return makkii.findElementByText(invalidFormatMsg(coin)[language]);
          }).then((Error_Msg)=>{
            assert.equal(Error_Msg.hasOwnProperty("error"),false);
          },(e)=>{
            logger.debug(e);
            throw e;
          });

        });
      }
    }

  });

  describe("AAddr#5: invalid address format",()=>{
    // add same address for each coin coinType
    beforeEach(async ()=>{
      logger.divider("AAddr#5-pre: make sure landing on add new contact");
      await makkii.loadPage("newContactPage").then((newContactPage)=>{

       return makkii.views.newContactPage.Caption.getText();
       }).then((caption)=>{
         if(caption == makkii.views.newContactPage.Caption[language]){
           return Promise.resolve();
         }else{
           return makkii.loadPage("addressBookPage").then((addressBookPage)=>{
             if(addressBookPage.isFullyLoaded) return addressBookPage.Add_Btn.click();
             logger.debug("unexpected location");
             throw new Error("unexpected location");
           });
         }
       });
        logger.divider("AAddr#5-pre: passed");
    });

    for(let coinType in test_accs){

      for(let otherCoin in test_accs){

        if(coinType != otherCoin){

          it("AAddr#5-"+coinType+" fill with "+ otherCoin, async()=>{

            await client.pause(PAUSE_TIMEOUT);
            await makkii.loadPage("newContactPage");
            await makkii.views.newContactPage.Coin_Type_Select_Btn.click();
            await client.pause(PAUSE_TIMEOUT*2);
            await makkii.loadPage("selectCoinPage");
            await makkii.views.selectCoinPage[coinType+"_Btn"].click();
            await makkii.loadPage("newContactPage");
            assert.equal((await makkii.views.newContactPage.Coin_Type_TextField.getText()),utils.getAbbr(coinType));
            await makkii.views.newContactPage.Contact_Name_TextField.setValue(coinType+otherCoin);

            await client.isKeyboardShown().then((isShown)=>{
              return isShown? client.hideKeyboard(): Promise.resolve();
            }).then(()=>{
              return client.pause(PAUSE_TIMEOUT);
            });

            await makkii.loadPage("newContactPage");
            await makkii.views.newContactPage.Address_TextField.setValue(test_accs[otherCoin][0].address);
            logger.debug("click back button");
            await makkii.views.newContactPage.Save_Btn.click();
            await client.pause(PAUSE_TIMEOUT/2).then(()=>{
              // go back to address book section to check if new address exists
              logger.debug("check error msg");
              return makkii.findElementByText(invalidFormatMsg(coinType)[language]);
            }).then((Error_Msg)=>{
              assert.equal(Error_Msg.hasOwnProperty("error"),false);
            },(e)=>{
              logger.debug(e);
              throw e;
            });

          });
        }
      }
    }
  });

});


function invalidFormatMsg(coinType){
  return {
    en:"Invalid "+ utils.getAbbr(coinType,true) +" address",
    cn:"错误的"+utils.getAbbr(coinType,true) +"地址格式"
  }
}
