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
