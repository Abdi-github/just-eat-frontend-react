import { HeroSearch } from "../components/HeroSearch";
import { PopularCuisines } from "../components/PopularCuisines";
import { TopRestaurants } from "../components/TopRestaurants";
import { HowItWorks } from "../components/HowItWorks";
import { AppPromotion } from "../components/AppPromotion";

export function HomePage() {
  return (
    <>
      <HeroSearch />
      <PopularCuisines />
      <TopRestaurants />
      <HowItWorks />
      <AppPromotion />
    </>
  );
}
