const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");

main().then(()=>{
    console.log("connected to url");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB =async () =>{
    await Listing.deleteMany({});
    initData.data.map((obj) => ({...obj, owner: "652d0001ae547c5d37e56b5f"}));
    console.log(initData.data[0]);
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

<img
  src="<%= listing.image.url %>"
  width="300"
  height="200"
  style="border:2px solid red;"
></img>
initDB();