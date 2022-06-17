const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class registroDao extends DaoObject{
  constructor(db = null){
    console.log('registroDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS Registros (id INTEGER PRIMARY KEY AUTOINCREMENT,category TEXT, description TEXT, type income, amount DECIMAL,date TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from Registros;', []
    );
  }

  getById( {codigo} ){
    const sqlstr= 'SELECT * from Registros where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({categoria, descripcion,type,amount}) {
    const sqlstr = 'INSERT INTO Registros (category, status) values (?, ?);';
    const date = new Date().toISOString();
    const sqlParamArr = [categoria, descripcion,type,amount,date];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({codigo, categoria, descripcion,type,amount}){
    const sqlstr= 'UPDATE Registros set category = ?, status = ? where id = ?;';
    const sqlParamArr = [categoria, descripcion,type,amount,codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM Registros where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}