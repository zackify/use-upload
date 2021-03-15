import { Writable, writable } from "svelte/store";
import {
  BeforeRequest,
  UseUploadResults,
  UseUploadState,
} from "./library/types";
import { useUploadCreator } from "./library/use-upload";

export const useUpload = (
  beforeRequest: BeforeRequest
): UseUploadResults<Writable<UseUploadState<Response>>> => {
  const state = writable<UseUploadState<Response>>({
    loading: false,
    done: false,
  });

  const upload = useUploadCreator({
    beforeRequest,
    setState: state.set,
    updateState: state.update,
  });

  return [upload, state];
};
