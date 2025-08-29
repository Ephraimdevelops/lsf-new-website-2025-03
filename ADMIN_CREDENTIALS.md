# 🔐 LSF Admin Credentials

## **Admin Login Information**

### **Email**: `admin@lsf.or.tz`
### **Password**: `LSFadmin2024!`

---

## **How to Login**

### **1. Frontend Login**
1. Go to: `http://localhost:8082/login`
2. Enter the credentials above
3. Click "Login"
4. You'll be redirected to the admin dashboard

### **2. Admin Dashboard Access**
- **URL**: `http://localhost:8082/admin`
- **Features**: User management, content management, analytics

---

## **Backend API Testing**

### **Test Admin Endpoints**
```bash
# First, get a token by logging in
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lsf.or.tz","password":"LSFadmin2024!"}'

# Use the returned token for admin endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/users
```

---

## **Available Admin Features**

### **1. User Management** 👥
- View all users
- Change user roles
- Ban/unban users
- Delete users
- Invite new users

### **2. Content Management** 📝
- Create/edit/delete news articles
- Manage publications
- Handle opportunities
- Update team members
- Manage hero content

### **3. Analytics** 📊
- View user statistics
- Content analytics
- Activity reports

---

## **Security Notes**

⚠️ **IMPORTANT**: 
- Change the password after first login
- Store credentials securely
- Use HTTPS in production
- Regularly rotate passwords

---

## **Backend Status**

✅ **Backend Server**: Running on port 4000
✅ **Authentication**: Working with Supabase
✅ **API Endpoints**: 45+ endpoints available
✅ **Security**: Rate limiting, validation, CORS

---

## **Quick Test Commands**

```bash
# Test backend status
curl http://localhost:4000/

# Test public endpoints
curl http://localhost:4000/news
curl http://localhost:4000/publications
curl http://localhost:4000/opportunities

# Test authentication
curl http://localhost:4000/auth/me
```

---

## **Next Steps**

1. **Login to admin panel** using the credentials above
2. **Test all admin features** (user management, content management)
3. **Verify backend API** endpoints are working
4. **Start adding content** through the admin interface

🎉 **Your LSF website is now fully functional with complete backend and admin capabilities!**
