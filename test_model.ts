export interface Root {
  id: number;
  name: string;
  children: Child[];
}

export interface Child {
  id: number;
  name: string;
  value?: string;
  children: Child[];
}
