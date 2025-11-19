"use client";

import { Restaurant } from "@/api-services/order.service";
import { motion } from "framer-motion";
import { MapPin, Clock4, Globe, Star, Utensils, Tag } from "lucide-react";

const getCurrentDay = () => new Date().toLocaleDateString("en-US", { weekday: "long" });

interface RestaurantDetailViewProps {
  restaurant: Restaurant;
  onBookReservation?: () => void;
}

const DetailCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({
  icon,
  title,
  children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md"
  >
    <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
      <span className="text-indigo-500 mr-2">{icon}</span>
      {title}
    </div>
    <div className="text-sm text-gray-600">{children}</div>
  </motion.div>
);

export const RestaurantDetailView: React.FC<RestaurantDetailViewProps> = ({ restaurant, onBookReservation }) => {
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
    "https://via.placeholder.com/400x300?text=Appetizer",
    "https://via.placeholder.com/400x300?text=Interior+View",
    "https://via.placeholder.com/400x300?text=Signature+Dish",
  ];

  const rating = 4.6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto bg-white overflow-hidden"
    >
      {/* Cover */}
      <div className="relative h-96 w-full">
        <img
          src={restaurant.logo || "https://via.placeholder.com/1200x400?text=Restaurant+Cover"}
          alt="Restaurant Cover"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25"></div>

        <div className="absolute bottom-0 left-0 p-6 flex items-end gap-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-xl overflow-hidden border border-white shadow-lg flex-shrink-0">
            {restaurant.logo ? (
              <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">Logo</div>
            )}
          </div>
          <div className="text-white">
            <h1 className="text-3xl font-bold leading-tight">{restaurant.name}</h1>
            <p className="text-md text-gray-200 mt-1">
              {restaurant.description?.slice(0, 80) || "A modern culinary experience."}
            </p>
          </div>
        </div>
      </div>

      {/* Details & Action */}
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 bg-white">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 md:mb-0 items-start">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
              <span
                key={badge}
                className="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                <Tag className="w-3 h-3 mr-1" /> {badge}
              </span>
            ))}
          </div>
          <div className="flex items-center text-md font-semibold text-gray-700">
            <Star className="w-5 h-5 mr-1 stroke-current text-yellow-500" />
            {rating}
          </div>
        </div>
        <button
          onClick={onBookReservation}
          className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
        >
          Book Reservation
        </button>
      </div>

      {/* Info Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DetailCard title="Location" icon={<MapPin className="w-4 h-4" />}>
          <p className="font-medium">{restaurant.city || "Lagos"}, {restaurant.state || "Lagos State"}</p>
          <p className="text-xs text-gray-400">View on map</p>
        </DetailCard>
        <DetailCard title="Contact" icon={<Utensils className="w-4 h-4" />}>
          <p>Email: {restaurant.email || "hello@example.com"}</p>
          <p>Phone: {restaurant.phone || "+234 801 234 5678"}</p>
        </DetailCard>
        <DetailCard title="Website" icon={<Globe className="w-4 h-4" />}>
          <a
            href={restaurant.access_url || "#"}
            className="text-blue-600 font-medium hover:underline truncate"
            target="_blank"
            rel="noopener noreferrer"
          >
            {restaurant.access_url || "Visit Website"}
          </a>
        </DetailCard>
        <DetailCard title="Hours (Today)" icon={<Clock4 className="w-4 h-4" />}>
          <p className="font-medium text-gray-800">{schedule.find(s => s.day === currentDay)?.hours || "09:00 — 21:00"}</p>
          <p className="text-xs text-gray-400">See full schedule below</p>
        </DetailCard>
      </div>

      {/* About */}
      <div className="p-6 pt-0">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">About Us</h2>
        <p className="text-gray-700 leading-relaxed">
          {restaurant.description ||
            "Maison Delish is a modern culinary destination blending contemporary design with traditional techniques, using seasonal locally-sourced ingredients."}
        </p>
      </div>

      {/* Gallery */}
      <div className="px-6 pb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">Photo Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              className="rounded-xl shadow-sm object-cover h-56 w-full border border-gray-100 hover:shadow-md transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            />
          ))}
        </div>
      </div>

      {/* Operating Hours */}
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Operating Hours</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schedule.map((item) => {
            const isToday = item.day === currentDay;
            return (
              <div
                key={item.day}
                className={`flex flex-col justify-center p-5 rounded-xl shadow-sm border-l-2 transition-all duration-300
                  ${isToday ? "border-indigo-600 bg-indigo-50" : "border-gray-200 bg-gray-50"}
                `}
              >
                <span className={`text-lg font-semibold ${isToday ? "text-indigo-800" : "text-gray-800"}`}>
                  {item.day}
                </span>
                <span className={`text-md font-medium ${isToday ? "text-indigo-600" : "text-gray-600"}`}>
                  {item.hours}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          <span className="font-semibold text-indigo-600">Today</span> is highlighted.
        </p>
      </div>
    </motion.div>
  );
};
