const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = "pat-eu1-dbe5e414-9bd8-4bd6-9053-9ca92c873dd2";

app.get("/", async (req, res) => {
  try {
    await axios
      .get("https://api.hubapi.com/crm/v3/objects/2-117856707", {
        headers: {
          Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        },
        params: { properties: "name,region,price" },
      })
      .then((response) =>
        res.render("homepage", {
          title: "Home",
          cheeses: response.data.results,
        })
      );
  } catch (e) {
    console.error(e);
  }
});

app.get("/update-cobj", (req, res) => {
  res.render("updates", {
    title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
  });
});

app.post("/update-cobj", async (req, res) => {
  const { name, region, price } = req.body;
  try {
    await axios
      .post(
        "https://api.hubapi.com/crm/v3/objects/2-117856707",
        {
          properties: {
            name,
            region,
            price,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => res.redirect("/"));
  } catch (e) {
    console.error(e);
  }
});

app.listen(3000, () => console.log("Listening on http://localhost:3000"));
