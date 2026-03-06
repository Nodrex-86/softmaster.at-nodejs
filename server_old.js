import express from "express";
import { projects } from "./data/projects.js";

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

function renderPage(res, view, data) {
  res.render(view, data, (err, html) => {
    res.render("layout", { ...data, body: html });
  });
}

app.get("/projects", (req, res) => {
  const hour = new Date().getHours();
  const theme = hour >= 18 ? "dark" : "light";

  renderPage(res, "projects", {
    title: "Projects",
    lang: "de",
    theme,
    projects
  });
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000/projects");
});
