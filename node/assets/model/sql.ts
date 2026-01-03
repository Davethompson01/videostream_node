import dbOPS from "./dbOPS.ts";

export default class sql {
  public dbops = new dbOPS();

  public async createUser() {
    const create = await this.dbops.createTable(
      "test",
      `
      users_id INT AUTO_INCREMENT PRIMARY KEY,
      provider ENUM('google','local') NOT NULL,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      avatar VARCHAR(255),
      access_token VARCHAR(255),
      refresh_token VARCHAR(255),
      location VARCHAR(100),
      user_type VARCHAR(50) NOT NULL,
      google_token_expires_at DATETIME,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `
    );
    return create;
  }
}



// Immediately invoked async function to run the script
(async () => {
  try {
    const insta = new sql();
    const create = await insta.createUser();
    console.log("Created users table", create);
  } catch (error) {
    console.error("Failed to create table:", error);
  } finally {
    process.exit();
  }
})();
