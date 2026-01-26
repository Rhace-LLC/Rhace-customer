import React from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RestaurantProfile } from "@/api-services/restaurantProfile";

const fallBackImg = [
  "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=889&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const getRandomImage = (images: string[]): string => {
  return images[Math.floor(Math.random() * images.length)];
};

interface RestaurantCardProps {
  restaurant: RestaurantProfile;
  onRestaurantView: (restaurant: RestaurantProfile) => void;
}
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

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onRestaurantView,
}) => {
  const rating = restaurant.avg_rating ?? 0;

  const randomPickedSlogan =
    sloganList[Math.floor(Math.random() * sloganList.length)];

  const randomFallbackImage = getRandomImage(fallBackImg);

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-3 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] ease-out">
      {/* IMAGE ARCHITECTURE */}
      <div className="relative h-52 w-full overflow-hidden rounded-[1.5rem] bg-gray-100">
        <img
          src={restaurant.cover_image_url || randomFallbackImage}
          alt={restaurant.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* FLOATING RATING BADGE */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-md shadow-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-[13px] font-bold text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="flex flex-col px-2 py-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-[20px] font-extrabold tracking-tight text-gray-900 leading-tight">
              {restaurant.name}
            </h2>
            <div className="h-1 w-1 rounded-full bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          
          <p className="text-[14px] font-medium italic text-gray-400 line-clamp-1">
            {restaurant.slogan ?? randomPickedSlogan}
          </p>
        </div>

        {/* METADATA */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-gray-200" />
          <p className="text-[13px] font-bold uppercase tracking-wider text-gray-400">
            {restaurant.city}, {restaurant.state}
          </p>
        </div>

        {/* PRIMARY ACTION */}
        <Button
          onClick={() => onRestaurantView(restaurant)}
          className="mt-6 h-14 w-full rounded-2xl bg-black text-[15px] font-bold tracking-tight text-white transition-all hover:bg-gray-800 active:scale-[0.97]"
        >
          View Restaurant
        </Button>
      </div>
    </div>
  );
};

export default RestaurantCard;
