import User from "../models/model.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";

// to store the image of vehicle.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

// validating the token.
export const validateToken = async (req, res, next) => {
  try {
    res.status(200).send("Valid Token");
  } catch (err) {
    res.status(500).send("Error in validating..!");
  }
};

// Register function
export const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hashing the password for security concerns.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, password: hashedPassword });

    // Save the value in dB.
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // server side error.
    res.status(500).json({ error: error.message }); // Send the error message from the caught error
  }
};

// Login function
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Username does not exist" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

    // Create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
};

// Add User function
export const addUser = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if a user with the same email or phone already exists
    const emailExists = user.User.some((user) => user.email === email);
    const phoneExists = user.User.some((user) => user.phone === phone);
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Add the new User to the User array
    user.User.push({ name, email, phone, countrycode });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
};

// GetUsers
export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField;

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Get the total number of users
    const totalUsers = await user.User.length;

    // Get and optionally sort the users
    let users = user.User.slice(skip, skip + limit);
    if (sortField) {
      users = users.sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));
    }

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

//Update user
export const updateUser = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;
  const { id } = req.params; // Get the updateId from the request URL

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the index of the data to be updated
    const indexToUpdate = user.User.findIndex(
      (user) => user._id.toString() === id
    );
    if (indexToUpdate === -1) {
      return res.status(400).json({ error: "Data to update does not exist" });
    }

    // Check if a user with the same email or phone already exists
    const emailExists = user.User.some(
      (user, index) => user.email === email && index !== indexToUpdate
    );
    const phoneExists = user.User.some(
      (user, index) => user.phone === phone && index !== indexToUpdate
    );
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "User with this phone number already exists" });
    }

    // Update the user
    user.User[indexToUpdate].name = name;
    user.User[indexToUpdate].email = email;
    user.User[indexToUpdate].phone = phone;
    user.User[indexToUpdate].countrycode = countrycode;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete user.
export const deleteUser = async (req, res) => {
  const { id } = req.params; // Get the id from the request URL

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the index of the data to be deleted
    const indexToDelete = user.User.findIndex(
      (user) => user._id.toString() === id
    );
    if (indexToDelete === -1) {
      return res.status(400).json({ error: "Data to delete does not exist" });
    }

    // Delete the user
    user.User.splice(indexToDelete, 1);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};

//SearchUser
export const searchUsers = async (req, res) => {
  const { field, text } = req.query; // Get the field and text from the request query

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Search in the User array
    const results = user.User.filter((item) =>
      item[field].toLowerCase().includes(text.toLowerCase())
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error searching users" });
  }
};

// Add Country function
export const addCountry = async (req, res) => {
  const { Name, Currency, CountryCode, CountryCallingCode, TimeZone, City } =
    req.body;

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if a country with the same name already exists
    const countryExists = user.Country.some((country) => country.Name === Name);
    if (countryExists) {
      return res.status(400).json({ error: "Country already exists" });
    }

    // Add the new Country to the Country array.
    user.Country.push({
      Name,
      Currency,
      CountryCode,
      CountryCallingCode,
      TimeZone,
      City,
    });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Country added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding country" });
  }
};

// Get country
export const getCountries = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    res.status(200).json(user.Country);
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ error: "Token not verified" });
    } else {
      res.status(500).json({ error: "Error fetching countries" });
    }
  }
};

// Add Driver function
export const addDriver = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if a driver with the same email or phone already exists
    const emailExists = user.DriverList.some(
      (driver) => driver.email === email
    );
    const phoneExists = user.DriverList.some(
      (driver) => driver.phone === phone
    );
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "Driver with this email already exists" });
    }
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "Driver with this phone number already exists" });
    }

    // Add the new Driver to the DriverList array
    user.DriverList.push({ name, email, phone, countrycode });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Driver added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding driver" });
  }
};

// GetDrivers
export const getDrivers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const sortField = req.query.sortField;

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Get the total number of drivers
    const totalDrivers = await user.DriverList.length;

    // Get and optionally sort the drivers
    let drivers = user.DriverList.slice(skip, skip + limit);
    if (sortField) {
      drivers = drivers.sort((a, b) => (a[sortField] > b[sortField] ? 1 : -1));
    }

    res.status(200).json({ drivers, totalDrivers });
  } catch (error) {
    res.status(500).json({ error: "Error fetching drivers" });
  }
};

//Update driver
export const updateDriver = async (req, res) => {
  const { name, email, phone, countrycode } = req.body;
  const { id } = req.params; // Get the updateId from the request URL

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the index of the driver to be updated
    const indexToUpdate = user.DriverList.findIndex(
      (driver) => driver._id.toString() === id
    );
    if (indexToUpdate === -1) {
      return res.status(400).json({ error: "Data to update does not exist" });
    }

    // Check if a driver with the same email or phone already exists
    const emailExists = user.DriverList.some(
      (driver, index) => driver.email === email && index !== indexToUpdate
    );
    const phoneExists = user.DriverList.some(
      (driver, index) => driver.phone === phone && index !== indexToUpdate
    );
    if (emailExists) {
      return res
        .status(400)
        .json({ error: "Driver with this email already exists" });
    }
    if (phoneExists) {
      return res
        .status(400)
        .json({ error: "Driver with this phone number already exists" });
    }

    // Update the driver
    user.DriverList[indexToUpdate].name = name;
    user.DriverList[indexToUpdate].email = email;
    user.DriverList[indexToUpdate].phone = phone;
    user.DriverList[indexToUpdate].countrycode = countrycode;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Driver updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating driver" });
  }
};

// Delete driver.
export const deleteDriver = async (req, res) => {
  const { id } = req.params; // Get the id from the request URL

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the index of the driver to be deleted
    const indexToDelete = user.DriverList.findIndex(
      (driver) => driver._id.toString() === id
    );
    if (indexToDelete === -1) {
      return res.status(400).json({ error: "Data to delete does not exist" });
    }

    // Delete the driver
    user.DriverList.splice(indexToDelete, 1);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting driver" });
  }
};

//SearchDriver
export const searchDrivers = async (req, res) => {
  const { field, text } = req.query; // Get the field and text from the request query

  try {
    // Find the user
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Search in the DriverList array
    const results = user.DriverList.filter((item) =>
      item[field].toLowerCase().includes(text.toLowerCase())
    );

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Error searching drivers" });
  }
};

// here we can store the vehicleData.
export const addVehicle = async (req, res) => {
  const { vehicleTypes, name, logo } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if a vehicle with the same type and name already exists
    const vehicleExists = user.vehicles.some(
      (vehicle) =>
        vehicle.vehicleTypes === vehicleTypes && vehicle.name === name
    );
    if (vehicleExists) {
      return res
        .status(400)
        .json({ error: "Vehicle with this type and name already exists" });
    }

    user.vehicles.push({ vehicleTypes, name, logo });

    await user.save();

    res.status(200).json({ message: "Vehicle added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding vehicle" });
  }
};

//GetVehicle
export const getVehicles = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    res.status(200).json(user.vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching vehicles" });
  }
};

// UpdateVehicles
export const updateVehicle = async (req, res) => {
  const { vehicleId, vehicleTypes, name, logo } = req.body;

  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const vehicle = user.vehicles.id(vehicleId);
    if (!vehicle) {
      return res.status(400).json({ error: "Vehicle does not exist" });
    }

    vehicle.vehicleTypes = vehicleTypes;
    vehicle.name = name;
    vehicle.logo = logo;

    await user.save();

    res.status(200).json({ message: "Vehicle updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating vehicle" });
  }
};

// Add City to Country function
export const addCity = async (req, res) => {
  try {
    // Get the country and city from the request body
    const { country, city } = req.body;

    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Find the country in the user's countries
    const userCountry = user.Country.find((c) => c.Name === country);

    if (!userCountry) {
      return res.status(400).json({ error: "Country does not exist" });
    }

    // Check if the city already exists in the country's cities
    if (userCountry.City.includes(city)) {
      return res
        .status(400)
        .json({ error: "City already exists in this country" });
    }

    // Add the city to the country's cities
    userCountry.City.push(city);

    // Save the user
    await user.save();

    res.status(200).json(userCountry);
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      res.status(403).json({ error: "Token not verified" });
    } else {
      res.status(500).json({ error: "Error adding city" });
    }
  }
};
