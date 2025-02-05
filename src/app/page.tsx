import RecipeReviewCard from "./components/live-trips";
import SeachBar from "./components/searchbar";


export default function Home() {
  return (
    <div>
      <SeachBar />
      <div className="flex justify-center w-full border">
      <RecipeReviewCard />
      </div>
    </div>
  );
}
