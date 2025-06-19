process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var app = require('../server'); // Now we require the app instance, not the listening server
var should = chai.should();
var expect = chai.expect;

chai.use(chaiHttp);

let testServer; // Variable to hold the server instance started by the tests

describe('Photos', function() {

    before(function(done) {
        // Start the server for testing purposes on a specific port (e.g., 5000)
        // Ensure this port doesn't conflict with other running processes
        const TEST_PORT = 5000; // Or any other suitable port for testing
        testServer = app.listen(TEST_PORT, () => {
            console.log(`Test server listening on port ${TEST_PORT}`);
            done();
        });
    });

    after(function(done) {
        // Close the server after all tests are done
        testServer.close(() => {
            console.log('Test server closed.');
            done();
        });
    });

    it('should list ALL photos on / GET', function(done) {
        this.timeout(60000);
        chai.request(testServer) // Use the testServer instance here
            .get('/')
            .end(function(err, res) {
                if (err) {
                    console.error('Test error:', err);
                    return done(err); // Pass the error to done to fail the test
                }
                res.should.have.status(200);
                res.should.be.html;
                res.body.should.be.a('object'); // Note: Your previous console output showed this returning HTML, not JSON, so 'object' might be incorrect unless you render JSON. If it's HTML, you might check for string content.
                done();
            });
    });
});