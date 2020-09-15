import request from "./request";
import { XHRResponse } from "./listeners";
import { dispatchType, SET_ERROR } from "../../upload-reducer";
import { FileOrFileList } from "../../";

export type XHRClientProps = {
  dispatch: dispatchType;
  onProgress: (progress: number) => void;
  files: FileOrFileList;
  options: any;
};

export type XHRClient = (args: XHRClientProps) => Promise<XHRResponse>;

export type XHRSetupOptions = {
  baseUrl?: string;
  modifyRequest?: (request: XHROptions) => XHROptions;
};

export type GetUrlResponse =
  | string
  | { fields?: Fields; url: string; headers?: Headers };

export type XHROptions = {
  name?: string;
  fields?: Fields;
  headers?: Headers;
  path?: string;
  withCredentials?: boolean;
  getUrl?: (files: FileOrFileList) => GetUrlResponse | Promise<GetUrlResponse>;
  method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
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
  let url = `${baseUrl || ""}${options.path || ""}`;

  //Get the url using a promise, for signed uploads
  // this has grown out of control... i need to refactor this library since it was my first time really using TS
  // and i had taken old upload code
  if (modifiedOptions.getUrl) {
    try {
      let response = await modifiedOptions.getUrl(files);
      if (typeof response === "string") url = response;
      else {
        url = response.url;
        if (response.headers)
          modifiedOptions = { ...modifiedOptions, headers: response.headers };
        if (response.fields)
          modifiedOptions = { ...modifiedOptions, fields: response.fields };
      }
    } catch (error) {
      console.error(error);
      // If there was a problem, set an error
      return dispatch({
        type: SET_ERROR,
        payload: "Error getting async upload url",
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
