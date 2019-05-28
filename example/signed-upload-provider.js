import { FileUploadProvider, signedXhrClient } from 'react-uploader';

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
  /* 
    signedXhrClient makes a requests like this:
    - useUpload is called
    - file metadata, extra data, and status: start is sent to the url, 
      expecting a json object with `url` key inside it with the signed url for the storage bucket
    - upload is started to the signed url
    - the endpoint is hit again, with status: finished
  */
  return (
    <FileUploadProvider
      client={{
        modifyRequest,
        request: signedXhrClient({ url: 'http://localhost:3000/uploads' }),
      }}
    >
      <App />
    </FileUploadProvider>
  );
};
