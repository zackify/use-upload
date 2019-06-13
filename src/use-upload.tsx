import { useReducer, useEffect, useContext } from 'react';
import { UploadContext } from './provider';
import {
  reducer,
  START_UPLOADING,
  SET_UPLOAD_PROGRESS,
  FINISH_UPLOADING,
  dispatchType,
} from './upload-reducer';
import { XHRClient, XHROptions, createXhrClient } from './clients/xhr';

type HookProps = {
  files: FileList | File;
  client: XHRClient | null;
  options: XHROptions;
  dispatch: dispatchType;
};

const handleUpload = async ({
  files,
  client,
  options,
  dispatch,
}: HookProps) => {
  dispatch({ type: START_UPLOADING });

  //default to XHR client if there is no provider
  if (!client) client = createXhrClient({});

  let response = await client({
    files,
    options,
    dispatch,
    onProgress: progress =>
      dispatch({ type: SET_UPLOAD_PROGRESS, payload: progress }),
  });
  if (response) dispatch({ type: FINISH_UPLOADING, payload: response });
};

export const useUpload = (files: FileList | File, options: XHROptions) => {
  let client = useContext<XHRClient | null>(UploadContext);
  const [state, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    if (!files) return;
    handleUpload({
      files,
      client,
      options,
      dispatch,
    });
  }, [files]);

  return state;
};
