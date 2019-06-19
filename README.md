# Contents

- [Install](#install)
- [Setup](#setup)
  - [Basic](#basic-setup)
  - [Authentication](#authentication)
  - [GraphQL](#graphql)
- [Usage](#usage)
  - [Basic](#basic-usage)
  - [GraphQL](#graphql-usage)
  - [Signed Uploads](#signed-uploads)
  - [React Native](#react-native)

## Benefits

This library is the all-in-one react hook for file uploads. It uses [XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) so that file upload progress can be used.
It supports multiple files at once, and has a built in client for GraphQL uploads. It also has TypeScript definitions for easy debugging.

## Install

```
npm install react-use-upload
```

## Setup

In order to setup the hook, you must first wrap your upload components in an `UploadProvider`. This takes the server url, and lets you pass in additional headers with your upload request.
Here's an example around your root app:

### Basic Setup

If you are not using GraphQL, do not want to set custom headers for all requests, or set a base api url, you can skip to the [basic usage](#basic-usage). **Adding a top level provider is only required for the features I just mentioned.**

```js
import { UploadProvider, createXhrClient } from 'react-use-upload';

<UploadProvider client={createXhrClient({ baseUrl: 'http://localhost:3000' })}>
  <App />
</UploadProvider>;
```

### Authentication

```js
import { UploadProvider, createXhrClient } from 'react-use-upload';

const client = createXhrClient({
  baseUrl: 'http://localhost:3000',
  modifyRequest: request => ({
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }),
});

<UploadProvider client={client}>
  <App />
</UploadProvider>;
```

When any upload takes place, it will first call modify request, so that you can pass in additional headers or fields.

### GraphQL

The graphql client uses the same XHR client under the hood, but it must make additional modifications to the way files are sent to the server. Here's how to do it:

```js
import { UploadProvider, createGraphQLClient } from 'react-use-upload';

const graphQLClient = createGraphQLClient({
  baseUrl: 'http://localhost:3000/graphql',
  modifyRequest: request => ({
    ...request,
    headers: {
      ...request.headers,
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }),
});

<UploadProvider client={client}>
  <App />
</UploadProvider>;
```

As you can see, from an end-user perspective, all that is needed is `createGraphQLClient` instead of the normal `createXhrClient`.

## Usage

I tried to make the hook have the simplest api possible in order to support any possible use cases.

### Basic Usage

```js
import React, { useState } from 'react';
import { useUpload } from 'react-use-upload';

const NormalUpload = () => {
  let [files, setFiles] = useState();
  let { loading, progress, error } = useUpload(files, {
    path: '/upload',
    name: 'test',
    fields: { extraData: 'hello!' },
  });

  return (
    <div style={{ marginBottom: 50 }}>
      <div>Normal HTTP upload</div>

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
```

The first argument to the hook is the `FileList` array that is given from an input onChange. The second is an object that can contain the following keys:

- `path` the path on the server to upload to. If you set `baseUrl` in the provider to `http://localhost`, and made the path in the hook `/upload`, then the request would be made to `http://localhost/upload`
- `name` the name to use for the files when sending to the server
- `fields` additional data to send along with the request
- `headers` extra headers to send

### GraphQL Usage

```js
import React, { useState } from 'react';
import { useUpload } from 'react-use-upload';

import gql from 'graphql-tag';

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
    variables: { input: { files, name: 'test' } },
  });

  return (
    <div style={{ marginBottom: 50 }}>
      <div>GraphQL Test</div>
      {loading ? (
        <div>Progress: {progress}</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <input type="file" onChange={e => setFiles(e.target.files)} multiple />
      )}
    </div>
  );
};
```

Using the `graphql-tag` library, create or import a mutation that is built for file uploads. You can take a look at our example/server.js to see how this works with Apollo server.
The options for graphql are as follows:

- `mutation` The mutation object resulting from graphql-tag
- `variables` The variables that your mutation expects. The files must be inside of here somewhere
- `headers` extra headers to send

### Signed Uploads

When performing an upload to AWS, Google Cloud, or other hosting provider the process is generally like this:

- Hit your own server, with file metadata, and get back a URL that you should upload to. This would be a direct upload url to a storage bucket
- Perform the upload to the signed url
- Hit your own server again if needed, so that you know the file upload is complete (can be done other ways as well)

Here's how this looks:

```js
import React, { useState, useEffect } from 'react';
import { useUpload } from 'react-use-upload';

const getUrl = async files => {
  let response = await fetch('http://localhost:3000/get-url');
  let { url } = await response.json();

  return url;
};

const NormalUpload = () => {
  let [files, setFiles] = useState();

  let { loading, progress, error, done } = useUpload(files, {
    getUrl,
    name: 'test',
  });

  useEffect(() => {
    if (!done) return;
    console.log('done uploading, send something to your server if you need to');
  }, [done]);

  return (
    <div style={{ marginBottom: 50 }}>
      <div>Signed upload</div>

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
```

The library adds one small feature to support these usecases. An async `getUrl` option that can be passed into the configuration object.
This must be a promise, and the upload will wait for it, and use the url it resolves to do the file upload. After it is done, you can make your own `useEffect` if you need to do something afer the upload completes.

### React Native

This works using `ReactNativeFile` from [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client) example coming soon.
