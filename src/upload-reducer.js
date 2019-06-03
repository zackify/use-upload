export const SET_ERROR = 'SET_ERROR';
export const START_UPLOADING = 'START_UPLOADING';
export const SET_UPLOAD_PROGRESS = 'SET_UPLOAD_PROGRESS';
export const FINISH_UPLOADING = 'FINISH_UPLOADING';

// The possible state changes that take place during a file upload
export function reducer(state, action) {
  switch (action.type) {
    case START_UPLOADING:
      return { loading: true };
    case SET_UPLOAD_PROGRESS:
      return { ...state, progress: action.payload };
    case SET_ERROR:
      return { loading: false, error: action.payload, done: true };
    case FINISH_UPLOADING:
      return {
        done: true,
        loading: false,
        response: action.payload,
        error: action.payload.error ? action.payload.response : false,
      };
    default:
      return state;
  }
}
