const express = require('express');
const router = express.Router();

const arrpengguna = [
    { "id": "admin", "pass": "admin"},
    { "id": "bigboss", "pass": "bigboss"}
];
router.get("/", function (req,res) {
    if (req.query.nama) {
        const hasil = [];
        for (let i = 0; i < arrpengguna.length; i++) {
            //if (arrpengguna[i].id.includes(req.query.nama)) {
            //if (arrpengguna[i].id.match("/"+req.query.nama+"/i")) {    //  /g mencari semua kemunculan  /m   [abc]
            if (arrpengguna[i].id.match("["+req.query.nama+"]+")) {
                hasil.push(arrpengguna[i]);
            }
        }
        if (hasil.length<=0)
        {
            return res.status(404).send({"msg":"Pengguna dengan kriteria tidak ditemukan"});
        }
        else {
            return res.status(200).send(hasil);
        }
    }
    else {
        return res.status(200).send(arrpengguna);
    }

});
router.delete("/:id", function (req,res) {
    for (let i = 0; i <arrpengguna.length ; i++) {
        if (arrpengguna[i].id==req.params.id) {
            let hasildel = arrpengguna.splice(i,1)[0];
            return res.status(200).send(hasildel); //langsung keluar dari function setelah data dihapus
        }
    }
    //kalau sampai di sini, berarti id tidak ditemukan
    return res.status(404).send({"msg":"Data Id Pengguna tidak ditemukan"});
});
module.exports=router;