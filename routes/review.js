const express = require("express");
const router = express.Router({mergeParams:true});
const asyncWrap = require("../utils/asyncWrap.js");
const ExpressError = require("../utils/ExpressError.js")
const { reviewSchema } = require("../schema.js");
const Review = require("../Models/review.js");
const Listing = require("../Models/listing.js");
const{ isLoggedIn ,isReviewAuthor} = require("../views/middleware.js");



const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }
        next();
};

const reviewController=require("../controllers/reviews.js");
const review=require("../Models/review.js");

//reviews
router.post("/", isLoggedIn,validateReview,asyncWrap(reviewController.createReview)
);

//delete review route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,asyncWrap(reviewController.destroyReview)
);

module.exports=router;