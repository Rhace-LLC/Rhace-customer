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

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onRestaurantView }) => {
  const rating = restaurant.avg_rating ?? 0;

  const randomPickedSlogan =
    sloganList[Math.floor(Math.random() * sloganList.length)];

  const randomFallbackImage = getRandomImage(fallBackImg);

  return (
    <div className="rounded-2xl bg-white shadow-sm p-4 w-full max-w-sm">
      {/* Cover Image */}
      <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100">
        {restaurant.cover_image_url ? (
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={randomFallbackImage}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Name & Slogan */}
      <div className="mt-4">
        <h2 className="text-lg font-bold text-gray-900">{restaurant.name}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {restaurant.slogan ?? randomPickedSlogan}
        </p>
      </div>

      {/* Location */}
      <p className="text-sm text-gray-600 mt-2">
        {restaurant.city}, {restaurant.state}, {restaurant.country}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-3 text-yellow-500">
        <Star className="h-4 w-4 fill-yellow-500" />
        <span className="text-sm font-semibold text-gray-800">
          {rating.toFixed(1)}
        </span>
      </div>

      {/* Button */}
      <Button className="w-full mt-4" onClick={() => onRestaurantView(restaurant)}>
        View Restaurant
      </Button>
    </div>
  );
};


export default RestaurantCard;