import AboutSection from "@/components/organisms/AboutSection";
import InterestsSection from "@/components/organisms/InterestSection";
import ProfileHeader from "@/components/organisms/ProfileHeader";

type Profile = {
  username: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
};

type DashboardTemplateProps = {
  profile: Profile | null;
};

export default function DashboardTemplate({ profile }: DashboardTemplateProps) {
  return (
    <main className="min-h-screen w-full bg-primary-900 p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        <ProfileHeader profile={profile} />
        <AboutSection profile={profile} />
        <InterestsSection profile={profile} />
      </div>
    </main>
  );
}