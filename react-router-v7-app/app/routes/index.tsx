import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "React Router v7 Sample App" },
  ];
}

export default function Home() {
  return <div>Welcome!</div>;
}
