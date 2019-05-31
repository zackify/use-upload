import cors from 'cors';
import multer from 'multer';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
app.use(cors());

app.get('/upload', (req, res) => res.send('working'));

app.post('/upload', upload.any(), function(req, res, next) {
  console.log(req.files, req.body);
  res.send({ done: true });
});

// Graphql example
const typeDefs = `
input UploadFileInput {
  files: [Upload]
  name: String
}
type Stuff {
  name: String
  randomField: String
}
type Query {
  _empty: String
}
type Mutation {
  uploadFile(input: UploadFileInput!): Stuff
}
`;

const resolvers = {
  Mutation: {
    uploadFile: (_, { input }) => {
      console.log(input.files);
      return { name: input.name, randomField: 'test' };
    },
  },
};

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.listen(8080, '0.0.0.0');
