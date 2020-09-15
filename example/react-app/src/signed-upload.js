import React, { useState, useEffect } from "react";
import { useUpload } from "react-use-upload";

const getUrl = async (files) => {
  let response = await fetch("http://localhost:8080/get-url");
  let { url } = await response.json();
  console.log(
    "the uploader waits for the promise to resolve and uses this url to upload",
    files
  );
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return url;
};

const NormalUpload = () => {
  let [files, setFiles] = useState();

  let { loading, progress, error, done } = useUpload(files, {
    getUrl,
    name: "test",
  });

  useEffect(() => {
    if (!done) return;
    console.log(
      "done uploading, send something to your server if you need to",
      files
    );
  }, [done, files]);

  return (
    <div style={{ marginBottom: 50 }}>
      <div>Signed upload</div>

      {loading ? (
        <div>Progress: {progress}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <input type="file" onChange={(e) => setFiles(e.target.files)} />
      )}
    </div>
  );
};

export default NormalUpload;
