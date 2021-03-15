import {
  BeforeRequest,
  UploadProps,
  UploadFunction,
  UseUploadState,
  Headers,
} from "./types";

type UseUploadCreatorProps<Response> = {
  beforeRequest: BeforeRequest;
  setState: (data: UseUploadState<Response>) => any;
  updateState: (
    cb: (data: UseUploadState<Response>) => UseUploadState<Response>
  ) => any;
};

export const useUploadCreator = <Response = any>({
  beforeRequest,
  setState,
  updateState,
}: UseUploadCreatorProps<Response>): UploadFunction => {
  const upload = async ({ files }: UploadProps) => {
    setState({ loading: true, done: false });

    const xhr = new XMLHttpRequest();
    let options = await beforeRequest({ xhr, files });
    // bail out if you return undefined from options
    if (!options) return setState({ loading: false, done: false });
    xhr.open(options.method, options.url);

    /*
      Helper method for setting headers on an xhr request, one of the only
      extra features of this hook
    */
    if (options.headers) {
      let headers = options.headers;
      Object.keys(options.headers).forEach((header) =>
        xhr.setRequestHeader(header, headers[header])
      );
    }

    /*
      XHR Listeners
    */
    xhr.upload.addEventListener("progress", (event) => {
      updateState((state) => ({
        ...state,
        progress: Math.round((event.loaded / event.total) * 100),
      }));
    });

    xhr.addEventListener("load", () => {
      let data;
      try {
        data = JSON.parse(xhr.response);
      } catch (e) {
        data = xhr.response;
      }

      let responseHeaders = xhr
        .getAllResponseHeaders()
        .trim()
        .split(/[\r\n]+/)
        .map((line) => line.split(": "))
        .reduce((acc: Headers, [header, value]) => {
          acc[header] = value;
          return acc;
        }, {});

      setState({ data, loading: false, xhr, responseHeaders, done: true });
    });

    xhr.addEventListener("error", (error) => {
      setState({ error, xhr, loading: false, done: true });
    });

    xhr.addEventListener("abort", (error) => {
      setState({ error, xhr, loading: false, done: true });
    });

    /*
      send the request!
    */
    xhr.send(options.body);
  };

  return upload;
};
