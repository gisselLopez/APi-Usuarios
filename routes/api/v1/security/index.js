const express =require('express');
let router = express.Router();
const { jwtSingReset } = require('../../../../libs/security');
const Usuario = require('../../../../libs/usuarios');
const UsuarioDao = require('../../../../dao/mongodb/models/UsuarioDao');
const Mail = require('../../../../libs/forgotpassword/index');

const userDao = new UsuarioDao();
const user = new Usuario(userDao);
const mail = new Mail();
user.init();

const {jwtSign} = require('../../../../libs/security');

router.post('/login', async (req, res)=>{
  try {
    const {email, password} = req.body;
    const userData = await user.getUsuarioByEmail({email});
    if(! user.comparePasswords(password, userData.password) ) {
      console.error('security login: ', {error:`Credenciales para usuario ${userData._id} ${userData.email} incorrectas.`});
      return res.status(403).json({ "error": "Credenciales no Válidas" });
    }
    const {password: passwordDb, created, updated, ...jwtUser} = userData;
    const jwtToken = await jwtSign({jwtUser, generated: new Date().getTime()});
    return res.status(200).json({token: jwtToken});
  } catch (ex) {
    console.error('security login: ', {ex});
    return res.status(500).json({"error":"No es posible procesar la solicitud."});
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email = '',
      password = ''
    } = req.body;
    if (/^\s*$/.test(email)) {
      return res.status(400).json({
        error: 'Se espera valor de correo'
      });
    }

    if (/^\s*$/.test(password)) {
      return res.status(400).json({
        error: 'Se espera valor de contraseña correcta'
      });
    }
    const newUsuario = await user.addUsuarios({
      email,
      nombre : 'John Doe',
      avatar: '',
      password,
      estado: 'ACT'
    });
    return res.status(200).json(newUsuario);
  } catch (ex) {
    console.error('security signIn: ', ex);
    return res.status(502).json({ error: 'Error al procesar solicitud' });
  }
});


router.post('/recovery', async (req,res) => {
    try {
        const {email} = req.body;
        if(!email || /^\s*$/.test(email))
        {
            return res.status(400).json({
                error: 'Se espera valor de Email'
            });
        }
        const userData = await user.getUsuarioByEmail({email});
        console.log(userData);
        if(userData)
        {
            const {password: passwordDb, created, updated, ...jwtUser} = userData;
            const codigo = jwtUser._id;
            const correo = jwtUser.email;
            const jwtToken = await jwtSingReset({codigo, email, generated: new Date().getTime()});
            const token = jwtToken;
            const resetToken = await user.UpdateToken({codigo, token});
            if(resetToken)
            {
              mail.sendMail(correo,token);
              return res.status(200).json('Check your email');
            }
            return res.status(404).json('An error has occurred');
        }
        return res.status(400).json('username no found');
    } catch(ex)
    {
      console.error('security login: ', {ex});
      return res.status(500).json({"error":"Unable to process request."});
    }
});
router.put('/reset', async (req,res) => {
    try {
        const {token, password} = req.body;
        if(!password || /^\s*$/.test(password))
        {
            return res.status(400).json({
                error: 'Se espera valor de password'
            });
        }
        if(!token || /^\s*$/.test(token))
        {
            return res.status(400).json({
                error: 'Se espera valor de token'
            });
        }
        const userData = await user.getUsuarioByToken({token});
        const verify = await jwtVerify(token);
        if(verify)
        {
            if(userData)
            {
                codigo = userData._id;
                const changePassword = await user.UpdatePassword({codigo, password});

                if(changePassword)
                {
                    return res.status(200).json('password change');
                }
            }
            return res.status(401).json('Este usuario no tiene token');
        }
        return res.status(401).json('token invalid');

    } catch(ex)
    {
        console.error('security login: ', {ex});
        return res.status(500).json({"error":"Unable to process request."});
    }

});

module.exports = router;