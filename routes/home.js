module.exports = (req, res) => {
  // Renders the 'charts' template using the Yield Curve title
  return res.render('charts', {
    title: 'Yield Curve'
  })
}

