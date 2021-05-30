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
//   name:"Dr. Rajesh Balar",
//   license_no: 13375,
//   dob: "20/03/1975",
//   study: "PhD, DPhil,MPhil",
//   gender: "Male",
//   mobileno: 9726950844,
//   bloodgroup:"O-",
//   email: "dr.rjbalar@gmail.com",
//   username: "rjbalar",
//   pass: "rjbalar",
//   emermobileno: 9054803251,
//   city: "Surat",
//   rating: 4.5,
// })