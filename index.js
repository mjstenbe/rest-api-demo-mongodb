// Otetaan express-moduuli käyttöön
var express = require("express");
var app = express();
var cors = require('cors')
app.use(cors())
var mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
// Luetaan yhteysosoite Herokukn config_varsista
const uri = process.env.DB_URI;
 
 
// Yhdistetään tietokantaan
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Määritellään Schema, eli tietomalli.
const Movie = mongoose.model(
  "Movie",
  {
    title: String,
    year: Number,
    poster: String,
  },
  "movies" // HUOM. Kohdistetaan skeeman operaatiot tähän kokoelmaan
);

// Tämä tarvitaan lomakedatan lukemista varten
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Luodaan reitit ja niiden toiminnallisuudet

app.get("/", (req, res) => {
  res.send("This is a sample REST API.");
});

// Tulostetaan kaikki leffat
var query = {title: /indiana jones/i };
app.get("/leffat", async (req, res) => {
 await Movie.find(query, function (err, results) {
   if (err) res.send(err);
    console.log("Results: " + results);
    res.json(results);
  });
});

app.get("/api/lisaa/:id", function (req, res) {
  res.send("Lisätään leffa: " + req.params.id);
});
// Lisätään yksi leffa - huomaa POST-muuttujien lukeminen
app.post("/api/lisaa", function (req, res) {
  res.send("Lisätään leffa: " + req.body.title + " (" + req.body.year + ")");
});

// Muokataan leffan tietoja id-numeron perusteella. Huomaa ID-arvon lukeminen
app.put("/api/muokkaa/:id", function (req, res) {
  res.send("Muokataan leffaa id:llä: " + req.params.id);
});

// Poistetaan leffa id:n perusteella. Huomaa ID-arvon lukeminen
app.delete("/api/poista/:id", function (req, res) {
  res.send("Poistetaan leffa id:llä: " + req.params.id);
});

const PORT = process.env.PORT || 5000;
// Web-palvelimen luonti Expressin avulla
app.listen(PORT, function () {});
