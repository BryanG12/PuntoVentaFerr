// import { getConnection } from "./../database/database";
import { request, response } from 'express';
import { pool } from './../database/database.js';
import bcryptjs from 'bcryptjs';
import generateJWT from '../helpers/jwt.js';

const getUsers = async (req = request, res = response) => {

  const [result] = await pool.query("SELECT User, CONCAT(Name,' ',LastName) FullName FROM tblUser");
  res.json(result);
  
};

const createUser = async (req = request, res = response) => {
  try {
    const { User, Rol, Name, LastName } = req.body;
    let { Password } = req.body;

    let [usuario] = await pool.query(
      "SELECT COUNT(*) as user FROM tblUser WHERE User=?",
      User
    );

    if (!!usuario[0].user) {
      return res.status(400).json({
        ok: false,
        msg: " el usuario ya existe",
      });
    }

    const salt = bcryptjs.genSaltSync();
    Password = bcryptjs.hashSync(Password, salt);

    const user = {
      User,
      Password,
      Rol,
      Name,
      LastName,
    };
    usuario = await pool.query("INSERT INTO tblUser SET ?", user);

    res.json(usuario);


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: `Error al crear usuario error:${error}`,
    });
  }
};

const loginUser = async (req = request, res = response) => {

  
  try {
    const { User, Password } = req.body;

    let [usuario] =  await pool.query(
      "SELECT COUNT(*) as user, Password, Id FROM tblUser WHERE User=?",
      User
    );

    if (!!!usuario[0].user) {
      return res.status(400).json({
        ok: false,
        msg: " el usuario no existe",
      });
    }

    const validPassword = bcryptjs.compareSync(Password, usuario[0].Password);

    if(!validPassword){
      return res.status(400).json({
        ok:false,
        msg:'Contraseña invalida'
      });
    }

    const token = await generateJWT( usuario[0].id,User);

    res.json({
      ok: true,
      uid: usuario[0].Id,
      user: User,
      token
    })


  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: `Error al logearse: ${error} `,
    });
  }
};


const revalidateToken = async(req=request, res=response)=>{
  
  try {
    
    const uid = req.uid;
    const user = req.user;
  
  
  
    //Generar Nuevo token
    const token =  await generateJWT(uid,  user );
  
    res.json({
      ok: true,
      uid,
      user,
      token
    })
    
  } catch (error) {
    res.status(500).json({
      ok:false,
      msg: 'Error en el usuario',
    })
  }

}

export const methods = {
  getUsers,
  createUser,
  loginUser,
  revalidateToken
};
