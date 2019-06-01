import { useState, useEffect, useContext } from 'react';
import { UploadContext } from './provider';

const handleUpload = async ({ files, client, options, setState }) => {
  setState({ loading: true });

  let response = await client({
    files,
    ...options,
    onProgress: progress => setState({ progress }),
  });

  setState({
    loading: false,
    response,
    done: response.done,
    error: response.error ? response.response : false,
  });
};

export const useUpload = (files, options) => {
  let [state, setState] = useState({});
  let client = useContext(UploadContext);

  useEffect(() => {
    if (!files) return;
    setState({});
    handleUpload({
      files,
      client,
      options,
      setState: newState => setState(state => ({ ...state, ...newState })),
    });
  }, [files]);

  return state;
};
