import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/authOptions';
import DashboardLayoutWrapper from '../../components/DashboardLayoutWrapper';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    redirect('/auth/signin');
  }

  // Redirect if not an admin
  if (session.user.role !== 'admin' && process.env.NODE_ENV !== 'development') {
    redirect('/auth/signin?error=AccessDenied');
  }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
} 