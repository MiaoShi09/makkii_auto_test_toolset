//import dependancies
const fs = require("fs");
//set up constant private value
const DEFAULT_LOG_FOLDER = "test_logs";
const LEVEL_VALUE={
  divider:0,
  error:0,
  info:1,
  debug:2
}
var _instance = null;

class Logger{
  static _currentInstance(){
    return _instance;
  }

  constructor(name, enableConsoleLog,level){
    if (!fs.existsSync(DEFAULT_LOG_FOLDER)){
        fs.mkdirSync(DEFAULT_LOG_FOLDER);
    }
    this.path = DEFAULT_LOG_FOLDER+"/"+name+ Date.now().toString()+".txt";
    this.level = LEVEL_VALUE[level] || LEVEL_VALUE["info"];
    this.enableConsoleLog = enableConsoleLog || true;
    _instance = this;
  }

  info(info){
    if(this.level >= LEVEL_VALUE.info){
      if(this.enableConsoleLog){
        console.log("\x1b[96m%s\x1b[0m","[INFO]");
        console.log(info);
      }
      fs.appendFileSync(this.path,"[INFO] \t"+JSON.stringify(info)+"\n");
    }
  }

  debug(debugInfo){
    if(this.level >= LEVEL_VALUE.debug){
      if(this.enableConsoleLog){
        console.log("[DEBUG]");
        console.log(debugInfo);
      }
      fs.appendFileSync(this.path,"[DEBUG]\t"+JSON.stringify(debugInfo)+"\n");
    }
  }

  error(error){
    if(this.level >= LEVEL_VALUE.error){
      if(this.enableConsoleLog){
        console.log("\x1b[31m%s\x1b[0m","[ERROR]");
        console.log(error);
      }
      fs.appendFileSync(this.path,"[ERROR]\t"+JSON.stringify(error)+"\n");
    }
  }

  divider(msg){
    if(this.level >= LEVEL_VALUE.divider){
      if(this.enableConsoleLog){
        console.log("\x1b[44m%s\x1b[0m","[DIVIDER]--------------------------------------------------------------");
        console.log(msg);
      }
      fs.appendFileSync(this.path,"---------------------"+msg+"-------------------------------\n");
    }
  }
}


module.exports = Logger;
