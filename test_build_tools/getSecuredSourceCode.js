
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
  console.log("please navigate to desired page in 100 seconds");
  await client.pause(30000);
  console.log("only 40 secondes left");
  await client.pause(10000);
  await client.getPageSource();

})()
