import request from './request';
import { XHRResponse } from './listeners';
import { dispatchType, SET_ERROR } from '../../upload-reducer';

export type XHRClientProps = {
  dispatch: dispatchType;
  onProgress: (progress: number) => void;
  files: FileList | File;
  options: XHROptions;
};

export type XHRClient = (args: XHRClientProps) => Promise<XHRResponse>;

export type XHRSetupOptions = {
  baseUrl?: string;
  modifyRequest?: (request: XHROptions) => XHROptions;
};

export type XHROptions = {
  name?: string;
  fields?: Fields;
  headers?: Headers;
  path?: string;
  withCredentials?: boolean;
  getUrl?: (files: FileList | File) => string;
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
};

type Headers = {
  [key: string]: any;
};

type Fields = {
  [key: string]: any;
};

export const createXhrClient = ({
  baseUrl,
  modifyRequest,
}: XHRSetupOptions) => async ({
  dispatch,
  onProgress,
  files,
  options,
}: XHRClientProps): Promise<XHRResponse> => {
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
    options: modifiedOptions,
    url,
    files,
    onProgress,
  });
};
