
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (t) => {
    // our id and the core pro customer_id
    t.increments('id').unsigned().primary();
    t.integer('customer_id').unsigned();

    // primary account id aka our "checking account"
    t.integer('primary_account_id').unsigned();
    
    // username, password
    t.string('username', 35).notNull();
    t.text('crypted_password');

    // set indexes for easy access, validation
    t.unique('username');
    t.index('customer_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
