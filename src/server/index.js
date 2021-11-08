require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

app.get('/apod', async (req, res) => {
	try {
		let image = await fetch(
			`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ image });
	} catch (err) {
		console.log('error:', err);
	}
});

app.get('/rovers', async (req, res) => {
	try {
		let rover_data = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ rover_data });
	} catch (err) {
		console.log('error:', err);
	}
});

app.get('/curiosityphotos', async (req, res) => {
	try {
		let curiosity_photos = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?page=1&api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ curiosity_photos });
	} catch (err) {
		console.log('error:', err);
	}
});

app.get('/opportunityphotos', async (req, res) => {
	try {
		let opportunity_photos = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/latest_photos?page=1&api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ opportunity_photos });
	} catch (err) {
		console.log('error:', err);
	}
});

app.get('/spiritphotos', async (req, res) => {
	try {
		let spirit_photos = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/spirit/latest_photos?page=1&api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ spirit_photos });
	} catch (err) {
		console.log('error:', err);
	}
});

app.get('/perseverancephotos', async (req, res) => {
	try {
		let perseverance_photos = await fetch(
			`https://api.nasa.gov/mars-photos/api/v1/rovers/perseverance/latest_photos?page=1&api_key=${process.env.API_KEY}`
		).then(res => res.json());
		res.send({ perseverance_photos });
	} catch (err) {
		console.log('error:', err);
	}
});

app.listen(port, () =>
	console.log(
		`The Mars Dashboard can be viewed in your browser here http://localhost:${port}`
	)
);
