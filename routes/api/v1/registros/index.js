const express = require('express');
const router = express.Router();


const registro = require('../../../../libs/registros');
const registroDao = require('../../../../dao/models/registroDao');
const RegDao = new registroDao();
const reg = new registro(RegDao);
reg.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await reg.getVersion();
    return res.status(200).json(versionData);
  } catch ( ex ) {
    // manejar el error que pueda tirar el controlador
    console.error('Error registro', ex);
    return res.status(502).json({'error': 'Error Interno de Server'});
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const registros = await reg.getRegistro();
    return res.status(200).json(registros);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const {codigo} = req.params;
    if (!(/^\d+$/.test(codigo))){
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await reg.getRegistroById({codigo: parseInt(codigo)});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {
    categoria='',
    descripcion='',
    type='',
    amount=''} = req.body;
    if (/^\s*$/.test(categoria)) {
      return res.status(400).json({
        error: 'Se espera valor de categoria'
      });
    }
     if (/^\s*$/.test(descripcion)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }
     if (/^\s*$/.test(type)) {
      return res.status(400).json({
        error: 'Se espera url de type'
      });
    }
     if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de contrasena correcta'
      });
    }

    const newregistro = await reg.addRegistro({
    categoria,
    descripcion,
    type,
    amount,
    });
    return res.status(200).json(newregistro);
  } catch(ex){
    console.error(ex);
    return res.status(502).json({error:'Error al procesar solicitud'});
  }
});

router.put('/update/:codigo', async (req, res)=>{
  try {
    const {codigo} = req.params;
    if(!(/^\d+$/.test(codigo))) {
      return res.status(400).json({error:'El codigo debe ser un dígito válido.'});
    }
    const {
    categoria,
    descripcion,
    type,
    amount
    } = req.body;
    if (/^\s*$/.test(categoria)) {
      return res.status(400).json({
        error: 'Se espera valor de categoria'
      });
    }
     if (/^\s*$/.test(descripcion)) {
      return res.status(400).json({
        error: 'Se espera valor de descripcion'
      });
    }
     if (/^\s*$/.test(amount)) {
      return res.status(400).json({
        error: 'Se espera valor de contrasena correcta'
      });
    }
    if (!(/^(ACT)|(INA)$/.test())) {
      return res.status(400).json({
        error: 'Se espera valor de  en ACT o INA'
      });
    }

    const updateResult = await reg.updateRegistro({codigo:parseInt(codigo),
    categoria,
    descripcion,
    type,
    amount
    });

    if (!updateResult) {
      return res.status(404).json({error:'registro no encontrada.'});
    }
    return res.status(200).json({updatedregistro:updateResult});

  } catch(ex) {
    console.error(ex);
    res.status(500).json({error: 'Error al procesar solicitud.'});
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const deletedregistro = await reg.deleteRegistro({ codigo: parseInt(codigo)});

    if (!deletedregistro) {
      return res.status(404).json({ error: 'registro no encontrada.' });
    }
    return res.status(200).json({ deletedregistro});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;

