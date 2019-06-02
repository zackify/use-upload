import { useReducer, useEffect, useContext } from 'react';
import { UploadContext } from './provider';
import {
  reducer,
  START_UPLOADING,
  SET_UPLOAD_PROGRESS,
  FINISH_UPLOADING,
} from './upload-reducer';

const handleUpload = async ({ files, client, options, dispatch }) => {
  dispatch({ type: START_UPLOADING });

  let response = await client({
    files,
    ...options,
    onProgress: progress =>
      dispatch({ type: SET_UPLOAD_PROGRESS, payload: progress }),
  });

  dispatch({ type: FINISH_UPLOADING, payload: response });
};

export const useUpload = (files, options) => {
  const [state, dispatch] = useReducer(reducer, {});

  let client = useContext(UploadContext);

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
