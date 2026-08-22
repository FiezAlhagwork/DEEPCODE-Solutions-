export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  contactHref: string;
}

export interface TeamCardProps {
  member: TeamMember;
  isOrphan?: boolean;
}

export interface TeamListProps {
  members: TeamMember[];
}
