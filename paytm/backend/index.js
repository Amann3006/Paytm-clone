const express = require("express");
const userRouter = require("./routes/user");
const cors = require("cors");
const app = express();
   
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});