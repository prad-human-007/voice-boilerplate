import { Hero } from "@/components/home/hero";

export default async function Home() {
  return (
    <div className="flex flex-col items-center justify-between w-full ">
      <Hero/>
    </div>
  );
}
