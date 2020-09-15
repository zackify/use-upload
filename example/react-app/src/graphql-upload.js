import React, { useState } from "react";
import { useUpload } from "react-use-upload";

import gql from "graphql-tag";

const uploadMutation = gql`
  mutation UploadFile($input: UploadFileInput!) {
    uploadFile(input: $input) {
      name
      randomField
    }
  }
`;

const GraphQLUpload = () => {
  let [files, setFiles] = useState();

  let { loading, progress, error } = useUpload(files, {
    mutation: uploadMutation,
    variables: { input: { files, name: "test" } },
  });

  console.log(loading, progress, error);

  return (
    <div style={{ marginBottom: 50 }}>
      <div>GraphQL Test</div>
      {loading ? (
        <div>Progress: {progress}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <input
          type="file"
          onChange={(e) => setFiles(e.target.files)}
          multiple
        />
      )}
    </div>
  );
};

export default GraphQLUpload;
