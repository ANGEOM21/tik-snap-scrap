const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const SnapTikClient = require("./snaptik.js");
const client = new SnapTikClient();

app.use(express.json());
app.get("/", async (req, res) => {
	res.json({
		status: "success",
		error: null,
		data: "Welcome to SNAP API (Angeom)!",
	});
});

app.get("/api/tik-vid/:url", async (req, res) => {
	const { url } = req.params;
	if (!url) {
		return res.status(400).json({ error: "URL is required" });
	}
	try {
		const result = await client.process(url);
		res.json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
