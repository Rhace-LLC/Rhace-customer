"use client";

import { Restaurant } from "@/api-services/order.service";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock4,
  Globe,
  Star,
  Utensils,
  Tag,
  Phone,
} from "lucide-react";

const getCurrentDay = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBookReservation?: () => void;
}

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({
  restaurant,
  onBookReservation,
}) => {
  const currentDay = getCurrentDay();
  const schedule = [
    { day: "Monday", hours: "09:00 — 21:00", isHoliday: false },
    { day: "Tuesday", hours: "09:00 — 21:00", isHoliday: false },
    { day: "Wednesday", hours: "09:00 — 21:00", isHoliday: false },
    { day: "Thursday", hours: "09:00 — 22:00", isHoliday: false },
    { day: "Friday", hours: "09:00 — 23:00", isHoliday: false },
    { day: "Saturday", hours: "10:00 — 23:00", isHoliday: false },
    { day: "Sunday", hours: "10:00 — 20:00", isHoliday: false },
  ];

  const badges = ["Contemporary", "French", "Fusion"];
  const gallery = [
    "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?q=80&w=889&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const rating = 4.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-6xl overflow-hidden bg-white"
    >
      {/* Cover */}
      <div className="relative mb-[10px] h-96 w-full">
        <img
          src={gallery[0]}
          alt="Restaurant Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-[0px] left-0 w-full flex items-center gap-6 bg-gradient-to-b from-transparent to-black/100 p-6">
          <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-white bg-white shadow-lg sm:h-32 sm:w-32">
            {true ? (
              <img
                src={gallery[0]}
                alt={restaurant.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Logo
              </div>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-3xl leading-tight font-bold">
              {restaurant.name}
            </h1>
            <p className="text-md mt-1 text-amber-200">
              {restaurant.description?.slice(0, 80) ||
                "A modern culinary experience."}
            </p>
          </div>
        </div>
      </div>

      {/* Details & Action */}
      <div className="flex flex-col justify-between border-b border-gray-100 bg-white px-6 py-4">
        {/* About */}
        <div className="p-6 pt-0 text-center">
          <h2 className="mb-3 border-b border-gray-200 pb-2 text-2xl font-semibold text-gray-900">
            About Us
          </h2>
          <p className="leading-relaxed text-gray-700">
            {restaurant.description ||
              "Maison Delish is a modern culinary destination blending contemporary design with traditional techniques, using seasonal locally-sourced ingredients."}
          </p>
        </div>
        <div className="mb-4 flex flex-col items-center gap-4 md:mb-0">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm"
              >
                <Tag className="mr-1 h-3 w-3" /> {badge}
              </span>
            ))}
          </div>
          <div className="text-md flex items-center justify-center text-center font-semibold text-gray-700">
            <Star className="mr-1 h-5 w-5 stroke-current text-yellow-500" />
            {rating}
          </div>
        </div>
        <button
          onClick={onBookReservation}
          className="w-full rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 md:w-auto"
        >
          Book Reservation
        </button>
      </div>

      <div className="m-4 my-10 grid grid-cols-1 gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:grid-cols-2 lg:grid-cols-4">
        {/* Location */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <MapPin className="relative bottom-[4px] mt-1 mr-1 inline-block h-5 w-5 text-indigo-600" />{" "}
            Location
          </span>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-gray-900">
                {restaurant.city || "Lagos"},{" "}
                {restaurant.state || "Lagos State"}
              </p>
              <p className="text-xs text-gray-400">View on map</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Phone className="relative bottom-[4px] mt-1 mr-1 inline-block h-5 w-5 text-indigo-600" />
            Contact
          </span>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-medium text-gray-900">
                Email: {restaurant.email || "hello@example.com"}
              </p>
              <p className="font-medium text-gray-900">
                Phone: {restaurant.phone || "+234 801 234 5678"}
              </p>
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Globe className="relative bottom-[4px] mt-1 mr-1 inline-block h-5 w-5 text-indigo-600" />
            Website
          </span>
          <div className="flex items-start gap-3">
            <div>
              <a
                href={restaurant.access_url || "#"}
                className="block truncate font-medium text-indigo-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {restaurant.access_url || "Visit Website"}
              </a>
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            <Clock4 className="relative bottom-[4px] mt-1 mr-1 inline-block h-5 w-5 text-indigo-600" />
            Hours
          </span>
          <div className="flex items-start gap-3">
            <div>
              <p className="font-semibold text-gray-900">
                {schedule.find((s) => s.day === currentDay)?.hours ||
                  "09:00 — 21:00"}
              </p>
              <p className="text-xs text-gray-400">See full schedule below</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="px-6 pb-6">
        <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-semibold text-gray-900">
          Photo Gallery
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {gallery.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="h-56 w-full rounded-xl border border-gray-100 object-cover shadow-sm transition-all duration-300 hover:shadow-md"
              whileHover={{ scale: 1.01 }}
            />
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="rounded-xl bg-white p-6">
        <h2 className="mb-6 border-b border-gray-200 pb-2 text-xl font-semibold tracking-tight text-gray-900">
          Operating Hours
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {schedule.map((item) => {
            const isToday = item.day === currentDay;
            return (
              <div
                key={item.day}
                className={`flex flex-col justify-center rounded-xl border-l-2 p-5 transition-all duration-300 ${isToday ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-gray-50"} `}
              >
                <span
                  className={`text-md font-semibold ${isToday ? "text-indigo-800" : "text-gray-800"}`}
                >
                  {item.day}
                </span>
                <span
                  className={`text-sm font-medium ${isToday ? "text-indigo-600" : "text-gray-600"}`}
                >
                  {item.hours}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          <span className="font-semibold text-indigo-600">Today</span> is
          highlighted.
        </p>
      </div>
    </motion.div>
  );
};
