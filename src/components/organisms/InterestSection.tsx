'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';
import { createOrUpdateProfile } from '@/actions/profileActionsAPI';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditIconButton from '@/components/molecules/EditIconButton';

type Profile = {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
};

type InterestsSectionProps = {
  profile: Profile | null;
};

export default function InterestsSection({ profile }: InterestsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isCreating = !profile;

  // State for managing interests in edit mode
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [currentInterest, setCurrentInterest] = useState('');

  const handleAddInterest = () => {
    if (currentInterest && !interests.includes(currentInterest)) {
      setInterests([...interests, currentInterest]);
      setCurrentInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };
  
  const handleSave = () => {
    if (!profile && interests.length > 0) {
        toast.error("Please fill out the 'About' section first before saving interests.");
        return;
    }
      
    startTransition(async () => {
     if (!profile?.name || !profile?.birthday) { 
    toast.error("Please complete your profile information first (name and birthday are required).");
    return;
  }

      const payload = {
        name: profile.name,
        birthday: new Date(profile.birthday),
        height: profile.height || 0,
        weight: profile.weight || 0,
        interests: interests, 
      };

      const result = await createOrUpdateProfile(payload, isCreating);
      if (result.success) {
        toast.success("Interests Saved!");
        setIsEditing(false);
        window.location.reload();
      } else {
        toast.error("Save Failed", { description: result.error || "An unknown error occurred." });
      }
    });
  };

  if (isEditing) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg text-white">
        <CardHeader><CardTitle>Edit Interests</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add an interest..."
              value={currentInterest}
              onChange={(e) => setCurrentInterest(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
            />
            <Button onClick={handleAddInterest} size="icon"><Plus className="h-4 w-4"/></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 text-base">
                {interest}
                <button onClick={() => handleRemoveInterest(interest)} className="ml-2 rounded-full hover:bg-black/20 p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
           <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
              </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Interests</CardTitle>
        <EditIconButton onClick={() => setIsEditing(true)} />
      </CardHeader>
      <CardContent>
        {profile?.interests && profile.interests.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 text-base">
                {interest}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-white/60">Add your interests by clicking the edit icon.</p>
        )}
      </CardContent>
    </Card>
  );
}