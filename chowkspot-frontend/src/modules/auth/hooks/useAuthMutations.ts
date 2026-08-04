import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import type { LoginInput, RegisterInput } from '@/types';

export const useAuthMutations = () => {
  const { login, register, logout } = useAuth();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginInput) => login(credentials),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => register(data),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
};
