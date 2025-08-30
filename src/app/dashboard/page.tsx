import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getProfile } from "@/actions/profileActionsAPI";
import DashboardTemplate from "@/components/templates/DasboardTemplate";

export default async function DashboardPage() {
  // 1. Check for auth token before doing anything
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    redirect('/'); // Redirect to login page if not authenticated
  }

  // 2. Fetch the profile data on the server
  const profile = await getProfile();

  // 3. Render the template with the fetched data
  return <DashboardTemplate profile={profile} />;
}