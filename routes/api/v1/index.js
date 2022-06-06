const express = require('express');
const router = express.Router();

const categoriesRoutes = require('./categorias');
//const registrosRoutes = require('./registros');


router.use('/categories', categoriesRoutes);
//router.use('/registros', registrosRoutes);

module.exports = router;