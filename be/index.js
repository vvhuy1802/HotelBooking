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

const port = 3000;
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
      console.log("IPv4 at BE updated!");
    });

    fs.readFile("../fe/HotelBooking/api.js", "utf8", function (error, data) {
      if (error) {
        console.error(error);
        return;
      }

      const lines = data.split("\n");
      let found = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("export const LOCAL_API_URL =")) {
          lines[i] = "export const LOCAL_API_URL ='http://" + ipv4 + ":3000'";
          found = true;
          break;
        }
      }
      if (!found) {
        lines.push("export const LOCAL_API_URL ='http://" + ipv4 + ":3000'");
      }

      fs.writeFile(
        "../fe/HotelBooking/api.js",
        lines.join("\n"),
        function (error) {
          if (error) {
            console.error(error);
            return;
          }
          console.log("IPv4 at FE updated!");
        }
      );
    });
  });
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

router(app);

app.listen(port, ipv4, () => {
  console.log(`App listening at http://${ipv4}:${port}`);
});
