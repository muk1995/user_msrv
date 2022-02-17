 /*module.exports = {
   //link about knex
   //https://stackfame.com/knexjs-complete-tutorial
//  https://dev.to/easybuoy/setting-up-a-node-api-with-postgres-and-knex-588f
  development: {
    client: 'mysql',
    connection: {
         host: "localhost",
         user: "root",
         password: "",
         database: "user",
         //connectionLimit: 10
    },
    debug: false,
    pool: {
      max: 1,
      min: 1
    },
    migrations: {
      directory: './migrations',
      //tableName: 'users',
    },
    seeds: {
      directory: './seeds'
    }
  },
  

  staging: {
    client: 'mysql',
    connection: {
         host: "localhost",
         user: "root",
         password: "",
         database: "user",
         //connectionLimit: 10
    },
    debug: false,
    pool: {
      max: 1,
      min: 1
    },
    migrations: {
      directory: './migrations',
      //tableName: 'users',
    },
    seeds: {
        directory: './seeds'
    },

  production: {
    client: 'mysql',
    connection: {
         host: "localhost",
         user: "root",
         password: "",
         database: "user",
         //connectionLimit: 10
    },
    debug: false,
    pool: {
      max: 1,
      min: 1
    },
    migrations: {
      directory: './migrations',
     // tableName: 'users',
    },
    seeds: {
        directory: './seeds'
    }

  }
}
}
*/
const knex = require("knex")({
  client: 'mysql',
  connection: {
       host: "localhost",
       user: "root",
       password: "",
       database: "users",
       //connectionLimit: 10
  },
  pool: {min: 0, max: 10},
})


module.exports = knex;
