import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import Image from "next/image";

export default async function Home() {
  const session = await getSession();
  
  // Redirect to dashboard if authenticated
  if (session) {
    redirect('/dashboard');
  } else {
    // Redirect to login if not authenticated
    redirect('/auth/signin');
  }
}
