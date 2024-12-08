const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fakelocal = require("./fakelocal.json");



app.get("/", (req, res) => {
    res.send("Visit /createToken");
});

app.get("/createtoken", async (req, res) => {

    let user ={ name: "Jack", favColor: "red", id: "123"};

    const token = jwt .sign({user: user }, "Secret_Key");

    console.log("token: ", token);

      await fs.writeFile(
        "fakelocal.json",
        JSON.stringify({ Authorization: `Bearer ${token}`}),
        (err) => {
            if (err) throw err;
            console.log("updated the fake localstorage db in the fake  browser ");
        }
      );

    res.send("You just made a token and stored it in the json file. Now visit /profile and /wrongsecret");
});

app.get("/profile", async (req,res) =>  {
    console.log("authorization token: ", fakelocal.Authorization);

    const result = await jwt.verify(
        fakelocal.Authorization.substring(7),
        "Secret_Key"
    );
    result.message = 
      "we were able to decrypt the token because we have a valid secret in the app, and the token. the user data inside the token";

console.log("result: ", result);
});

app.get("/wrongsecret", async (req, res, next) => {
  try {
    await jwt.verify(
        fakelocal.Authorization.substring(7),
        "Incorrect _Secret"
    );

    console.log("result: ", result);

    res.send("/profile");
  } catch (err) {
    console.log("err: ", err);
    return res
       .status(400)
       .send("You failed to hack me! or your token is invalid.");
  } 
    res.send("coming soon wrongsecret");
});

app.listen(3000, () => {
    console.log("listening on port 3000")
});