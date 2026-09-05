export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  contactHref: string;
};

export type TeamCardProps = {
  member: TeamMember;
  isOrphan?: boolean;
};

export type TeamListProps = {
  members: TeamMember[];
};
