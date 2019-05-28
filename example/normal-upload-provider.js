import { FileUploadProvider, xhrClient } from 'react-uploader';

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
  return (
    <FileUploadProvider
      client={{
        modifyRequest,
        request: xhrClient({ url: 'http://localhost:3000/uploads' }),
      }}
    >
      <App />
    </FileUploadProvider>
  );
};
