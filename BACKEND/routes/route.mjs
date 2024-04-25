import express from "express";
import {
  register,
  login,
  addUser,
  addCountry,
  addDriver,
  addVehicle,
  validateToken,
  addCity,
  updateUser,
  getCountries,
  updateVehicle,
  getVehicles,
  getUsers,
  deleteUser,
  searchUsers,
} from "../controllers/controller.mjs";
import { authenticateToken } from "../middlewares/middleware.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Users
router.post("/addUser", authenticateToken, addUser);
router.get("/getUsers", authenticateToken, getUsers);
router.put("/updateUser/:id", authenticateToken, updateUser);
router.delete("/deleteUser/:id", authenticateToken, deleteUser);
router.get("/searchUsers", authenticateToken, searchUsers);

// Drivers
router.post("/addDriver", authenticateToken, addDriver);
router.get("/getDrivers", authenticateToken, getDrivers);
router.put("/updateDriver/:id", authenticateToken, updateDriver);
router.delete("/deleteDriver/:id", authenticateToken, deleteDriver);
router.get("/searchDrivers", authenticateToken, searchDrivers);

// Countries
router.post("/addCountry", authenticateToken, addCountry);
router.get("/getCountries", authenticateToken, getCountries);


router.post("/validateToken", authenticateToken, validateToken);

// Vehicle
router.post("/addVehicle", authenticateToken, addVehicle);
router.get("/getVehicles", authenticateToken, getVehicles);
router.put("/updateVehicle", authenticateToken, updateVehicle);

// City
router.put("/addCity", authenticateToken, addCity);

export default router;
