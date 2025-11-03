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
}

export interface MentorCardProps {
  id: number;
  image: string;
  name: string;
  careers: string[];
  tags: string[];
  workingperiod: number;
  status: 'active' | 'done';
}
