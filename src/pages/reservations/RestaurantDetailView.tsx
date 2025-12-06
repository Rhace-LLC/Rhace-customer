"use client";

import { RestaurantProfile } from "@/api-services/restaurantProfile";
import GenericSheet from "@/components/generic_sheet_overlay";
import { RootState } from "@/store/store";
import { motion } from "framer-motion";
import { MapPin, Star, Tag, Phone } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CreateReservation, ReservationForm } from "./createReservation";
import { useLoading } from "@/contexts/LoadingContext";
import { createReservation } from "@/api-services/order.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { parseError } from "@/api-services/utils/parseError";

const fallbackGallery = [
  "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b",
  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
];

const fallbackCover =
  "https://images.unsplash.com/photo-1556742393-d75f468bfcb0";

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const formatTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hr = hour % 12 || 12;
  return `${hr}:${m} ${suffix}`;
};

export const RestaurantDetailView: React.FC = () => {
  const { setLoading, setLoadingText } = useLoading();
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const navigate = useNavigate();

  const dataStore = useSelector((state: RootState) => state.restaurants);
  const allData = dataStore.data ?? {};

  // Flatten arrays safely
  const restaurants = Object.values(allData).flat() as any[];

  // Find restaurant safely
  const restaurant: RestaurantProfile = restaurants.find((x) => x.id === id);
  // If restaurant not found, show fallback UI
  if (!restaurant) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="mb-2 text-xl font-semibold">Restaurant Not Found</h2>
        <p>The restaurant you are looking for does not exist or was removed.</p>
      </div>
    );
  }
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const galleryImages = restaurant.cover_image_url
    ? [restaurant.cover_image_url, ...fallbackGallery]
    : fallbackGallery;

  const openingHours = restaurant.opening_hours || [];

  const rating = restaurant.avg_rating ?? 0;

  const [open, setOpen] = useState(false);

  const handleBookReservation = async () => {
    if (!auth.isAuthenticated) {
      toast.info("You need to be logged in to Book a reservation.");
      navigate(`/login?next=view-restaurant/${restaurant.id}`);
      return;
    }
    setOpen(true);
  };

  const handleSubmit = async (data: ReservationForm) => {
    try {
      setLoading(true);
      setLoadingText("Creating Your Reservation... Please wait");

      // Call API to create reservation
      await createReservation(restaurant?.id || "", data, auth.token);

      // Success toast
      toast.success("Reservation created successfully!");
    } catch (error: any) {
      // Parse and display error
      const errMessage = parseError(error) || "Failed to create reservation.";
      toast.error(errMessage);
      console.error("Reservation creation error:", error);
    } finally {
      // Reset loading state
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl overflow-hidden bg-white"
      >
        {/* ========== COVER SECTION ========== */}
        <div className="relative mb-[10px] h-96 w-full">
          <img
            src={restaurant.cover_image_url || fallbackCover}
            alt={restaurant.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Logo + Name */}
          <div className="absolute bottom-0 left-0 flex w-full items-center gap-6 bg-gradient-to-b from-transparent to-black/100 p-6">
            <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white bg-white text-3xl font-bold text-gray-700 shadow-lg">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt="Logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(restaurant.name)
              )}
            </div>

            <div className="text-white">
              <h1 className="text-3xl leading-tight font-bold">
                {restaurant.name}
              </h1>
              <p className="text-md mt-1 text-amber-200">
                {restaurant.slogan ||
                  restaurant.description?.slice(0, 80) ||
                  "A delightful dining experience awaits."}
              </p>
            </div>
          </div>
        </div>

        {/* ========== ABOUT + ACTION ========== */}
        <div className="flex flex-col justify-between border-b border-gray-100 bg-white px-6 py-4">
          <div className="p-6 pt-0 text-center">
            <h2 className="mb-3 border-b border-gray-200 pb-2 text-2xl font-semibold text-gray-900">
              About Us
            </h2>
            <p className="leading-relaxed text-gray-700">
              {restaurant.description ||
                "Experience world-class meals carefully crafted with passion and perfection."}
            </p>
          </div>

          {/* Tags + Rating */}
          <div className="mb-4 flex flex-col items-center gap-4 md:mb-0">
            <div className="flex flex-wrap gap-2">
              {(restaurant.tags || ["Dining", "Local Cuisine"]).map(
                (tag: any) => (
                  <span
                    key={tag}
                    className="flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm"
                  >
                    <Tag className="mr-1 h-3 w-3" /> {tag}
                  </span>
                )
              )}
            </div>

            <div className="text-md flex items-center font-semibold text-gray-700">
              <Star className="mr-1 h-5 w-5 text-yellow-500" />
              {rating.toFixed(1)}{" "}
              <span className="ml-1 text-gray-400">
                ({restaurant.rating_count})
              </span>
            </div>
          </div>

          <button
            onClick={handleBookReservation}
            className="w-full rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 md:w-auto"
          >
            Book Reservation
          </button>
        </div>

        {/* ========== QUICK INFO GRID ========== */}
        <div className="m-4 my-10 grid grid-cols-1 gap-6 rounded-xl border border-gray-100 bg-white p-6 shadow-lg sm:grid-cols-2 lg:grid-cols-4">
          {/* Location */}
          <InfoBlock
            title="Location"
            icon={<MapPin className="h-5 w-5 text-indigo-600" />}
          >
            <p className="font-semibold text-gray-900">
              {restaurant.city}, {restaurant.state}, {restaurant.country}
            </p>
            <p className="text-xs text-gray-400">View on map</p>
          </InfoBlock>

          {/* Contact */}
          <InfoBlock
            title="Contact"
            icon={<Phone className="h-5 w-5 text-indigo-600" />}
          >
            <p className="font-medium text-gray-900">
              Email: {restaurant.email}
            </p>
            <p className="font-medium text-gray-900">
              Phone: {restaurant.phone}
            </p>
          </InfoBlock>
        </div>

        {/* ========== PHOTO GALLERY ========== */}
        <div className="hidden px-6 pb-6">
          <h2 className="mb-4 border-b border-gray-200 pb-2 text-2xl font-semibold text-gray-900">
            Photo Gallery
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {galleryImages.map((img, idx) => (
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

        {/* ========== OPERATING HOURS ========== */}
        <div className="rounded-xl bg-white p-6">
          <h2 className="mb-6 border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
            Operating Hours
          </h2>

          {openingHours.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {openingHours.map((item) => {
                const isToday = item.day === today;
                return (
                  <div
                    key={item.day}
                    className={`flex flex-col justify-center rounded-xl border-l-2 p-5 transition-all duration-300 ${
                      isToday
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <span
                      className={`text-md font-semibold ${
                        isToday ? "text-indigo-800" : "text-gray-800"
                      }`}
                    >
                      {item.day}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        isToday ? "text-indigo-600" : "text-gray-600"
                      }`}
                    >
                      {formatTime(item.open_time)} —{" "}
                      {formatTime(item.close_time)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">Operating hours not available.</p>
          )}
        </div>
      </motion.div>
      <div className="py-[60px]" />

      <GenericSheet
        open={open}
        onOpenChange={setOpen}
        title="Create Reservation"
        subtitle="Select your date, time and party size."
      >
        <CreateReservation
          onSubmit={(data) => {
            setOpen(false);
            handleSubmit(data);
          }}
        />
      </GenericSheet>
    </>
  );
};

// Small reusable block component
const InfoBlock = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.JSX.Element;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2">
    <span className="flex items-center gap-1 text-sm font-semibold tracking-wide text-gray-500 uppercase">
      {icon} {title}
    </span>
    <div>{children}</div>
  </div>
);
