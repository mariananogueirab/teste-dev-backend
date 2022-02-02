const chai = require('chai');
const {
  describe, it, before, after,
} = require('mocha');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../api/index');
const clients = require('./utils/clients');

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /clients/ten', () => {
  describe('quando os clientes são encontrados com sucesso', () => {
    let response;
    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient.connect(
        URLMock,
        { useNewUrlParser: true, useUnifiedTopology: true },
      );

      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);

      /* Promise.all(
        clients.map(
          async (client) => await chai.request(app).post('/clients').send(client),
        ),
      ); */

      await chai.request(app).post('/clients').send(clients[0]);
      await chai.request(app).post('/clients').send(clients[1]);
      await chai.request(app).post('/clients').send(clients[2]);
      await chai.request(app).post('/clients').send(clients[3]);
      await chai.request(app).post('/clients').send(clients[4]);
      await chai.request(app).post('/clients').send(clients[5]);
      await chai.request(app).post('/clients').send(clients[6]);
      await chai.request(app).post('/clients').send(clients[7]);
      await chai.request(app).post('/clients').send(clients[8]);
      await chai.request(app).post('/clients').send(clients[9]);
      await chai.request(app).post('/clients').send(clients[10]);

      response = await chai.request(app)
        .get('/clients/ten');
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it('retorna o código de status 200', () => {
      expect(response).to.have.status(200);
    });

    it('retorna um array', () => {
      expect(response.body).to.be.a('array');
    });

    it('retorna um array com 10 clientes', () => {
      expect(response.body).to.be.length(10);
    });
  });

  describe('Quando não há clientes cadastrados', () => {
    let response;

    const DBServer = new MongoMemoryServer();

    before(async () => {
      const URLMock = await DBServer.getUri();
      const connectionMock = await MongoClient.connect(
        URLMock,
        { useNewUrlParser: true, useUnifiedTopology: true },
      );

      sinon.stub(MongoClient, 'connect')
        .resolves(connectionMock);
      await chai.request(app).post('/clients').send();

      response = await chai.request(app)
        .get('/clients/ten');
    });

    after(async () => {
      MongoClient.connect.restore();
      await DBServer.stop();
    });

    it('recebe o status 404', () => {
      expect(response).to.have.status(404);
    });

    it('retorna um objeto', () => {
      expect(response.body).to.be.a('object');
    });

    it('o objeto possui a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    });

    it(
      'a propriedade "message" possui o texto "There are no clients registered"',
      () => {
        expect(response.body.message)
          .to.be.equal('There are no clients registered');
      },
    );
  });
});
