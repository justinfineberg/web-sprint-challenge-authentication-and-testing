const db = require("../../data/dbConfig")

function find(){
    return db("users")
}

function findById(id){
    return db("users").where("id", id)
}

function findBy(filter){
    return db("users").select("username", "password", "id").where(filter)
}


async function add(user){
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    add,
    findById,
    findBy,
    find
}

