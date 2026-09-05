/** `key` resolves against the `team.members` message namespace. */
export type TeamMember = {
  key: string;
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
