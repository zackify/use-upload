import React, { ReactNode } from 'react';
import { XHRClient } from './clients/xhr';

type Props = {
  client: XHRClient | null;
  children: ReactNode;
};

export const UploadContext = React.createContext<XHRClient | null>(null);

export const UploadProvider = ({ client, children }: Props) => (
  <UploadContext.Provider value={client}>{children}</UploadContext.Provider>
);
