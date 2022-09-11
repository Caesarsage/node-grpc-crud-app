const path = require('path')
const protoLoader = require(('@grpc/proto-loader'))
const grpc = require('grpc')

// Knex
const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile")[environment];
const knex = require('knex')(config)

// grpc server
const productProtoPath = path.join(__dirname, 'protos', 'product.proto')
const productProtoDefinition = protoLoader.loadSync('../protos/product.proto')
const grpcObject = grpc.loadPackageDefinition(productProtoDefinition)
const productPackageDefinition = grpcObject.product

// knex query
function listProducts(call, callback) {
  knex('products').then((data) => {
    callback(null, { products: data})
  })
}
function readProduct(call, callback) {
  knex("products").where({
    id: parseInt(call.request.id)
  }).then((data) => {
    if (data.length) {
      callback(null, data[0])
    } else {
      callback("That product does not exit")
    }
  })
}
function createProduct(call, callback) { 
  knex("products").insert({
    name: call.request.name,
    price: call.request.price
  }).then(() => {
    callback(null, { status: 'success'})
  })
}
function updateProduct(call, callback) {
  console.log(call.request)
  knex("products")
    .where({ id: parseInt(call.request.id) })
    .update({
      name: call.request.name,
      price: call.request.price,
    }).returning()
    .then((data) => {
      if (data) {
        callback(null, {status : 'success'})
      } else {
        callback("That product does not exist")
      }
  })
}
function deleteProduct(call, callback) { 
  knex("products")
    .where({ id: parseInt(call.request.id) })
    .delete()
    .returning()
    .then((data) => {
      if (data) {
        callback(null, { status: "success" });
      } else {
        callback("That product does not exist");
      }
    });
}

// main
function main() {
  const server = new grpc.Server();
  // gRPC services - Adds the gRPC service, defined in the product.proto to the server.
  server.addService(productPackageDefinition.ProductService.service , {
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