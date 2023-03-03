exports.home = (req, res) => {
  res.render("home", {
    title: "Members Only",
  })
}