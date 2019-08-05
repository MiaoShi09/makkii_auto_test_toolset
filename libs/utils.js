

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


exports.generateValidPassword = generateValidPassword;
exports.generateInvalidPassword = generateInvalidPassword;
exports.haveSameWords = haveSameWords;
