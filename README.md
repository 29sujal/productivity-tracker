# 🚀 Productivity Blocker Chrome Extension

A Chrome Extension to help you stay productive by **blocking distracting sites**, **tracking time spent**, and **generating daily reports** — backed by a full-stack **MERN** backend hosted online.

Live Backend: _[Hosted on Render](https://productivity-tracker-2jkn.onrender.com) 
Author: [@29sujal](https://github.com/29sujal)

---

## ✨ Features

- ✅ **Block distracting websites** (like YouTube, Instagram, etc.)
- 🕒 **Track time spent** on each site per session
- 📊 **View daily usage reports**
- 🔄 **Real-time syncing** of data across devices using backend
- 🌐 **Auto-detect current tab** for fast site blocking
- 🔓 **Unblock sites anytime**
- 🧠 **Built with**: React + Vite + Tailwind + Express + MongoDB

---

## 🏗️ Tech Stack

- **Frontend**: React, Tailwind CSS, Chrome Extensions API, Vite
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Extension Format**: Manifest V3 (MV3)
- **Hosting**: Render (backend), local extension (`dist/`)

---

## 📦 Installation

### 🖥 Backend Setup

```bash
git clone https://github.com/29sujal/productivity-tracker.git
cd productivity-tracker/backend
npm install
````

Create `.env` file in `backend/`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start server locally:

```bash
node server.js
```

### 🧩 Chrome Extension Setup

```bash
cd ../chrome-extension
npm install
npm run build
```

This builds to `dist/` — your extension output folder.

---

## 🧪 Load the Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `dist/` folder

---

## 🌍 Hosting the Backend (Render)

1. Push this repo to GitHub
2. Go to [https://render.com/](https://render.com/)
3. Click "New Web Service" → Connect your GitHub repo
4. Set:

   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
   * Add environment variable `MONGO_URI`
5. Deploy!

Now replace all `http://localhost:5000` in your frontend (`App.jsx`, `background.js`, `content.js`) with your Render domain.

Then rebuild:

```bash
npm run build
```

---

## 📁 Directory Structure

```
productivity-tracker/
├── backend/
│   ├── models/
│   ├── routes/
│   └── server.js
├── chrome-extension/
│   ├── public/
│   ├── src/
│   ├── popup.html
│   └── vite.config.js
└── README.md
```

---

## 📊 Reports Example

On clicking "Daily Report", you’ll see:

```
| Site         | Time Spent |
|--------------|-------------|
| youtube.com  | 18.2 min    |
| instagram.com| 7.5 min     |
```

---

## 🔐 Permissions Used

```json
"permissions": [
  "declarativeNetRequest",
  "declarativeNetRequestWithHostAccess",
  "declarativeNetRequestFeedback",
  "storage"
],
"host_permissions": ["<all_urls>"]
```



## 🙌 Author

Made with 💻 by [@29sujal](https://github.com/29sujal)

> Follow me on GitHub for more cool open source projects!

