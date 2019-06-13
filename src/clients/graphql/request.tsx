import listeners from '../xhr/listeners';
import { RequestOptions } from './index';
import { XHRResponse } from '../xhr/listeners';

type Props = {
  options: RequestOptions;
  url: string;
  onProgress: (progress: number) => void;
  body: FormData;
};

export default ({
  url,
  options,
  onProgress,
  body,
}: Props): Promise<XHRResponse> =>
  new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    listeners({ xhr, resolve, onProgress });

    xhr.open('POST', url);
    xhr.withCredentials = options.withCredentials || false;

    if (options.headers) {
      let headers = options.headers;
      Object.keys(options.headers).forEach(header =>
        xhr.setRequestHeader(header, headers[header]),
      );
    }
    return xhr.send(body);
  });
