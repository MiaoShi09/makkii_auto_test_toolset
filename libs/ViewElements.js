const validationElem = require("../mappedViews/validationElemNameMapping.json");
const LOADING_TIMEOUT= 8000;


/**
 * A class to map, store, and validate the elements on the screen
 */

class ViewElements{
  /**
 * initialize the ViewElement object
 * @param {webdriverio.browser} browser connected remote browse/device object
 * @param {string}  lang (optional) a string present language, only support "en" and "cn";
 *      default value: "en"
 * @param {string} os (optional) a string present operating system, only support "android" and "ios";
 *      default value: "android"
 */
  constructor(browser,lang, os){

    if(!(lang !==undefined && (lang.toLowerCase() == "en"||lang.toLowerCase() == "cn"))){
      throw new Error("Invalid language");
    }
    this.lang = lang.toLowerCase() || "en";

    if( os ==undefined || (os.toLowerCase() != "android" && os.toLowerCase() != "ios" ) ) throw new Error("Invalid OS");
    this.os = os.toLowerCase() || "android";


    this.mapped_views = ["logInPage","registerPage","mnemonicInitPage","mainMenu","settingsPage",
                          "permissionPopup","walletPage","changePasswordPage","recoveryPage",
                        "recoveryPasswordPage","selectCoinPage","addFromPage","accountNamePage",
                        "privateKeyPage","addressBookPage","newContactPage"];
    this.views={};
    this.app = browser;
  }
  /**
 * a function to map the essential objects on the current page; the properties of each object must be stored in a json file in "mappedViews" folder
 * @param {string} pageName the name of a current page which should be lined up with the json file in "mappedViews" folder.
 * @return {object} contains all the mapped objects on the given page
 */
  async loadPage(pageName){
    if(this.mapped_views.includes(pageName)){
      let pageElemData = require("../mappedViews/"+pageName+"NameMapping.json");
      var self = this;
      self.views[pageName]={};
      self.views[pageName].isFullyLoaded = false;
      self.views[pageName].isFullyLoaded = await iteratorPageElement(self.views[pageName],self.lang,self.os,pageElemData,self.app,0,true);

      return Promise.resolve(this.views[pageName]);
    }else{
      throw new Error("Please name mapping view "+pageName+" or make sure the pageName is correct. Currently only name mapping these pages:\n"
              + JSON.stringify(this.mapped_views));
    }
  }

  /**
 * a function to wait and validate if the app is loading on the expected section
 * @param {string} mapped_elem_name the name of the object that stored on "mappedViews/validationElemNameMapping.json"
 * @return {Promise} element.waitForExist()
 */

  async isLoaded(mapped_elem_name){
    var self = this;

    return (await checkElement(self.lang,self.os, validationElem[mapped_elem_name], self.app)).waitForExist(LOADING_TIMEOUT);
  }

  /**
  * a function to get a given element on the view
  * @param {string} mapped_elem_name the name of the object that stored on "mappedViews/validationElemNameMapping.json"
  * @return {Promise} element
  */
  async getOrphanElem(mapped_elem_name){
    var self  = this;
    let _orphanElem = await checkElement(self.lang,self.os, validationElem[mapped_elem_name], self.app);
    for(let proName in validationElem[mapped_elem_name]){
      _orphanElem[proName] = validationElem[mapped_elem_name][proName];
    }
    return _orphanElem;
  }

  // currently only support for "text" attribute
  async findElementByText(content){
    let self = this;
    let elem = await self.app.$('//*[@text="'+content+'"]');

    if(elem.hasOwnProperty("error")) return Promise.reject(elem.error);
    else return Promise.resolve(elem);

  }
}

/**
* a private recursive function to go over all the objects in a name mapping file
* @param {object} map where to store all the elements
* @param {string} lang the language of the application
* @param {os} os the operating system the current application is running on
* @param {Array<object>} data a list of NameMapping properites
* @param {webdriver.browser} app that connected with the target application
* @param {number} i index of the current data position
*/

async function iteratorPageElement(map,lang,os,data,app,i,isFound){
  if(i == data.length){
    return Promise.resolve(isFound);
  }else{

    map[data[i].mapped_name] = await generateElement(lang,os,data[i],app);
    for(let proName in data[i]){

      map[data[i].mapped_name][proName] = data[i][proName];

    }
    isFound = (isFound && !map[data[i].mapped_name].hasOwnProperty("error"));
    return iteratorPageElement(map,lang,os,data,app,i+1,isFound);
  }
}

async function generateElement(lang, os, data, app){
  var selector="";
  if(os == "android"){

    selector = data.android_xPath;
  }

  return app.$(selector);
}

async function checkElement(lang, os, data, app){
  var selector="";
  if(os == "android"){

    selector = 'new UiSelector().text("'+data[lang]+'").className("'+data.android_class+'")';

    selector = `android=${selector}`;

  }

  return app.$(selector);
}

module.exports = ViewElements;
