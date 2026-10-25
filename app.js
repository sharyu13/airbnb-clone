if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express=require("express");
const app = express();

const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const engine = require("ejs-mate");
const asyncWrap = require("./utils/asyncWrap.js");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
// const methodOverride=require("method-override");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");
const methodOverride = require("method-override")


const listingsRouter=require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js");
const userRouter= require("./routes/user.js");
const { register } = require("module");

main().then(() => {
    console.log("connected to url");
})
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));


const sessionOptions = {
    secret:"mysupersecrete",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listingsRouter);

// app.get("/", (req, res) => {
//     res.send("Hi i am root working here");
// });


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (result.error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};






// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));
// app.use((req,res,next)=>{
//     res.locals.currUser = req.user;
//     res.locals.success = req.flash("success") || [];
//     res.locals.error = req.flash("error") || [];
//     console.log(req.user);
//     next();
// }); 

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());



// app.get("/demouser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"abc@gmail.com",
//     username:"delta-student"
//   });
//  let registeruser=await User.register(fakeUser,"helloworld");
//  res.send(registeruser);
// })

app.use("/listings",listingsRouter);
app.use("/",userRouter);
app.use("/listings/:id/reviews",reviewsRouter);


// //index route
// app.get("/listings", async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listing/index", { allListings });
// });


// // show route
// app.get("/listings/:id", asyncWrap(async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate("reviews");
//     if (!listing) {
//         throw new ExpressError(404, "page not fond");

//     }
//     console.log(listing);
//     console.log(listing.reviews);
//     res.render("listing/show.ejs", { listing });
// })
// );

// //new route
// app.get("/listing/new", (req, res) => {
//     res.render("listing/new.ejs");
// });

// //create route
// app.post("/listings", validateListing, asyncWrap(async (req, res, next) => {
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// })
// );

// //edit route
// app.get("/listings/:id/edit", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id);
//     res.render("listing/edit", { listing });
// })

// //update route
// app.put("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
// })
// //delete route

// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findByIdAndDelete(id);
//     console.log(listing);
//     res.redirect("/listings");
// })
//reviews
// app.post("/listings/:id/review", validateReview,asyncWrap(async (req, res) => {
//     let listing = await Listing.findById(req.params.id).populate("reviews");
//     let newREview = new Review(req.body.review);

//     listing.reviews.push(newREview);
//     await newREview.save();
//     await listing.save();
//     res.send("continous");
//     // res.redirect(`/listings/${listing._id}`);

// })
// );

// //delete review route

// app.delete("/listings/:id/reviews/:reviewId",asyncWrap(async(req,res)=>{
//     let{id,reviewID}=req.params;

//     await Listing.findByIdAndUpdate(id, { $pull:{reviews:reviewId}});
//      await Review.findByIdAndDelete(reviewID);
//     res.send("ushhcush");
//     // res.redirect(`/listings/${id}`);

// })
// );

// app.get("/testListing",asy

// let sampleListing=new Listing({
//     title:"My new Villa",
//     description:"By the Beauty",
//     price:1200,
//     location:"Calangute,Goa",
//     country:"India",
// });

// await sampleListing.save()
// console.log("sample was saved");
// res.send("Succsful testing");

// app.all("/*",(req,res,next)=>{
//     next(new ExpressError(404,"page not found"));
// });

// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page Not Found"));
// });



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;

    res.status(statusCode).render("error.ejs", {
        err,
    });
});

app.listen(8080, () => {
    console.log("listening to the port");
});