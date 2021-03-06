
var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var PostSchema = new Schema({

  clID: {
    type: String,
    unique : true, 
    required : true, 
    dropDups: true
  },
  url: {
    type: String,
    unique : true
  },  
  desc: {
    type: String,
    unique : true
  },  
  img: {
    type: String
  },
  price: {
    type: String
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var Post = mongoose.model("Post", PostSchema);

module.exports = Post;
