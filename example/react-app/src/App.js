import React from "react";
import {
  UploadProvider,
  createXhrClient,
  createGraphQLClient,
} from "react-use-upload";

import SignedUpload from "./signed-upload";
import NormalUpload from "./normal-upload";
import GraphQLUpload from "./graphql-upload";

const xhrClient = createXhrClient({
  baseUrl: "http://localhost:8080",
  modifyRequest: (request) => ({
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }),
});

const graphQLClient = createGraphQLClient({
  baseUrl: "http://localhost:8080/graphql",
  modifyRequest: (request) => ({
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }),
});

export default () => {
  return (
    <React.Fragment>
      <UploadProvider client={graphQLClient}>
        <GraphQLUpload />
      </UploadProvider>
      <UploadProvider client={xhrClient}>
        <NormalUpload path="/upload" />
        <SignedUpload />
      </UploadProvider>

      <NormalUpload
        title="Normal upload, no provider"
        path="http://localhost:8080/upload"
      />
    </React.Fragment>
  );
};
