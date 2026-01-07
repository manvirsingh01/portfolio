const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Multer Setup for Resume Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Always save as 'resume.pdf' or keep original name? 
        // Let's keep original name for now, or standardize
        cb(null, 'resume.pdf');
    }
});
const upload = multer({ storage: storage });

const DATA_FILE = path.join(__dirname, 'data', 'content.json');

// Ensure data file exists with default data
if (!fs.existsSync(DATA_FILE)) {
    const defaultData = {
        profiles: [
            { id: 1, name: "Recruiter", avatar: "images/avatar1.png" },
            { id: 2, name: "Friend", avatar: "images/avatar2.png" },
            { id: 3, name: "Developer", avatar: "images/avatar3.png" }
        ],
        hero: {
            title: "Featured Project",
            description: "A comprehensive showcase of my skills.",
            imageUrl: "https://via.placeholder.com/1600x800",
            link: "#"
        },
        rows: [
            {
                title: "Web Development",
                items: [
                    { id: 1, title: "Project A", image: "https://via.placeholder.com/300x169" },
                    { id: 2, title: "Project B", image: "https://via.placeholder.com/300x169" }
                ]
            }
        ]
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
}

// API Routes
app.get('/api/content', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read data' });
        res.json(JSON.parse(data));
    });
});

app.post('/api/content', (req, res) => {
    const newData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to save data' });
        res.json({ success: true, message: 'Data updated' });
    });
});

app.post('/api/upload', upload.single('resume'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Update content.json with new resume URL
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to update content data' });

        const json = JSON.parse(data);
        json.resumeUrl = `uploads/${req.file.filename}`;

        fs.writeFile(DATA_FILE, JSON.stringify(json, null, 2), (writeErr) => {
            if (writeErr) return res.status(500).json({ error: 'Failed to save content data' });
            res.json({ success: true, filePath: json.resumeUrl });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
