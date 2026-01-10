import React from "react";

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface MenuCatFilterItemProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

export const MenuCatFilterItem: React.FC<MenuCatFilterItemProps> = ({
  category,
  isActive = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex w-max cursor-pointer items-center justify-between gap-2 rounded-full px-1 py-1 pr-6 transition-colors duration-200 ${isActive ? "bg-primary/80 text-gray-700" : "bg-gray-200 text-gray-700"} hover:brightness-95`}
    >
      {/* Category Image */}
      <img
        src={category.image}
        alt={category.name}
        className="h-8 w-8 rounded-full border-3 border-white object-cover"
      />
      {/* Category Name */}
      <span className="text-sm font-medium">{category.name}</span>
    </div>
  );
};
