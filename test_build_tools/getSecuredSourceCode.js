
const { remote } = require('webdriverio');
const ViewElements = require("../libs/ViewElements");
const lang = "cn";
const os = "android";


(async ()=>{
  const desired_capabilities = (require("../configs/testCapabilies.json")).qa[1];
  const opts = {
    port:4723,
    logLevel:'info',
    capabilities:desired_capabilities
  }


  const client = await remote(opts);
  console.log("please navigate to desired page in 20 seconds");
  await client.pause(20000);
  console.log("only 5 secondes left");
  await client.pause(5000);
  await client.getPageSource();

})()
