import { useReducer, useEffect, useContext } from 'react';
import { UploadContext } from './provider';
import {
  reducer,
  UploadState,
  START_UPLOADING,
  SET_UPLOAD_PROGRESS,
  FINISH_UPLOADING,
  dispatchType,
} from './upload-reducer';
import { XHRClient, XHROptions, createXhrClient } from './clients/xhr';
<<<<<<< HEAD
import { FileOrFileList } from './';
import { GraphQLOptions } from 'clients/graphql';
=======
import { FileOrFileList } from './index';
>>>>>>> Fix type

type HookProps = {
  files: File | FileList;
  client: XHRClient | null;
  options: XHROptions | GraphQLOptions;
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

export const useUpload = (
  files: FileOrFileList,
  options: XHROptions | GraphQLOptions,
): UploadState => {
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
