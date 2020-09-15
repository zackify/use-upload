import React, { ReactNode } from 'react';
import { XHRClient } from './clients/xhr';
import { GraphQLClient } from './clients/graphql';

type Props = {
  client: XHRClient | GraphQLClient | null;
  children: ReactNode;
};

export const UploadContext = React.createContext<XHRClient | GraphQLClient | null>(null);

export const UploadProvider = ({ client, children }: Props) => (
  <UploadContext.Provider value={client}>{children}</UploadContext.Provider>
);
