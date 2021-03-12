import React from "react";
import { useEffect } from "react";
import { useUpload } from "../src";

type Props = {
  method: string;
  url: string;
  headers?: any;
  skipOptionsCb?: () => any;
};
export const BasicTestUpload = ({
  skipOptionsCb,
  method,
  url,
  headers,
}: Props) => {
  let [upload, { error, responseHeaders, progress, done, loading }] = useUpload(
    ({ files }) => {
      if (skipOptionsCb) {
        skipOptionsCb();
        return undefined;
      }
      return {
        method,
        url,
        headers,
        body: files[0],
      };
    }
  );

  return (
    <div>
      {responseHeaders ? <div>{responseHeaders.Test}</div> : null}
      {error ? <div>{error}</div> : null}
      {done ? <div>done</div> : null}
      {loading ? <div>loading</div> : null}
      {loading ? `${progress}% progress` : null}
      <input
        type="file"
        aria-label="upload"
        onChange={(e) => {
          if (e.target.files) {
            upload({ files: e.target.files });
          }
        }}
      />
    </div>
  );
};
