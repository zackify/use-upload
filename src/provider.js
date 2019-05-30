import React from 'react';

export const UploadContext = React.createContext();

export const UploadProvider = ({ client, children }) => (
  <UploadContext.Provider value={client}>{children}</UploadContext.Provider>
);
