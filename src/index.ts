import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import processUrl from "./snaptik";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const APP_URL = process.env.APP_URL || "http://localhost";
// const __dirname = path.resolve();

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
// 	res.json({	
// 		message: "WELCOME TO API SNAP TIKTOK ",
// 		version: "1.0.0",
// 		author: "Angeom21"
// 	});
// });

app.post("/api/tik-tok", async (req, res) => {
	try {
		const { url } = req.body;
		const result = await processUrl(url);
		res.json(result);
	} catch (error: any) {
		res.status(500).json({ error: error?.message });
	}
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../public")));
	console.log(path.join(__dirname, "../public"))

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../public", "index.html"));
	});
}
app.listen(PORT, () => {
	console.log(`Server is running on ${APP_URL}:${PORT}`);
});
