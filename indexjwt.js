const express=require('express');
const app=express();
app.set('view engine','ejs');
const jwt=require('jsonwebtoken');
require('dotenv').config();
console.log(process.env.secret);

app.use(express.urlencoded({extended:true}));
const useraktif=[
    {
        "username":"admin",
        "password":"admin",
        "is_admin":1
    },
    {
        "username":"upin",
        "password":"upin",
        "is_admin":0
    }
];
app.post("/api/register",function(req,res){
        const username=req.body.username;
        const password=req.body.password;
        const userbaru={
            "username": username,
            "password": password,
            "is_admin": 0
        }
        useraktif.push(userbaru);
        console.log(useraktif);
        return res.status(201).send({"username": userbaru.username,"is_admin":userbaru.is_admin});
    }
);
app.post("/api/login", function (req,res) {
    const username=req.body.username;
    const password=req.body.password;
    let ada=null;
    for(let i=0;i<useraktif.length;i++) {
        if(useraktif[i].username==username && useraktif[i].password==password) {
            ada = useraktif[i];
        }
    }
    if (!ada) {
        return res.status(400).send({"msg":"username atau password salah"});
    }
    let token = jwt.sign({"username":ada.username,"is_admin":ada.is_admin},process.env.secret, {notBefore:"20s"});
    //let token = jwt.sign({"username":ada.username,"is_admin":ada.is_admin},"456", {notBefore:"20s"});
    return res.status(200).send({"token":token});
});
function cekJwt(req, res, next) {
    if (!req.headers["x-auth-token"]) {
        return res.status(401).send({"msg":"Token tidak ada"});
    }
    let token = req.headers["x-auth-token"];
    let user=null;
    try {
        user = jwt.verify(token, process.env.secret);
        //user = jwt.verify(token, "456");
    }
    catch (e) {
        return res.status(400).send(e);
    }
    req.user=user;
    next();
}
function cekAdmin(req,res,next) {
    if (!req.user.is_admin) {
        return res.status(403).send({"msg":"Hanya admin yang boleh akses endpoint ini"});
    }
    next();
}
//middleware
app.get("/", cekJwt, function (req,res) {
    console.log(req.user);
    return res.render("displaymenu",{type:"indonesian",
        menu:["batagor","rujak","kluntung"]});
})
app.get("/api/admin", [cekJwt,cekAdmin], function (req,res) {
    return res.status(200).send({"msg":"Selamat Datang di Endpoint Admin"});
})
app.listen(3000,function () {
    console.log("Listening on port 3000");
});