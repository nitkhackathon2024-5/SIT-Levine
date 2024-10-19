const mongoose = require('mongoose');

// Define the connectDB function

main()
.then(()=>{
  console.log("connected"); 
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/stock');


  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


