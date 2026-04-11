import User from "../app/user/model";

export const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const phone = process.env.ADMIN_PHONE || "01700000000";
      const password = process.env.ADMIN_PASSWORD || "admin123";
      await User.create({ name: "Admin", phone, password, role: "admin", status: "active" });
      console.log(`✅ Admin created: phone=${phone}`);
    } else {
      console.log("✅ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};
