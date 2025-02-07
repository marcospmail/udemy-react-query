import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

export function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  const id = 'react-query-error';
  const title =
    error instanceof Error
      ? error.toString().replace(/^Error:\s*/, '')
      : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
}

export const generateQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        onError: queryErrorHandler,
      },
      mutations: {
        onError: queryErrorHandler,
      },
    },
  });
};

//  to satisfy typescript until this file has uncommented contents
export const queryClient = generateQueryClient();
