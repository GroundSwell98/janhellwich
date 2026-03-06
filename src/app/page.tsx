import ScrollExperience from "@/components/ScrollExperience";
import PlyrPreload from "@/components/PlyrPreload";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <PlyrPreload />
      <ScrollExperience />
    </div>
  );
}
