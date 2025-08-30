import { format, differenceInYears, getYear, getMonth, getDate } from 'date-fns';
import { horoscopes, Horoscope } from '@/components/data/Horoscopes';
import { zodiacs, Zodiac } from '@/components/data/Zodiacs';

export function getProfileCalculations(birthdayString?: string | null) {
  if (!birthdayString) {
    return {
      age: null,
      horoscope: null,
      zodiac: null,
      formattedBirthday: null,
    };
  }

  const birthday = new Date(birthdayString);
  if (isNaN(birthday.getTime())) {
     return { age: null, horoscope: null, zodiac: null, formattedBirthday: null };
  }

  // Calculate Age
  const age = differenceInYears(new Date(), birthday);

  // Calculate Horoscope
  const month = getMonth(birthday) + 1; // date-fns is 0-indexed
  const day = getDate(birthday);
  
  let horoscope = horoscopes.find(h => {
    if (month === h.startMonth && day >= h.startDay) return true;
    if (month === h.endMonth && day <= h.endDay) return true;
    if (h.name === 'Capricorn' && (month === 12 || month === 1)) return true;
    return false;
  }) || { name: 'Unknown', Icon: () => null };

  // Calculate Zodiac
  const birthYear = getYear(birthday);
  const zodiac = zodiacs[(birthYear - 1900) % 12] || { name: 'Unknown', Icon: () => null };

  return {
    age,
    horoscope,
    zodiac,
    formattedBirthday: format(birthday, 'dd / MM / yyyy'),
  };
}