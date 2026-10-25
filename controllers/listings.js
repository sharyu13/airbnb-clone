const Listing = require("../Models/listing.js");



module.exports.index=async(req, res)=>{
    console.log("CONTROLLER RUNNING");
    const allListings =await Listing.find({});
    res.render("listing/index.ejs",{ allListings });
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("owner")
    .populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    });


    if (!listing) {
        req.flash("error","Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    

    await newListing.save();

    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm=async(req,res)=>{
    let{id} =req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing});
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing },{new:true});


    if( typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
};




