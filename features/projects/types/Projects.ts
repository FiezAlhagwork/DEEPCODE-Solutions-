export type Project = {
  id: number;
  title: string;
  year: string;
  tags: string[];
  image: string;
  color: string;
  link: string;
};

export type ProjectCardProps = {
  project: Project;
};

export type ProjectListProps = {
  projects: Project[];
};
