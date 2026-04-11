import User from "../app/user/model";

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      await User.create({
        name: "Admin",
        phone: "01700000000",
        password: "admin123",
        role: "admin",
        status: "active",
      });
      console.log("✅ Admin created: phone=01700000000, password=admin123");
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
