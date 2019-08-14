

/**
* function to generate a valid password
* a valid password string must be 8-16 alpha-numical characters and ?,!,#
* @return {string} valid password string
*/
function generateValidPassword(){
  let passwordLen = Math.floor(Math.random()*8)+8;
  console.log("passwordLen is "+ passwordLen);
  let passwordBuff = new Buffer.allocUnsafe(passwordLen);
  for(let i = 0; i < passwordLen;i++){
    do {
      var randChar = 33 + Math.floor(Math.random()*89);
    }while(randChar!=33 && randChar != 35 && randChar != 63 && (randChar < 48 || (randChar > 57 && randChar < 65) || (randChar > 90 && randChar < 97)));

    passwordBuff[i] = randChar;
  }
  console.log(passwordBuff.toString("ascii"));
  return passwordBuff.toString("ascii");
}


/**
* function to generate a random invalid password based on requirements
* @param {number} errorType presents error situdation;
*       0 - too short
*       1 - too long
*       2 - invalid charachers
* @return {string} invalid password string
*/
function generateInvalidPassword(errorType){
  switch(errorType){
    case 0:
      return generateShortPassword();
    case 1:
      return generateLongPassword();
    default:
      return generateInvalidCharacterPassword();
  }
}

function generateShortPassword(){
  let passwordLen = Math.floor(Math.random()*8);
  let passwordBuff = new Buffer.allocUnsafe(passwordLen);
  for(let i = 0; i < passwordLen;i++){
      do {
        var randChar = 33 + Math.floor(Math.random()*89);
      }while(randChar!=33 && randChar != 35 && randChar != 63 && (randChar < 48 || (randChar > 57 && randChar < 65) || (randChar > 90 && randChar < 97)));
    passwordBuff[i] = randChar;
  }
  return passwordBuff.toString("ascii");
}

function generateLongPassword(){
  let passwordLen = Math.floor(Math.random()*17)+17;
  let passwordBuff = new Buffer.allocUnsafe(passwordLen);
  for(let i = 0; i < passwordLen;i++){
      do {
        var randChar = 33 + Math.floor(Math.random()*89);
      }while(randChar!=33 && randChar != 35 && randChar != 63 && (randChar < 48 || (randChar > 57 && randChar < 65) || (randChar > 90 && randChar < 97)));
    passwordBuff[i] = randChar;
  }
  return passwordBuff.toString("ascii");
}

function generateInvalidCharacterPassword(){
  let passwordLen = Math.floor(Math.random()*8)+8;
  let passwordBuff = new Buffer.allocUnsafe(passwordLen);
  do{
    for(let i = 0; i < passwordLen;i++){
      passwordBuff[i] =Math.floor(Math.random()*128);
    }
  }while (!/^[a-zA-Z0-9!?#]/.test(passwordBuff.toString("ascii")));
  return passwordBuff.toString("ascii");
}




/**
* async function to parse mnemonic and check if seed phrase have some words
* @param {Array<webdriver.element>} 12 web elements that contains seed phrase
* @return {boolean} a resolve present that if seed phrase have the same words
*/
async function haveSameWords(seedPhraseNodes){
  const MNE_LEN = 12;
  if(seedPhraseNodes.length != MNE_LEN){
    console.log("Invalid seed phrase node number: "+ seedPhraseNodes.length);
    throw new Error("Invalid seed phrase node number: "+ seedPhraseNodes.length);
  }
  let wordSet = new Set();
  let wordArray = new Array(MNE_LEN);
  for(let i = 0 ; i < MNE_LEN; i++){
    let word = await seedPhraseNodes[i].getText();
    wordSet.add(word);
    wordArray[i] = word;
  }
  console.log(wordArray);
  return Promise.resolve(wordSet.size < 12);
}

/**
* async function to perform up/down swipe action for the given element
* @param {driver.browser} client the webdriver browser element
* @param {webElement} element the target element
* @param {number} vertial_offset whether users need to swipe up (negative number) or down (positive)
*/
async function vScrollListView(client,element,vertial_offset){
  let size = await element.getSize();
  let loc = await element.getLocation();
  await client.touchAction([
        { action: 'press',  x: Math.floor(size.width*0.6), y: loc.y+Math.floor((size.height+vertial_offset*2)/2) },
        { action: 'moveTo', x: Math.floor(size.width*0.6), y: loc.y+Math.floor((size.height+vertial_offset)/2) },
        { action: 'moveTo', x: Math.floor(size.width*0.6), y: loc.y+Math.floor((size.height-vertial_offset)/2) },
        { action: 'moveTo', x: Math.floor(size.width*0.6), y: loc.y+Math.floor((size.height-vertial_offset*2)/2) },
    ])

}

/**
* async function to perform left/right swipe action for the given element
* @param {driver.browser} client the webdriver browser element
* @param {webElement} element the target element
* @param {number} direction whether users need to swipe left (-1) or right (1)
*/
async function hScrollPanel(client, element, direction){
  let size = await element.getSize();
  let loc = await element.getLocation();
  await client.touchAction([
        { action: 'press',  x: loc.x+Math.floor(size.width*(0.5+0.1*direction)), y: loc.y+Math.floor(size.height/2) },
        { action: 'moveTo', x: loc.x+Math.floor(size.width*(0.5+0.2*direction)), y: loc.y+Math.floor(size.height/2) },
        { action: 'moveTo', x: loc.x+Math.floor(size.width*(0.5+0.3*direction)), y: loc.y+Math.floor(size.height/2) },
        { action: 'moveTo', x: loc.x+Math.floor(size.width*(0.5+0.4*direction)), y: loc.y+Math.floor(size.height/2) },
    ]);
}



/**
* async function to perform scroll up and down to make the target element in value
* @param {driver.browser} client the webdriver browser element
* @param {webElement} parentElem the parent of the target element
* @param {array<string>} target a pair of attribute name and its value
* @param {number} offset swiping offset/speed
*/
//target: [attribute name, attribute value]
async function scrollElementIntoView(client, parentElem, target, offset){
  let _scrollable = await parentElem.getAttribute("scrollable");
  console.log(_scrollable);
  if(!_scrollable)
    return Promise.reject("passed element is not scrollable");

  // looking for target's parent for now; may add additional arguments pass in function
  let _target = "//*[@"+target[0]+"=\""+target[1]+"\"]/..";
  let _time = 0;
  let _tempElem = await parentElem.$(_target);
  console.log("--------------------------------");
  while(_time < 3 && _tempElem.hasOwnProperty("error")){
    console.log(_time);
    console.log(_tempElem)
    _time++;
    await vScrollListView(client, parentElem, 0-offset*1.5);
    _tempElem = await parentElem.$(_target);
  }

  while(_time < 10 && _tempElem.hasOwnProperty("error")){
    console.log(_time);
    console.log(_tempElem)
    _time++;
    await vScrollListView(client, parentElem, offset);
    _tempElem = await parentElem.$(_target);
  }

  console.log(_tempElem);

  return parentElem.$(_target);
}
/**
* function get the abbrivation of each coin type
* @param {string} coinType the coin type string
* @param {boolean} mini (optional) whether return a long string or minimized string; default value is false;
*/

function getAbbr(coinType,mini){
  let _coin_abbr = {
    aion:"AION",
    bitcoin:"BTC",
    ethereum:"ETH",
    litecoin:"LTC",
    tron:"TRX"
  };
  if(!mini){
    return coinType.toUpperCase()+"/"+_coin_abbr[coinType.toLowerCase()];
  }else{
    return _coin_abbr[coinType.toLowerCase()];
  }

}


exports.generateValidPassword = generateValidPassword;
exports.generateInvalidPassword = generateInvalidPassword;
exports.haveSameWords = haveSameWords;
exports.vScrollListView = vScrollListView;
exports.hScrollPanel = hScrollPanel;
exports.scrollElementIntoView = scrollElementIntoView;
exports.getAbbr = getAbbr;
