const path = require('path')
const protoLoader = require(('@grpc/proto-loader'))
const grpc = require('grpc')

// Knex
const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile")[environment];
const knex = require('knex')(config)

// grpc
const productProtoPath = path.join(__dirname, '..', 'protos', 'product.proto')
const productProtoDefinition = protoLoader.loadSync(productProtoPath)
const productPackageDefinition = grpc.loadPackageDefinition(productProtoDefinition)

// knex query
function listProducts(call, callback) {}
function readProduct(call, callback) {}
function createProduct(call, callback) { }
function updateProduct(call, callback) { }
function deleteProduct(call, callback) { }

// main
function main() {
  const server = new grpc.Server();
  // gRPC services - Adds the gRPC service, defined in the product.proto to the server.
  server.addService(productPackageDefinition.ProductService.service, {
    listProducts: listProducts,
    readProduct: readProduct,
    updateProduct: updateProduct,
    createProduct: createProduct,
    deleteProduct: deleteProduct,
  });

  // gRPC server listener: connect insecurely (not advisable for prod)
  server.bind("localhost:50051", grpc.ServerCredentials.createInsecure());
  server.start();
  console.log("gRPC server running at http:127.0.0.1:50051");
}

main()