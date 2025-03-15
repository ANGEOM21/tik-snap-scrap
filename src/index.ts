import express from "express";
import dotenv from "dotenv";
import processUrl from "./snaptik";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const APP_URL = process.env.APP_URL || "http://localhost";

app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "WELCOME TO API SNAP TIKTOK ",
		version: "1.0.0",
		author: "Angeom21"
	});
});

app.post("/api", async (req, res) => {
	try {
		const { url } = req.body;
		const result = await processUrl(url);
		res.json(result);
	} catch (error: any) {
		res.status(500).json({ error: error?.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on ${APP_URL}:${PORT}`);
});
