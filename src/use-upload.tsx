import { useReducer, useEffect, useContext } from 'react';
import { UploadContext } from './provider';
import {
  reducer,
  UploadState,
  START_UPLOADING,
  SET_UPLOAD_PROGRESS,
  FINISH_UPLOADING,
  dispatchType,
  initialState,
  CLEAR_STATE,
} from './upload-reducer';
import { XHRClient, XHROptions, createXhrClient } from './clients/xhr';
import { FileOrFileList } from './';
import { GraphQLClient, GraphQLOptions } from 'clients/graphql';

type HookProps = {
  files: File | FileList;
  client: XHRClient | GraphQLClient | null;
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
    onProgress: (progress: number) =>
      dispatch({ type: SET_UPLOAD_PROGRESS, payload: progress }),
  });
  if (response) dispatch({ type: FINISH_UPLOADING, payload: response });
};

type UseUploadResult = UploadState & {
  reset: () => void
}

export const useUpload = (
  files: FileOrFileList,
  options: XHROptions | GraphQLOptions,
): UseUploadResult => {
  let client = useContext<XHRClient | GraphQLClient | null>(UploadContext);
  const [state, dispatch] = useReducer(reducer, initialState);
  const resetState = () => dispatch({ type: CLEAR_STATE });

  useEffect(() => {
    if (!files) return;
    handleUpload({
      files,
      client,
      options,
      dispatch,
    });
  }, [files]);

  return {
    ...state,
    reset: resetState
  };
};
