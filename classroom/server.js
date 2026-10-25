const express=require("express");
const app=express();
// const users=require("./routes/user.js");
// const posts=require("./routes/post.js");
const cookieParser=require("cookie-parser");
const session = require("express-session");
const flash=require("connect-flash");
const path=require("path")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session({
    secret:"mysuperscretescretestring",
    resave:false,
    saveUninitialized:true
}));

app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  next();
});

app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count=1;
    }
  res.send(`you send a request ${req.session.count} times`);
});

app.get("/register",(req,res)=>{
    let{name="anonymus"} = req.query;
    req.session.name = name;

    if(name === "anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash("success","user registered successfully");
    }
    
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.send(`hello,${req.session.name}`);
});

app.get("/test",(req,res)=>{
    res.send("test is succesful");
});

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie",(req,res)=>{
    res.cookie("made-in","india",{signed:true});
    res.send("signed cookie sent");
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});


app.get("/getcookies",(req,res)=>{
    res.cookie("greet","namaste");
});

app.listen(3000,()=>{
    console.log("server is listening");
});