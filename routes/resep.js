const express = require('express');
const router = express.Router();
const resepModel = require("./../model/resep");
const multer = require("multer");
const fs = require('fs');
const storage = multer.diskStorage(
    {
        destination:function (req,file,callback) {
            callback(null, "./uploads");
        },
        filename:function (req,file,callback) {
            const filename = file.originalname.split(".");
            const extension = filename[filename.length-1];
            let namauser = req.params.nama;
            if (!namauser) {
                namauser = req.body.nama;
            }
            //callback(null,file.fieldname+Date.now()+"."+extension);
            callback(null,namauser+Date.now()+"."+extension);
        }
    }
);
const uploads = multer({storage:storage});
//const mysql = require('mysql');
//const pool = mysql.createPool({host: "db4free.net", database: "dbresep", user:"usersoa", password:"passwordsoa"});
/*function getConn() {
    return new Promise( function (resolve, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
}
function executeQuery(conn, q)
{
    return new Promise( function (resolve, reject) {
        conn.query(q,function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}*/
router.get("/", async function (req,res) {
    try {
        const conn = await getConn();
        let perintah="";
        if (req.query.id) {
            perintah=`select * from resep where id='${req.query.id}'`;
        }
        else
        {
            perintah="select * from resep ";
        }
        const hasil = await executeQuery(conn, perintah);
        console.log(hasil);
        conn.release();
        return res.status(200).send(hasil);
    }
    catch (ex) {
        return res.status(500).send(ex);
    }
});
router.post("/",uploads.single("foto"),async function(req,res) {
    try {
        return res.status(201).send(await resepModel.insert(req.body.nama,req.body.type,req.body.jumlah));
    }
    catch (ex) {
        return res.status(500).send(ex);
    }
});
router.put("/:id",uploads.single("foto"),async function(req,res) {
    //dapatkan nama file foto yang lama
    try {
        let hasilresep = await resepModel.findById(req.params.id);
        let namafilelama = "rujak1615367454322.jpg";
        fs.unlinkSync(`./uploads/${namafilelama}`); //hapus file foto lama di folder uploads
        let namafilefotobaru = req.file.filename; //mestinya namafilefotobaru diupdate ke tabel resep
        return res.status(200).send(await resepModel.update(req.body.nama,req.body.type,req.body.jumlah));
    }
    catch (ex) {
        return res.status(500).send(ex);
    }
});
//resep      id(nvarchar 3), nama(nvarchar MAX), type(nvarchar 10), jumlah (int)
module.exports=router;