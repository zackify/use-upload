import listeners from './listeners';

export default ({ request, files, onProgress, body }) =>
  new Promise(resolve => {
    const xhr = new XMLHttpRequest();

    listeners({ xhr, resolve, onProgress });

    xhr.open(request.method || 'POST', request.url);
    xhr.withCredentials = request.withCredentials || false;

    if (request.headers) {
      Object.keys(request.headers).forEach(header =>
        xhr.setRequestHeader(header, request.headers[header]),
      );
    }
    if (body) return xhr.send(body);

    //send just the file if no fields or filename is set
    if (!request.name && !request.fields) return xhr.send(files[0]);

    var formData = new FormData();

    //append fields first, fixes https://github.com/expressjs/multer/issues/322
    if (request.fields) {
      Object.keys(request.fields).forEach(field =>
        formData.append(field, request.fields[field]),
      );
    }

    Array.from(files).forEach(file =>
      formData.append(request.name || 'file', file),
    );

    xhr.send(formData);
  });
