const DaoObject = require('../../dao/DaoObject');
module.exports = class Registro {
  ResgistroEIDao = null;

  constructor ( ResgistroEIDao = null) {
    if (!(ResgistroEIDao instanceof DaoObject)) {
     throw new Error('An Instance of DAO Object is Required');
    }
    this.ResgistroEIDao = ResgistroEIDao;
  }
  async init(){
    await this.ResgistroEIDao.init();
    this.ResgistroEIDao.setup();
  }
  async getVersion () {
    return {
      entity: 'Registros',
      version: '1.0.0',
      description: 'CRUD de registros de ingresos y egresos'
    };
  }

  async addRegistro ({
    categoria,
    descripcion,
    type,
    amount
  }) {
    const result =  await this.ResgistroEIDao.insertOne(
      {
        categoria,
        descripcion,
        type,
        amount
      }
    );
    return {
        categoria,
        descripcion,
        type,
        amount,
        id: result.lastID
    };
  };

  async getRegistro () {
    return this.ResgistroEIDao.getAll();
  }

  async getRegistroById ({ codigo }) {
    return this.ResgistroEIDao.getById({codigo});
  }

  async updateRegistro ({
    categoria,
    descripcion,
    type,
    amount,
     }) {
    const result = await this.ResgistroEIDao.updateOne({
    categoria,
    descripcion,
    type,
    amount,
     });
    return {
        id: codigo,
        categoria:categoria,
        descripcion: descripcion,
        type:type,
        amount:amount,
        modified: result.changes
    }
  }

  async deleteRegistro({ codigo }) {
    const cateToDelete = await this.ResgistroEIDao.getById({codigo});
    const result = await this.ResgistroEIDao.deleteOne({ codigo });
    return {
      ...cateToDelete,
      deleted: result.changes
    };
  }
}