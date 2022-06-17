const path = require('path');
const dotenv = require('dotenv');
const UsuarioDao = require('./UsuarioDao');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const Connection = require('../Connection');
const { hasUncaughtExceptionCaptureCallback } = require('process');

describe("Testing Usuario Crud in MongoDB", () => {
  const env = process.env;
  let db, UserDao, id;
  beforeAll(async () => {
    jest.resetModules();
    process.env = {
      ...env,
      MONGODB_URI: "mongodb+srv://ochenta_user:4iBGz15x7vDcFyFn@cluster2022.bhiilrb.mongodb.net/?retryWrites=true&w=majority",
      MONGODB_DB: "sw202202_test",
      MONGODB_SETUP: 1,
    };
    db = await Connection.getDB();
    UserDao = new UsuarioDao(db,'Usuarios');
    await UserDao.init();
    return true;
  });
  afterAll(async()=>{
    process.env = env;
    return true;
  });
  test('Get All Records', async ()=>{
    const result = await UserDao.getAll();
    console.log(result);
  });
  test('Insert One Record', async ()=>{
    const result = await UserDao.insertOne({ categoria:'Test INS', estado:'ACT'});
    console.log(result);
    id = result.insertedId;
    expect(result.acknowledged).toBe(true);
  });
  test('FindById Record', async ()=>{
    const record = await UserDao.getById({codigo:id.toString()});
    console.log(record);
    expect(record._id).toStrictEqual(id);
  });
  test('Update One Record', async ()=>{
    const updateResult = await UserDao.updateOne({codigo:id.toString(), categoria:'TEST INS UPD', estado:'INA'});
    console.log(updateResult);
    expect(updateResult.acknowledged).toBe(true);
  });
  test('Delete One Record', async () => {
    const deleteResult = await UserDao.deleteOne({ codigo: id.toString() });
    console.log(deleteResult);
    expect(deleteResult.acknowledged).toBe(true);
  });
});