import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  User: [
    {
      name: String,
      email: String,
      phone: String,
      countrycode: String,
    },
  ],
  DriverList: [
    {
      name: String,
      email: String,
      phone: String,
      countrycode: String,
    },
  ],
  Country: [
    {
      Name: String,
      Currency: String,
      CountryCode: String,
      CountryCallingCode: String, 
      TimeZone: String,
      City: [String],
    },
  ],
  vehicles: [
    {
      vehicleTypes: String,
      name: String,
      logo: String,
    },
  ],
});

export default mongoose.model("User", UserSchema);
