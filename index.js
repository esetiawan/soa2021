const express=require('express');
const app=express();
const port=process.env.PORT || 3000;

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

const pengguna = require('./routes/pengguna');
const resep = require('./routes/resep');
const aksesapi = require('./routes/aksesapi');
const useraktif=[{
   "username":"admin",
   "password":"admin",
   "api_key":"abcde01234"
}];
app.post("/api/register",function(req,res){
      const username=req.body.username;
      const password=req.body.password;
      const userbaru={
         "username": username,
         "password": password,
         "api_key": Math.random().toString(36).substr(2,8)
      }
      useraktif.push(userbaru);
      console.log(useraktif);
      return res.status(201).send({"username": userbaru.username,"api_key":userbaru.api_key});
   }
);

function cekApiKey(req, res, next) {
   if (!req.headers["x-api-key"]) {
      return res.status(401).send({"msg":"Anda tidak boleh mengakses API ini, sertakan API Key"});
   }
   let apikey = req.headers["x-api-key"];
   let ada=false;
   for (let i=0;i<useraktif.length;i++)
   {
      if (useraktif[i].api_key==apikey) {
         ada=true;
      }
   }
   if (!ada) {
      return res.status(400).send({"msg": "API Key tidak terdaftar di sistem"});
   }
   req.isUserAktif=true;
   next();
}
//middleware
app.get("/", cekApiKey, function (req,res) {
   console.log(req.isUserAktif);
   return res.render("displaymenu",{type:"indonesian",
   menu:["batagor","rujak","kluntung"]});
})

app.use("/api/pengguna",pengguna);
app.use("/api/resep",resep);
app.use("/api/aksesapi",aksesapi);

app.listen(port,function () {
   console.log("Listening on port 3000");
});