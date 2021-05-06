const mysql = require('mysql');
const pool = mysql.createPool({host: "localhost", database: "db_soa", user:"root", password:""});
function getConn() {
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
}
async function findById(id) {
    const conn = await getConn();
    const perintah=`select * from resep where id='${id}'`;
    const hasil = await executeQuery(conn,perintah);
    conn.release();
    if (hasil.length>0) {
        return hasil[0];
    }
    else {
        return null;
    }
}
async function insert(namaresep, typeresep, jumlah) {
    const conn = await getConn();
    const hasil = await executeQuery(conn,`INSERT INTO resep (nama,type,jumlah) VALUES ('${namaresep}','${typeresep}',${jumlah})`);
    conn.release();
    return await findById(hasil.insertId);
}
async function update(id, namaresep, typeresep, jumlah) {
    const conn = await getConn();
    const hasil = await executeQuery(conn,`UPDATE resep SET nama='${namaresep}',type='${typeresep}',jumlah=${jumlah} where id=${id}`);
    conn.release();
    return await findById(id);
}
module.exports={
    "findById": findById,
    "insert": insert,
    "update": update
}