const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn,isOwner}= require("../views/middleware.js");

const listingController = require("../controllers/listings.js");
const multer=require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
};

//index route
router.get("/", asyncWrap(listingController.index));
//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//create route
router.post("/",isLoggedIn, upload.single('listing[image]'),asyncWrap(listingController.createListing));


// show route
 router.get("/:id", isLoggedIn,asyncWrap(listingController.showListing));



//edit route
router.get("/:id/edit",isLoggedIn, isOwner,asyncWrap(listingController.renderEditForm)); 

//update route
router.put("/:id",isLoggedIn, isOwner,upload.single("listing[image]"),validateListing,asyncWrap(listingController.updateListing));


//delete route

router.delete("/:id",isLoggedIn,isOwner,asyncWrap(listingController.destroyListing));


module.exports=router;