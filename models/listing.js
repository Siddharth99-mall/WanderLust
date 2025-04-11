const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        type:String,
        default:
        "https://plus.unsplash.com/premium_photo-1661963123153-5471a95b7042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D",
        set: (v)=> v === "" ? "https://plus.unsplash.com/premium_photo-1661963123153-5471a95b7042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWwlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D" : v }
    ,
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    reviews:{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;