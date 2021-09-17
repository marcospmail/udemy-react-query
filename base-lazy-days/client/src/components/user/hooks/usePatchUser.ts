import { useCustomToast } from 'components/app/hooks/useCustomToast';
import jsonpatch from 'fast-json-patch';
import { QueryClientProvider, useMutation, useQueryClient } from 'react-query';
import { queryKeys } from 'react-query/constants';

import type { User } from '../../../../../shared/types';
import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { useUser } from './useUser';

// for when we need a server function
async function patchUserOnServer(
  newData: User | null,
  originalData: User | null,
): Promise<User | null> {
  if (!newData || !originalData) return null;
  // create a patch for the difference between newData and originalData
  const patch = jsonpatch.compare(originalData, newData);

  // send patched data to the server
  const { data } = await axiosInstance.patch(
    `/user/${originalData.id}`,
    { patch },
    {
      headers: getJWTHeader(originalData),
    },
  );
  return data.user;
}

// TODO: update type to UseMutateFunction type
export function usePatchUser(): (newData: User | null) => void {
  const { user, updateUser } = useUser();
  const toast = useCustomToast();

  const queryClient = useQueryClient();

  const { mutate: patchUserMutation } = useMutation(
    (newUser: User) => patchUserOnServer(newUser, user),
    {
      onMutate: (newUser: User | null) => {
        queryClient.cancelQueries(queryKeys.user);

        const previousUserValue = queryClient.getQueryData(queryKeys.user);

        updateUser(newUser);

        return { previousUserValue };
      },
      onError: (err, newData, context) => {
        if (context.previousUserValue) {
          updateUser(context.previousUserValue as User);
          toast({
            title: 'Updated failed, returning to previous value',
            status: 'warning',
          });
        }
      },
      onSuccess: (newUser: User | null) => {
        if (!newUser) return;

        toast({
          title: 'User update!',
          status: 'success',
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.user);
      },
    },
  );

  return patchUserMutation;
}
