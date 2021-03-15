**Zero dependency, total control, file upload hook for React and Svelte with upload progress.**

100% Test Coverage across React + Svelte

This is a simple hook for handling file uploads across multiple frameworks. It takes the simplest approach possible so that you have full control over the upload process, while still providing lots of help vs implementing this yourself.

It has upload progress due to using XHR, and can be used for uploading files direct to Google Cloud, AWS, etc.

### Install

```js
npm install @zach.codes/use-upload
```

## Framework Agnostic

This library supports the same api across frameworks. Currently only svelte and React have implementations.

## Svelte

```js
<script lang="ts">
  import { useUpload } from "@zach.codes/use-upload/svelte";

  let [upload, state] = useUpload(({ files }) => ({
    method: "PUT",
    url: "http://localhost:5000",
    body: files[0],
  }));
</script>

<div>
  {#if $state.done}
    <div>Done uploading!</div>
  {/if}
  {#if $state.error}
    <div>Error uploading: {$state.error}</div>
  {/if}
  {#if $state.loading}
    <div>{$state.progress}% complete</div>
  {/if}
  <input
    type="file"
    on:change={(e) => {
      if (e.currentTarget.files) upload({ files: e.currentTarget.files });
    }}
  />
</div>

```

### React

Here's a basic example of uploading a single file to a url in React. The below examples all work in Svelte as well.

```js
import {useUpload} from '@zach.codes/use-upload/react'

const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => ({
    method: "PUT",
    url: "http://localhost:4000",
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
import {useUpload} from '@zach.codes/use-upload/react'

const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => {
    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: "http://localhost:4000",
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
            upload({ files: e.target.files });
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
import {useUpload} from '@zach.codes/use-upload/react'

const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files }) => {
    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: "http://localhost:4000",
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
            upload({ files: e.target.files });
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
import {useUpload} from '@zach.codes/use-upload/react'

const MyComponent = () => {
  let [upload, { progress, done, loading }] = useUpload(({ files, xhr }) => {
    xhr.withCredentials = true;

    let formData = new FormData();
    files.forEach((file) => formData.append(file.name, file));

    return {
      method: "PUT",
      url: "http://localhost:4000",
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
            upload({ files: e.target.files });
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
import {useUpload} from '@zach.codes/use-upload/react'

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
      // send a single file in the body to the storage bucket
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
            upload({ files: e.target.files });
          }
        }}
      />
    </div>
  );
};
```
