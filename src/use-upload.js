import { useReducer, useEffect, useContext } from 'react';
import { UploadContext } from './provider';
import {
  reducer,
  START_UPLOADING,
  SET_UPLOAD_PROGRESS,
  FINISH_UPLOADING,
} from './upload-reducer';
import { createXhrClient } from './clients/xhr';

const handleUpload = async ({ files, client, options, dispatch }) => {
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

export const useUpload = (files, options) => {
  let client = useContext(UploadContext);
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
