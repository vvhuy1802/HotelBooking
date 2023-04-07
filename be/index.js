const express = require("express");
const app = express();
const os = require("os");
const fs = require("fs");
require("dotenv").config();
const config = process.env;

const router = require("./routers/index");

//connect to db
const db = require("./config/db");
db.connect();

const port = 6996;
let ipv4 = "";

// Get the network interfaces
const interfaces = os.networkInterfaces();

// Iterate over the network interfaces
Object.keys(interfaces).forEach(function (interface) {
  // Get the IPv4 address of the interface
  const addresses = interfaces[interface].filter(function (address) {
    return address.family === "IPv4" && !address.internal;
  });

  if (addresses.length > 0) {
    console.log(interface + ": " + addresses[0].address);
    ipv4 = addresses[0].address;
  }
});

const UpdateAPI_URL = (path) => {
  fs.readFile(path, "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }

    const lines = data.split("\n");
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("export const LOCAL_API_URL =")) {
        lines[i] = "export const LOCAL_API_URL ='http://" + ipv4 + `:${port}'`;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push("export const LOCAL_API_URL ='http://" + ipv4 + `:${port}'`);
    }

    fs.writeFile(path, lines.join("\n"), function (error) {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`IPv4 at ${path} updated!`);
    });
  });
};

if (config.IPV4_ADDRESS !== ipv4) {
  fs.readFile(".env", "utf8", function (error, data) {
    if (error) {
      console.error(error);
      return;
    }

    const lines = data.split("\n");
    let found = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("IPV4_ADDRESS=")) {
        lines[i] = "IPV4_ADDRESS=" + ipv4;
        found = true;
        break;
      }
    }
    if (!found) {
      lines.push("IPV4_ADDRESS=" + ipv4);
    }

    fs.writeFile(".env", lines.join("\n"), function (error) {
      if (error) {
        console.error(error);
        return;
      }
      console.log("IPv4 at .env updated!");
    });
  });

  UpdateAPI_URL("../fe/HotelBooking/api.js");
  UpdateAPI_URL("../fe/admin-web-booking/src/api.js");
}

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.setHeader("X-Powered-By", "3.2.1");
  res.setHeader("Content-Type", "application/json;charset=utf-8");
  next();
});
app.use(express.json());

router(app);

app.listen(port, ipv4, () => {
  console.log(`App listening at http://${ipv4}:${port}`);
});
