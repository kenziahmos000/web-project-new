# Image Upload Setup

Your recipe system now supports uploading images from your desktop!

## 📦 Quick Setup

### 1. Install Required Package

```bash
cd backend
npm install multer
```

### 2. Create Uploads Directory

```bash
mkdir uploads
```

That's it! The backend is already configured.

## ✨ How It Works

### For Users:
- **Option 1:** Click "Choose File" and select an image from your computer
- **Option 2:** Paste an image URL
- **Preview:** See the image before uploading
- **Remove:** Click "Remove Image" to select a different one

### Technical Details:
- **Max file size:** 5MB
- **Allowed formats:** JPEG, JPG, PNG, GIF, WEBP
- **Storage:** Images saved to `backend/uploads/` folder
- **URL:** Images served at `http://localhost:5001/uploads/filename.jpg`

## 📁 File Structure

```
backend/
├── config/
│   └── upload.js          # Multer configuration
├── uploads/               # Uploaded images stored here
│   └── .gitkeep          # Keeps folder in git
├── routes/
│   └── recipes.js        # Updated with file upload support
└── server.js             # Serves /uploads as static files
```

## 🔧 Features

✅ **Upload from desktop** - Choose files from your computer
✅ **OR paste URL** - Still supports image URLs
✅ **Image preview** - See before uploading
✅ **File validation** - Only images allowed
✅ **Size limit** - Max 5MB per image
✅ **Unique filenames** - Prevents conflicts
✅ **Edit support** - Change images when editing recipes

## 🚀 Test It Out

1. Start backend: `cd backend && npm start`
2. Go to Recipes page
3. Click "Add Your Recipe"
4. Click "Choose File" under "Upload Image"
5. Select an image from your computer
6. See the preview!
7. Submit the form

## 🎯 How Images Are Stored

When you upload `cake.jpg`:
- Saved as: `image-1234567890-987654321.jpg`
- Location: `backend/uploads/`
- URL in database: `/uploads/image-1234567890-987654321.jpg`
- Full URL: `http://localhost:5001/uploads/image-1234567890-987654321.jpg`

## 📝 Notes

- Uploaded images are stored locally in the `backend/uploads/` folder
- Images persist across server restarts
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- The `uploads/` folder is included in `.gitignore` (except `.gitkeep`)

## 🔐 Security

- File type validation (images only)
- File size limit (5MB)
- Unique filenames prevent overwrites
- Safe file handling with multer

---

Enjoy uploading recipe images! 📸🍰

