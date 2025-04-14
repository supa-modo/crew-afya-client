import React from "react";
import PropTypes from "prop-types";
import { TbCalendarEvent, TbRoute, TbBus } from "react-icons/tb";

const MembershipCard = ({ user }) => {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-600/90 dark:from-primary-900/90 dark:via-primary-700 dark:to-primary-900/90 rounded-3xl shadow-xl overflow-hidden border border-gray-300 dark:border-gray-700 px-3 py-5 sm:p-6 text-white relative">
        {/* Card Header with Logo and Member Info */}
        <div className="relative z-10">
          <div className="px-3 sm:px-4 rounded-2xl border border-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-between mb-5">
            <div className="py-2">
              <div className="flex items-center gap-2 my-1 sm:my-2">
                <span className="opacity-80 text-xs sm:text-sm font-medium">
                  Matatu Workers Union
                </span>
                <div className="w-1 h-4 rounded-full bg-white/20"></div>
                <div className="flex items-center gap-2 text-[0.65rem] sm:text-xs px-2 py-0.5 rounded-lg bg-white/20 text-secondary-400 uppercase tracking-wide">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                  <span>{user?.membershipStatus || "Active"}</span>
                </div>
              </div>
              <div className="text-[1.2rem] sm:text-[1.35rem] font-semibold pt-1 mb-2 text-white">
                {user?.firstName} {user?.otherNames}{" "}
                {user?.lastName || "Member"}
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center p-1">
                <img
                  src="/mwulogo.png"
                  alt="Union Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Member Details Section */}
          <div className="grid grid-cols-2 gap-8 sm:gap-10 mt-3 sm:mt-6 px-3">
            <div className="relative">
              <div className="opacity-80 text-xs mb-1 font-medium">
                Member ID
              </div>
              <div className="text-sm sm:text-base font- tracking-wider text-secondary-400 font-semibold">
                {user?.membershipNumber || "MWU-7723511"}
              </div>

              {/* Decorative element */}
              <div className="absolute left-0 -bottom-2 w-12 h-0.5 bg-secondary-400/40 rounded-full"></div>
            </div>

            <div className="relative">
              <div className="opacity-80 text-xs mb-1 font-medium">
                Operation Route
              </div>
              <div className="text-sm sm:text-base font-medium text-amber-400">
                {user?.route || "Thika Road"}
              </div>

              {/* Decorative element */}
              <div className="absolute left-0 -bottom-2 w-12 h-0.5 bg-amber-400/60 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/15 rounded-full -mr-20 -mt-20 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-secondary-500/20 rounded-full -ml-20 -mb-20 blur-xl"></div>

        {/* Card Footer */}
        <div className="mt-7 sm:mt-8 pt-4 border-t border-white/20 flex justify-between text-[0.68rem] sm:text-xs md:text-sm items-center">
          <div className="flex items-center">
            <TbCalendarEvent className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-secondary-400" />
            <span className="hidden sm:inline mr-1">Member since:</span>
            <span className="inline sm:hidden mr-1">Since:</span>
            <span className="text-secondary-400">
              {user?.joinDate || "Jan 15, 2023"}
            </span>
          </div>
          <div className="flex items-center">
            <TbRoute className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            <span className="text-white/80">SACCO:</span>
            <span className="text-white ml-1">
              {user?.sacco || "Kawangware Sacco"}
            </span>
          </div>
        </div>

        {/* Bus icon decoration */}
        <div className="absolute right-5 bottom-16 text-white/35">
          <TbBus className="h-16 w-16 sm:h-20 sm:w-20" />
        </div>
      </div>
    </div>
  );
};

MembershipCard.propTypes = {
  user: PropTypes.object,
};

export default MembershipCard;
