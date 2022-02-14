exports.up = knex =>{
  return Promise.all([
  knex.schema.createTable("users", table => {
    table.increments();
    table.string('account_id', 15).unique();
    table.string('salt', 255);
    table.string('password', 255);
    table.string('email').unique().nullable();
    table.string('name');
    table.string('is_deleted');
    table.timestamp('created_at');
    table.timestamps(true);
   
    

  })
])
}
exports.down = knex => knex.schema.dropTableIfExists("users");



///CREATE TABLE `user`.`users` ( `id` INT NOT NULL AUTO_INCREMENT , `account_id` VARCHAR(15) NULL DEFAULT NULL , `salt` VARCHAR(255) NULL DEFAULT NULL , `password` VARCHAR(255) NOT NULL , `email` VARCHAR(255) NOT NULL , `name` VARCHAR(255) NULL , `photo` BLOB NULL DEFAULT NULL , `is_deleted` VARCHAR NOT NULL , `created_at` DATETIME NULL , `updated_at` DATETIME NULL , PRIMARY KEY (`id`), UNIQUE (`account_id`), UNIQUE (`email`)) ENGINE = InnoDB;
