import { useState } from "react";
import {
  BeforeRequest,
  UseUploadResults,
  UseUploadState,
} from "./library/types";
import { useUploadCreator } from "./library/use-upload";

export const useUpload = (
  beforeRequest: BeforeRequest
): UseUploadResults<UseUploadState<Response>> => {
  const [state, setState] = useState<UseUploadState<Response>>({
    loading: false,
    done: false,
  });

  const upload = useUploadCreator({
    beforeRequest,
    setState,
    updateState: setState,
  });

  return [upload, state];
};
