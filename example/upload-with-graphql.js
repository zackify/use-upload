import React, { useState } from 'react';
import { useUpload } from 'react-uploader';

export default () => {
  let [file, setFile] = useState();
  // second argument is extra data to pass along with the request,
  // you can also overwrite the url, or mutation if using the graphql client
  let { loading, progress, error } = useUpload(file, { type: 'case' });

  return (
    <div>
      {loading ? (
        <div>Progress: {progress}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <input type="file" onChange={() => setFile({ file })} />
      )}
    </div>
  );
};
