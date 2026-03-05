import { eq } from "drizzle-orm";
import { db } from "./db";
import { demoUsers } from "./db/schema";

const main = () => {
  console.log("Performing CRUD operations...");

  db.insert(demoUsers)
    .values({ name: "Admin User", email: "admin@example.com" })
    .returning()
    .then(([newUser]) => {
      if (!newUser) {
        throw new Error("Failed to create user");
      }
      console.log("✅ CREATE: New user created:", newUser);

      return db
        .select()
        .from(demoUsers)
        .where(eq(demoUsers.id, newUser.id))
        .then((foundUsers) => {
          console.log("✅ READ: Found user:", foundUsers[0]);
          return newUser;
        });
    })
    .then((newUser) => {
      return db
        .update(demoUsers)
        .set({ name: "Super Admin" })
        .where(eq(demoUsers.id, newUser.id))
        .returning()
        .then(([updatedUser]) => {
          if (!updatedUser) {
            throw new Error("Failed to update user");
          }
          console.log("✅ UPDATE: User updated:", updatedUser);
          return newUser;
        });
    })
    .then((newUser) => {
      return db
        .delete(demoUsers)
        .where(eq(demoUsers.id, newUser.id))
        .then(() => {
          console.log("✅ DELETE: User deleted.");
          console.log("\nCRUD operations completed successfully.");
        });
    })
    .catch((error) => {
      console.error("❌ Error performing CRUD operations:", error);
      process.exit(1);
    });
};

main();
