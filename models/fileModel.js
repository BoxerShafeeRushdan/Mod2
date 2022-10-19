const mongoose = require(`mongoose`);

const { Schema } = mongoose;

const fileModel = new Schema({
  file_name: { type: String },
  role: {type: String},
  
});

module.exports = mongoose.model('File',fileModel);