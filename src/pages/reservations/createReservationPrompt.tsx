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
      className="w-full max-w-md mx-auto text-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-8 shadow-lg border border-white/10"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-4"
      >
        <div className="p-3 rounded-full bg-white/10">
          <CalendarCheck className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
        Ready to Reserve?
        <Sparkles className="w-5 h-5 text-yellow-300" />
      </h2>

      {/* Subtitle */}
      <p className="text-gray-300 mt-2 text-sm">
        Book your table in a few quick steps. Fast, simple, and stress-free!
      </p>

      {/* Action Button */}
      <Button
        className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl px-6 py-5 w-full transition-all duration-200 shadow-md hover:shadow-xl"
        onClick={onStart}
      >
        Get Started
      </Button>
    </motion.div>
  );
};

export default CreateReservationPrompt;
