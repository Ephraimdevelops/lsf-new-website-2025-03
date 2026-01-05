// Run this in Convex Dashboard to make your user an admin

// First, find your user
const users = await ctx.db.query("users").collect();
console.log("All users:", users);

// Replace with your actual email
const myEmail = "YOUR_EMAIL_HERE";
const myUser = users.find(u => u.email === myEmail);

if (myUser) {
    console.log("Found user:", myUser);

    // Update to admin
    await ctx.db.patch(myUser._id, { role: "admin" });
    console.log("✅ User role updated to admin!");
} else {
    console.log("❌ User not found. Please sign up first.");
}
