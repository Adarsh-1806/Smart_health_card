const { decodeBase64 } = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Healthcard_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log( `Connection Successful`);
}).catch((e) => {
  console.log(`No Connection`);
});


// db.doctors.insertOne({
//   name:"Dr. Ramika Sharma",
//   license_no: 25142,
//   dob: "05/11/1989",
//   gender: "Female",
//   mobileno: 9574788540,
//   emermobileno: 9054248902,
//   City: "Mumbai"
// })