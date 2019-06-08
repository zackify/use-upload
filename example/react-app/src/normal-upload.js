import React, { useState } from 'react';
import { useUpload } from 'react-use-upload';

const NormalUpload = ({ title }) => {
  let [files, setFiles] = useState();
  let { loading, progress, error } = useUpload(files, {
    path: 'http://localhost:3000/upload',
    name: 'test',
    fields: { extraData: 'hello!' },
  });
  console.log(error, 'here');
  return (
    <div style={{ marginBottom: 50 }}>
      <div>{title || 'Normal HTTP upload'}</div>

      {loading ? (
        <div>Progress: {progress}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <input type="file" onChange={e => setFiles(e.target.files)} />
      )}
    </div>
  );
};

export default NormalUpload;
