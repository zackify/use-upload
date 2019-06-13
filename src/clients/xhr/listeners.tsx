type XHRListenerProps = {
  xhr: XMLHttpRequest;
  onProgress: (progress: number) => void;
  resolve: (args: XHRResponse) => void;
};

type Headers = {
  [key: string]: any;
};

export type XHRResponse = {
  response?: string;
  error?: string | boolean | ProgressEvent;
  status?: number;
  done?: boolean;
  headers?: Headers;
  aborted?: ProgressEvent;
} | void;

export default ({ xhr, onProgress, resolve }: XHRListenerProps) => {
  xhr.upload.addEventListener('progress', event => {
    if (!onProgress) return false;
    onProgress(Math.round((event.loaded / event.total) * 100));
  });

  xhr.addEventListener('load', () => {
    let response;
    try {
      response = JSON.parse(xhr.response);
    } catch (e) {
      response = xhr.response;
    }

    let headers = xhr
      .getAllResponseHeaders()
      .trim()
      .split(/[\r\n]+/)
      .map(line => line.split(': '))
      .reduce((acc: Headers, [header, value]) => {
        acc[header] = value;
        return acc;
      }, {});

    resolve({
      response,
      error: xhr.status < 200 || xhr.status >= 300,
      status: xhr.status,
      done: true,
      headers,
    });
  });

  xhr.addEventListener('error', error => {
    resolve({ error, status: xhr.status, response: xhr.response });
  });

  xhr.addEventListener('abort', aborted => {
    resolve({ aborted });
  });
};
