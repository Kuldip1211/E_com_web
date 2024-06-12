const mongoose = require("mongoose");

const Dbconnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kuldeepchudasama6999:icBAhWXZN9XafXJb@e-com.w630bfc.mongodb.net/digitic",
      { useNewUrlParser: false, useUnifiedTopology: false }
    );
    console.log("Database connection successful");
  } catch (error) {
    console.error("Error connecting to the database: ", error);
  }
};

module.exports = Dbconnect;
