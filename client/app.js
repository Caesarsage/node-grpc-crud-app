const express = require('express')
const productRoutes = require('./routes/productRoutes')


const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/api", productRoutes);

app.listen(4000, () => {
  console.log(`client server listening at port 4000`);
})