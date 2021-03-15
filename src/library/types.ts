export type Headers = {
  [key: string]: any;
};

export type RequestOptions = {
  method: string;
  url: string;
  headers?: Headers;
  body: Document | BodyInit | null | undefined;
};

type BeforeRequestProps = {
  xhr: XMLHttpRequest;
  files: FileList;
};
export type BeforeRequest = (
  props: BeforeRequestProps
) => Promise<RequestOptions | undefined> | RequestOptions | undefined;

export type UploadProps = {
  files: FileList;
};

export type UseUploadState<Response> = {
  loading: boolean;
  done: boolean;

  data?: Response;
  error?: ProgressEvent;
  xhr?: XMLHttpRequest;
  responseHeaders?: Headers;
  progress?: number;
};

export type UploadFunction = (data: UploadProps) => any;

export type UseUploadResults<State> = [UploadFunction, State];
