const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  url:{
     type:String,
     required:true
  }
})

const url = mongoose.model("url", urlSchema);

module.exports = url;