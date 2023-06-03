const express = require("express");

const {
        AddNewVehicle,
        UpdateVehicle,
        DeleteVehicle,
        GetAllVehicles,
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/getallvehicles", GetAllVehicles);
router.post("/addnewvehicle", AddNewVehicle);
router.post("/updatevehicle/:id", UpdateVehicle);
router.delete("/deletevehicle/:id", DeleteVehicle);

module.exports = router;
