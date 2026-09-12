import { ArrowRight, ChefHat } from "lucide-react";
import { toast } from "sonner";
import type { RestaurantProfile as RestaurantProfileType } from "@/api-services/restaurantProfile";

const fallbackGallery = [
  "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b",
  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
];

const getRandomImage = (images: string[]): string =>
  images[Math.floor(Math.random() * images.length)];

const sloganList = [
  "Fresh Meals, Great Vibes",
  "Where Every Bite Feels Like Home",
  "Taste the Difference",
  "Good Food. Good Mood.",
  "Savor the Flavor",
  "Crafted With Love, Served With Passion",
  "Your Daily Dose of Delicious",
  "Great Taste, Every Time",
  "A Feast for Your Senses",
  "Made Fresh, Made For You",
  "Tasty Moments Await",
  "Food That Warms the Soul",
  "Flavors You’ll Always Remember",
  "Where Hunger Meets Happiness",
  "Bringing People Together Through Food",
  "Comfort Food, Elevated",
  "Cooked Right. Served Right.",
  "A Place for Food Lovers",
  "Where Quality Meets Taste",
  "Your Favorite Spot in Town",
];

const randomPickedSlogan =
  sloganList[Math.floor(Math.random() * sloganList.length)];
const randomFallbackImage = getRandomImage(fallbackGallery);

interface RestaurantProfileProps {
  restaurant: RestaurantProfileType;
  onBrowseMenu: () => void;
}

/** Editorial restaurant profile block shown once a table/restaurant is selected. */
export function RestaurantProfile({
  restaurant,
  onBrowseMenu,
}: RestaurantProfileProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-1000">
      {/* Cover Image - Architectural Frame */}
      <div className="group relative overflow-hidden rounded-[3rem] shadow-2xl shadow-black/5">
        <img
          src={restaurant.cover_image_url || randomFallbackImage}
          alt={`${restaurant.name} cover`}
          className="h-[400px] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      {/* Heading & Slogan */}
      <div className="space-y-3 px-2">
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold tracking-[0.3em] text-blue-500 uppercase">
            Welcome to
          </span>
          <div className="h-px w-12 bg-blue-100" />
        </div>
        <h3 className="text-4xl font-extrabold tracking-[-0.05em] text-gray-900 lg:text-5xl">
          {restaurant.name}
        </h3>
        <p className="text-[17px] leading-relaxed font-medium text-gray-400 italic">
          {restaurant.slogan || randomPickedSlogan}
        </p>
      </div>

      {/* Browse Menu */}
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={onBrowseMenu}
          className="flex h-16 items-center justify-between rounded-3xl bg-black px-8 text-[15px] font-bold tracking-tight text-white shadow-2xl shadow-black/20 transition-all hover:bg-gray-800 active:scale-[0.98]"
        >
          <span>Browse the Menu</span>
          <ArrowRight className="h-5 w-5 opacity-50" />
        </button>

        <button
          onClick={() => toast.info("A waiter has been notified!")}
          className="hidden h-16 items-center justify-between rounded-3xl border border-gray-100 bg-white px-8 text-[15px] font-bold tracking-tight text-gray-900 transition-all hover:bg-gray-50 active:scale-[0.98]"
        >
          <span>Request Service</span>
          <ChefHat className="h-5 w-5 text-gray-300" />
        </button>
      </div>
    </div>
  );
}
