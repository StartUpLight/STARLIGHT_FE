import { getExpertResponse } from './expert.type';
import { mappingKorea, TabLabel } from './label';

export interface MentorProps {
  id: number;
  name: string;
  image?: string;
  careers: string[];
  button: string;
  status: 'active' | 'done';
  tags: string[];
  categories: string[];
  workingperiod: number;
  oneLineIntroduction: string;
}

export interface MentorCardProps {
  id: number;
  image: string;
  name: string;
  careers: {
    orderIndex: number;
    careerTitle: string;
  }[];
  oneLineIntroduction: string;
  tags: string[];
  workingperiod: number;
  status: 'active' | 'done';
}

export const adaptMentor = (e: getExpertResponse) => ({
  id: e.id,
  image: e.profileImageUrl,
  name: e.name,
  careers: e.careers ?? [],
  tags: e.tags ?? [],
  categories: (e.categories ?? [])
    .map(mappingKorea)
    .filter(Boolean) as TabLabel[],
  workingperiod: e.workedPeriod,
  oneLineIntroduction: e.oneLineIntroduction,
});
