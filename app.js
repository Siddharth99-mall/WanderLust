const express = require("express");
const app = express();
const mongoose = require("mongoose"); 
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const Review=require("./models/review");




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs", ejsMate);
app.use (express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride('_method'));



//Connecting database

main().then(res=>{
    console.log("Connection Successful");
}).catch(err=>{
    console.log(err);
})
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const validateListing = (req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
     let errMsg=error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Routes
app.get("/",(req,res)=>{
    res.send("Hii I am root");
});
app.get("/listing" , wrapAsync (async (req,res)=>{
    let allListings = await Listing.find({}); 
    res.render("listings/index.ejs", {allListings});
}));
app.get("/listing/:id/show",wrapAsync (async (req,res)=>{
    let {id} =req.params;
    let list =await Listing.findById(id);
    res.render("listings/listing.ejs",{list});

}));
app.get("/listing/new",(req,res)=>{
    res.render("listings/newListing.ejs");
});
app.get("/listing/:id/edit",wrapAsync (async (req,res)=>{
    let {id}=req.params;
    let data= await Listing.findById(id);
    res.render("listings/edit.ejs",{data})
}));
app.post("/listing",validateListing , wrapAsync (async(req,res,next)=>{
    let newlisting=new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listing");
}));

app.post("/listing/:id/reviews", async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews=newReview

    await newReview.save();
    await listing.save();

    res.send("Review Sent")

})

app.put("/listing/:id", validateListing ,wrapAsync (async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}/show`);
}));
app.delete("/listing/:id",wrapAsync (async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
}));




app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));   
})

app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong"}=err;
    res.render("listings/error.ejs", {statusCode,message});
    // res.status(statusCode).send(message);
})

app.listen(port,()=>{
    console.log("Server Working");
});