import jwt from "jsonwebtoken";
import Buffer from "buffer";
import { OAuth2Client } from "google-auth-library";

const verifyGoogleAcc = (token) => {
  return new Promise(async (res) => {
    let resp = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      method: "get",
      headers: { Authorization: `Bearer ${token}` },
    });
    let data = await resp.json();
    console.log(data);
    res(data);
  });
};

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;
    let decodedData;

    // console.log("payload google login : ", await verifyGoogleAcc(token));
    if (token && isCustomAuth) {
      // "test" here is the secret key
      decodedData = jwt.verify(token, "test");
      console.log("decodedData?.id : ", decodedData?.id);
      req.userId = decodedData?.id;
    } else {
      console.log("token in else: ", token);
      decodedData = jwt.decode(token);
      console.log("decodedData?.sub : ", decodedData?.sub);
      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
