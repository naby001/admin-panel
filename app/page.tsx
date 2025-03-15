import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Redirect to dashboard if authenticated
  if (session) {
    redirect('/dashboard');
  } else {
    // Redirect to login if not authenticated
    redirect('/auth/signin');
  }
}
