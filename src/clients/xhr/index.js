import request from './request';

export const createXhrClient = ({ baseUrl, modifyRequest }) => async ({
  onProgress,
  files,
  ...options
}) => {
  let modifiedOptions = modifyRequest ? modifyRequest(options) : options;
  let url = `${baseUrl}${options.path || ''}`;

  //Get the url using a promise, for signed uploads
  if (modifiedOptions.getUrl) {
    url = await modifiedOptions.getUrl(files);
  }

  return request({
    files,
    onProgress,
    request: {
      ...modifiedOptions,
      url,
    },
  });
};
