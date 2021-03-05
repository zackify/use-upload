**Zero dependency, total control, file upload hook for React.**

This has been rewritten into a single file for simplicity, and the function signature has gotten much smaller.

Todo: Test coverage

## V1

Please check the [v1 branch](https://github.com/zackify/react-use-upload/tree/v1) for past documentation

### What is it?

This is a simple hook for handling file uploads in React. It takes the simplest approach possible so that you have full control over the upload process, while still providing lots of help vs implementing this yourself.

It has upload progress due to using XHR, and can be used for uploading file direct to Google Cloud, AWS, etc.

### Install

```js
npm install react-use-upload@1.0.0-beta1
```

### Usage

Here's a basic example of uploading a single file to a url

```js
const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => ({
    method: "PUT",
    url: url,
    body: files[0],
  }));

  return (
    <div>
      {loading ? `${progress}% complete` : null}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            upload({ files: e.target.files });
          }
        }}
      />
    </div>
  );
};
```

#### Formdata

It's up to you to pass in formdata

```js
const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => {
    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: url,
      body: formData,
    };
  });

  return (
    <div>
      {loading ? `${progress}% complete` : null}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            upload({ file: e.target.files[0] });
          }
        }}
      />
    </div>
  );
};
```

#### Adding headers

You can pass a custom headers object

```js
const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => {
    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: url,
      body: formData,
      headers: { Authorization: "test" },
    };
  });

  return (
    <div>
      {loading ? `${progress}% complete` : null}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            upload({ file: e.target.files[0] });
          }
        }}
      />
    </div>
  );
};
```

#### Customizing the request

You have full access to the XHR object, so you can set withCredentials or anything else you'd like.

```js
const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files, xhr }) => {
    xhr.withCredentials = true;

    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: url,
      body: formData,
      headers: { Authorization: "test" },
    };
  });

  return (
    <div>
      {loading ? `${progress}% complete` : null}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            upload({ file: e.target.files[0] });
          }
        }}
      />
    </div>
  );
};
```

#### Signed uploads

Signed uploads to a storage bucket on AWS or similar service, usually require this flow:

- Hit your own backend to generate a signed url
- send the file to that signed url to upload direct
- do something on your frontend after it finishes

Here's how simple it is with this hook

```js
const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(async ({ files }) => {
    // This function is your request logic for getting a url
    let url = await getUploadUrl({
      caseId,
      fileName: files[0].name,
      contentType: files[0].type,
    });
    // returning undefined skips the upload logic, in case your `getUploadUrl` has an error
    if (!url) return;

    return {
      method: "PUT",
      url: url,
      // send a single file in the body to the storage bucker
      body: files[0],
    };
  });

  useEffect(() => {
    if (done) {
      //refetch the data on the page, or some other action so the user can see the upload completed
    }
  }, [done, refetch]);

  return (
    <div>
      {loading ? `${progress}% complete` : null}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            upload({ file: e.target.files[0] });
          }
        }}
      />
    </div>
  );
};
```
