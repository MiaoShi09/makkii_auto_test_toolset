var { generateValidPassword } = require("../utils.js");

for(let i = 0; i < 10; i++){
  console.log(generateValidPassword());
}
