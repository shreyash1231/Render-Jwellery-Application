const connectServer=require("./app.js");
const connectDatabase=require("./config/db.js")

connectDatabase();
connectServer(); 


