"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Sparkles } from "lucide-react";

interface Props {
  onStart: () => void;
}

const CreateReservationPrompt: React.FC<Props> = ({ onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-8 text-center shadow-lg"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-4 flex justify-center"
      >
        <div className="rounded-full bg-white/10 p-3">
          <CalendarCheck className="h-10 w-10 text-white" />
        </div>
      </motion.div>

      {/* Heading */}
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold text-white">
        Ready to Reserve?
        <Sparkles className="h-5 w-5 text-yellow-300" />
      </h2>
      {/* Added Text */}
      <p className="mt-1 text-base font-medium text-gray-100/90">
        Find the perfect restaurant and book a reservation.
      </p>
      {/* Subtitle */}
      <p className="mt-2 text-sm text-gray-300">
        Book your table in a few quick steps. Fast, simple, and stress-free!
      </p>

      {/* Action Button */}
      <Button
        className="mt-6 w-full rounded-xl bg-yellow-400 px-6 py-5 font-semibold text-black shadow-md transition-all duration-200 hover:bg-yellow-500 hover:shadow-xl"
        onClick={onStart}
      >
        Get Started
      </Button>
    </motion.div>
  );
};

export default CreateReservationPrompt;
