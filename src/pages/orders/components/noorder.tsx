import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const NoActiveOrder = () => {
  return (
    <>
      <div className="animate-in fade-in flex min-h-[80vh] w-full flex-col items-center justify-center px-6 duration-700">
        {/* ILLUSTATION / ICON HUB */}
        <div className="relative mb-8">
          <div className="absolute inset-0 scale-150 rounded-full bg-blue-50/50 blur-3xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[40px] border border-blue-50 bg-white shadow-2xl shadow-blue-100">
            <div className="flex h-20 w-20 items-center justify-center rounded-[30px] bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <Utensils />
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="max-w-xs space-y-3 text-center">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">
            Make a new Order!
          </h2>
          <p className="text-[15px] leading-relaxed font-medium text-gray-400">
            You don't have any uncompleted orders at the moment. Time to take a
            breather.
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="mt-10">
          <Link to={"/menu"}>
            <button className="group flex cursor-pointer items-center gap-3 rounded-full bg-gray-900 px-8 py-4 text-[13px] font-semibold tracking-widest text-white uppercase shadow-xl shadow-gray-900/10 transition-all hover:bg-black active:scale-95">
              Explore Menu
            </button>
          </Link>
        </div>
        <div className="mt-4">
          <Link to={"/order-history"}>
            <button className="group flex cursor-pointer items-center gap-3 rounded-full border border-transparent bg-gray-100 px-8 py-4 text-[13px] font-semibold tracking-widest text-gray-500 uppercase transition-all hover:border-gray-300/50 hover:bg-gray-200 hover:text-gray-700 active:scale-95">
              See Past Orders
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NoActiveOrder;
