import { FileUploadProvider, graphqlClient } from 'react-uploader';

const modifyRequest = request => {
  return {
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };
};

const App = () => {
  // graphql client needs a mutation that should be called on the request
  return (
    <FileUploadProvider
      client={{
        modifyRequest,
        request: graphqlClient({ mutation: gql` blah blah` }),
      }}
    >
      <App />
    </FileUploadProvider>
  );
};
