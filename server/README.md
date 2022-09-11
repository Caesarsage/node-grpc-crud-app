
### Dynamic vs Static Code Generation

There are two ways of working with Protocol Buffers in Node:

- Dynamically: with dynamic code generation, the Protocol Buffer is loaded and parsed at run time with Protobuf.js
- Statically: with the static approach, the Protocol Buffer is pre-processed into JavaScript

We used the dynamic approach above. The dynamic approach is quite a bit simpler to implement, but it differs from the workflow of other gRPC-supported languages, since they require static code generation.

Want to use the static approach?


***First, install grpc-tools globally:***

```js
npm install -g grpc-tools
```
Then, run the following from the project root:

```js

protoc -I=. ./protos/product.proto \
  --js_out=import_style=commonjs,binary:./server \
  --grpc_out=./server \
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`

```