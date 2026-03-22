const bcrypt = require("bcrypt");

const dbHash = "$2b$10$amWhWTPDXHYhwmzYl32PRehOC0sRu8/Ajjr5fHH3Ec4xh5glLscAi";

async function test() {
  const result = await bcrypt.compare("shreyash1@#", dbHash);
  console.log("Match:", result);
}

test();