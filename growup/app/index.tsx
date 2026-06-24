import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { session, isInitialized } = useAuthStore();
  if (!isInitialized) return null;
  return <Redirect href={session ? '/(tabs)/program' : '/(auth)/login'} replace />;
}
