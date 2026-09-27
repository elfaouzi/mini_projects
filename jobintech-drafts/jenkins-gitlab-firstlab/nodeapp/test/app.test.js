const request = require('supertest');
const app = require('../test'); // Chemin vers votre fichier test.js

describe('GET /', function() {
  it('responds with "Bonjour"', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .expect('Bonjour', done);
  });
});
