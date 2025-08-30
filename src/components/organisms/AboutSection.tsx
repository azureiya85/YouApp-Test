'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon, User, Weight, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

import { getProfileCalculations } from '@/lib/profileUtils';
import { createOrUpdateProfile } from '@/actions/profileActionsAPI';
import { profileSchema, ProfileDTO } from '@/validations/zodProfileSchema';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import EditIconButton from '@/components/molecules/EditIconButton';

type Profile = {
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  birthday: string;
  height: number;
  weight: number;
  interests: string[];
};

type AboutSectionProps = {
  profile: Profile | null;
};

const InfoRow = ({ label, value }: { label: string; value: string | number | null }) => (
  <div className="flex justify-between items-center text-white/80">
    <span className="font-light">{label}</span>
    <span className="font-semibold">{value || '-'}</span>
  </div>
);

const EnhancedCalendar = ({ 
  selected, 
  onSelect, 
  disabled 
}: { 
  selected?: Date; 
  onSelect: (date: Date | undefined) => void; 
  disabled?: (date: Date) => boolean;
}) => {
  const [currentDate, setCurrentDate] = useState(selected || new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate year options (from 1924 to current year)
  const yearOptions = [];
  const startYear = 1924;
  const endYear = new Date().getFullYear();
  for (let year = endYear; year >= startYear; year--) {
    yearOptions.push(year);
  }

  // Month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(year));
    setCurrentDate(newDate);
  };

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(monthIndex));
    setCurrentDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-3 bg-white rounded-lg">
      {/* Year and Month Selection Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateMonth('prev')}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex gap-2">
          <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-20 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateMonth('next')}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <Calendar
        mode="single"
        selected={selected}
        onSelect={onSelect}
        month={currentDate}
        onMonthChange={setCurrentDate}
        disabled={disabled}
        className="rounded-md border-0"
      />
    </div>
  );
};

export default function AboutSection({ profile }: AboutSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isCreating = !profile;

  const { age, horoscope, zodiac, formattedBirthday } = getProfileCalculations(profile?.birthday);

  const form = useForm<ProfileDTO>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      birthday: profile?.birthday ? new Date(profile.birthday) : undefined,
      height: profile?.height || 0,
      weight: profile?.weight || 0,
      interests: profile?.interests || [],
    },
  });

  const onSubmit = (data: ProfileDTO) => {
    startTransition(async () => {
      const result = await createOrUpdateProfile(data, isCreating);
      if (result.success) {
        toast.success("Profile Saved!", { description: "Your information has been updated." });
        setIsEditing(false);
        // Force a page reload to ensure header updates
        window.location.reload();
      } else {
        toast.error("Save Failed", { description: result.error || "An unknown error occurred." });
      }
    });
  };

  if (isEditing) {
    return (
      <Card className="bg-white/5 border-white/10 backdrop-blur-lg text-white">
        <CardHeader>
          <CardTitle>Edit About</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField 
                control={form.control} 
                name="name" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="birthday" 
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birthday</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button 
                            variant={"outline"} 
                            className="pl-3 text-left font-normal text-white bg-transparent hover:bg-white/10 hover:text-white"
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <EnhancedCalendar
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="height" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="170" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />
              <FormField 
                control={form.control} 
                name="weight" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="65" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-lg text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>About</CardTitle>
        <EditIconButton onClick={() => setIsEditing(true)} />
      </CardHeader>
      <CardContent className="space-y-3">
        {!profile && <p className="text-white/60">Click the edit icon to add your details.</p>}
        {profile && (
          <>
            <InfoRow label={`Birthday (${age || 'N/A'} Years)`} value={formattedBirthday} />
            <InfoRow label="Horoscope" value={horoscope?.name || null} />
            <InfoRow label="Zodiac" value={zodiac?.name || null} />
            <InfoRow label="Height" value={`${profile.height || '-'} cm`} />
            <InfoRow label="Weight" value={`${profile.weight || '-'} kg`} />
          </>
        )}
      </CardContent>
    </Card>
  );
}