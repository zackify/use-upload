import listeners from './listeners';
import { XHROptions } from './index';
import { XHRResponse } from './listeners';

type Props = {
  options: XHROptions;
  url: string;
  files: FileList | File;
  onProgress: (progress: number) => void;
};

export default ({
  url,
  files,
  options,
  onProgress,
}: Props): Promise<XHRResponse> =>
  new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    listeners({ xhr, resolve, onProgress });

    xhr.open(options.method || 'POST', url);
    xhr.withCredentials = options.withCredentials || false;

    if (options.headers) {
      let headers = options.headers;
      Object.keys(options.headers).forEach(header =>
        xhr.setRequestHeader(header, headers[header]),
      );
    }

    //send just the files if no fields or filename is set
    if (!options.name && !options.fields) return xhr.send(files as Blob);

    var formData = new FormData();

    //append fields first, fixes https://github.com/expressjs/multer/issues/322
    if (options.fields) {
      let fields = options.fields;
      Object.keys(options.fields).forEach(field =>
        formData.append(field, fields[field]),
      );
    }

    if (files instanceof File) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error(
          'You passed a single File to react-use-upload, please remove the `name` key in options, or pass a FileList',
        );
      }
      return false;
    }

    Array.from(files).forEach(file =>
      formData.append(options.name || 'file', file),
    );

    xhr.send(formData);
  });
