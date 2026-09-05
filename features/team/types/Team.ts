import type { Messages } from "next-intl";

/** `key` resolves against the `team.members` message namespace. */
export type TeamMember = {
  key: keyof Messages["team"]["members"];
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
