export const SET_ERROR = 'SET_ERROR';
export const START_UPLOADING = 'START_UPLOADING';
export const SET_UPLOAD_PROGRESS = 'SET_UPLOAD_PROGRESS';
export const FINISH_UPLOADING = 'FINISH_UPLOADING';
export const RESET = 'RESET';

export type UploadState = {
  loading: boolean;
  progress: number;
  error: string | null;
  done: boolean;
  response?: any;
};

export const initialState: UploadState = {
  loading: false,
  progress: 0,
  error: null,
  done: false,
  response: null
};

export type Action =
  | { type: 'START_UPLOADING' }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'FINISH_UPLOADING'; payload: any }
  | { type: 'RESET'; };

export type dispatchType = (action: Action) => void;

// The possible state changes that take place during a file upload
export function reducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case START_UPLOADING:
      return { ...initialState, loading: true };
    case SET_UPLOAD_PROGRESS:
      return { ...state, progress: action.payload };
    case SET_ERROR:
      return { ...state, loading: false, error: action.payload, done: true };
    case FINISH_UPLOADING:
      return {
        ...state,
        done: true,
        loading: false,
        response: action.payload,
        error: action.payload.error ? action.payload.response : false,
      };
    case RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
}
