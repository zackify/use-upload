import request from './request';

export const createXhrClient = ({ baseUrl, modifyRequest }) => ({
  onProgress,
  files,
  ...options
}) => {
  let modifiedOptions = modifyRequest(options);

  return request({
    files,
    onProgress,
    request: {
      ...modifiedOptions,
      url: `${baseUrl}${options.path || ''}`,
    },
  });
};
