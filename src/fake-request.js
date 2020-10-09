const httpMocks = require('node-mocks-http');


const newMockResponse = httpMocks.createResponse();

newMockResponse.writeHead(200)

newMockResponse.writeHead(404)

newMockResponse.write('hoo');

console.log(newMockResponse)
console.log(newMockResponse._getStatusCode())
console.log(newMockResponse._getData())

newMockResponse.write('ooh');

console.log(newMockResponse._getData())
newMockResponse
