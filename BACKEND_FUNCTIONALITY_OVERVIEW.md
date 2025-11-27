# 🚀 LSF Backend API - Functionality Overview

## 📊 **Current Backend Status**

### ✅ **Backend Server Status**
- **Primary Backend**: ✅ **Convex**
- **Legacy Backend**: ⚠️ **Supabase/Express** (Deprecated, in process of removal)
- **Authentication**: ✅ **Clerk** (Integrated with Convex)

---

## 🔗 **API Endpoints Overview**

### **Convex Functions** 
All backend logic is now handled via Convex functions (`query` and `mutation`).

### **1. Opportunities** 
- `api.opportunities.get`: List all opportunities
- `api.opportunities.getById`: Get specific opportunity
- `api.opportunities.create`: Create opportunity
- `api.opportunities.update`: Update opportunity
- `api.opportunities.remove`: Delete opportunity

### **2. News** 
- `api.news.get`: List all news
- `api.news.getById`: Get specific news
- `api.news.create`: Create news
- `api.news.update`: Update news
- `api.news.remove`: Delete news

### **3. Hero Slides** 
- `api.hero.get`: List all slides
- `api.hero.create`: Create slide
- `api.hero.update`: Update slide
- `api.hero.remove`: Delete slide

---

## 🔧 **Backend Features**

### **1. Security Features** 🛡️
- ✅ **Convex Auth**: Integrated with Clerk
- ✅ **Row Level Security**: Handled via Convex functions checking `ctx.auth.getUserIdentity()`

### **2. Database Integration** 🗄️
- ✅ **Convex Database**: Real-time, reactive database.
- ✅ **File Storage**: Convex Storage for images and documents.

---

## 🚀 **Migration Status**

### **✅ MIGRATED COMPONENTS**
1. ✅ **Admin Opportunities** - Fully migrated to Convex
2. ✅ **Admin News** - Fully migrated to Convex
3. ✅ **Admin Hero Slides** - Fully migrated to Convex
4. ✅ **Image Uploads** - Migrated to Convex Storage

### **🔄 PENDING MIGRATION**
1. 🔄 **Admin Publications**
2. 🔄 **Admin Programs**
3. 🔄 **Admin Team**
4. 🔄 **Admin Media Library**

---

## 🎯 **Next Steps**
1. Continue migrating remaining Admin components.
2. Remove `backend/` directory once migration is complete.
3. Remove Supabase dependencies from `package.json`.
