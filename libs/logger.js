const fs = require("fs");
const DEFAULT_LOG_FOLDER = "test_logs";

class Logger{
  constructor(name, enableConsoleLog,level){
    if (!fs.existsSync(DEFAULT_LOG_FOLDER)){
        fs.mkdirSync(DEFAULT_LOG_FOLDER);
    }
    this.path = DEFAULT_LOG_FOLDER+"/"+name+ Date.now().toString()+".txt";
    this.level = level || "info";
    this.enableConsoleLog = enableConsoleLog || true;


  }

  info(info){
    if(this.enableConsoleLog){
      console.log("\x1b[96m%s\x1b[0m","[INFO]");
      console.log(info);
    }
    fs.appendFileSync(this.path,"[INFO]\t"+JSON.stringify(info)+"\n");
  }

  debug(debugInfo){
    if(this.enableConsoleLog){
      console.log("[DEBUG]");
      console.log(debugInfo);
    }
    fs.appendFileSync(this.path,"[DEBUG]\t"+JSON.stringify(debugInfo)+"\n");
  }

  error(error){
    if(this.enableConsoleLog){
      console.log("\x1b[31m%s\x1b[0m","[ERROR]");
      console.log(error);
    }
    fs.appendFileSync(this.path,"[ERROR]\t"+JSON.stringify(error)+"\n");
  }

  divider(msg){
    if(this.enableConsoleLog){
      console.log("\x1b[44m%s\x1b[0m","[DIVIDER]--------------------------------------------------------------");
      console.log(msg);
    }
    fs.appendFileSync(this.path,"---------------------"+msg+"-------------------------------");
  }
}


module.exports = Logger;
