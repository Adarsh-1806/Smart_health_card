const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const health_report = require("./health_model"); 
const { db } = require('./registers');
mongoose.connect('mongodb://localhost:27017/Healthcard_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log( `Connection Successful`);
}).catch((e) => {
  console.log(`No Connection`);
});
const register_patient = new health_report({
    patient_id : "piuiewufhwujds",
    meta:[{
        dt : "15-06-2020",
        disease : "viral fiver",
        medicine: "peeracitamol",
        doctor:"Dr. A P Moradiya",
    },{
        dt : "20-06-2020",
        disease : "coronar",
        medicine: "covaxin",
        doctor:"Dr. A P Prajapati",
    }]
});
console.log("Patient Data"+register_patient );
// const register_p = await 
register_patient.save();

// db.health_reports.insert( { patient_id: "sdhtrithsfb", 
// meta:[{
//     dt : "15-06-2020",
//     disease : "viral fiver",
//     medicine: "peeracitamol",
//     doctor:"Dr. A P Moradiya",
// },{
//     dt : "20-06-2020",
//     disease : "coronar",
//     medicine: "covaxin",
//     doctor:"Dr. A P Prajapati",
// }]
// } );