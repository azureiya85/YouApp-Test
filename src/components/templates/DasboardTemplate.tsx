import AboutSection from "@/components/organisms/AboutSection";
import InterestsSection from "@/components/organisms/InterestSection";
import ProfileHeader from "@/components/organisms/ProfileHeader";
import Link from 'next/link';
import { MessageCircle, TestTube } from 'lucide-react';

type Profile = {
  username: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
};``

type DashboardTemplateProps = {
  profile: Profile | null;
};

export default function DashboardTemplate({ profile }: DashboardTemplateProps) {
  return (
    <main className="min-h-screen w-full bg-primary-900 p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <ProfileHeader profile={profile} />
          {profile && (
          <Link
            href={`/chat/${profile.username}`}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-500 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Start A Conversation</span>
          </Link>
        )}
         <Link
            href="/chat-testing"
            className="w-full flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          >
            <TestTube className="h-5 w-5" />
            <span>Test Conversation</span>
          </Link>
        <AboutSection profile={profile} />
        <InterestsSection profile={profile} />
      </div>
    </main>
  );
}