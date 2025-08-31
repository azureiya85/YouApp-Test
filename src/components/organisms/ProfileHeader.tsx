import Image from 'next/image';
import InfoBadge from '@/components/molecules/InfoBadge';
import { getProfileCalculations } from '@/lib/profileUtils';

type Profile = {
  username: string;
  name: string;
  gender: string;
  birthday: string;
  // ... any other fields
};

type ProfileHeaderProps = {
  profile: Profile | null;
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { horoscope, zodiac } = getProfileCalculations(profile?.birthday);
  
  const displayName = profile?.name || 'Your Name';

  return (
    <div className="relative w-full h-[25vh] bg-gradient-to-br from-neutral-700 to-neutral-900 rounded-xl overflow-hidden">
      <Image
        src="/placeholder-bg.jpg" // Placeholder background image
        alt="Profile background"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute bottom-4 left-4 text-white">
        <h2 className="text-2xl font-bold">
          {displayName} <span className="font-normal text-white/80">(@{profile?.username || 'username'})</span>
        </h2>
        <div className="mt-2 flex items-center gap-2">
          {horoscope?.name && <InfoBadge icon={<horoscope.Icon />} text={horoscope.name} />}
          {zodiac?.name && <InfoBadge icon={<zodiac.Icon />} text={zodiac.name} />}
        </div>
      </div>
    </div>
  );
}