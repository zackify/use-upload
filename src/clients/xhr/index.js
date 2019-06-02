import request from './request';
import { SET_ERROR } from '../../upload-reducer';

export const createXhrClient = ({ baseUrl, modifyRequest }) => async ({
  dispatch,
  onProgress,
  files,
  ...options
}) => {
  let modifiedOptions = modifyRequest ? modifyRequest(options) : options;
  let url = `${baseUrl}${options.path || ''}`;

  //Get the url using a promise, for signed uploads
  if (modifiedOptions.getUrl) {
    try {
      url = await modifiedOptions.getUrl(files);
    } catch (error) {
      console.error(error);
      // If there was a problem, set an error
      return dispatch({
        type: SET_ERROR,
        payload: 'Error getting async upload url',
      });
    }
  }

  return request({
    request: {
      ...modifiedOptions,
      url,
      files,
    },
    onProgress,
  });
};
