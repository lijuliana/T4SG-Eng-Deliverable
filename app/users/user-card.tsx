"use client";

import type { Database } from "@/lib/schema";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function UserCard({ profile }: { profile: Profile }) {
  return (
    <div className="m-4 w-80 min-w-80 flex-none rounded border-2 p-6 shadow flex flex-col">
      {/* User Avatar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-lg">
            {profile.display_name?.charAt(0) || '?'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {profile.display_name || 'Unknown User'}
          </h3>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>
      
      {/* Biography */}
      {profile.biography && (
        <div className="flex-grow">
          <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profile.biography}
          </p>
        </div>
      )}
      
      {/* User ID (for debugging/admin purposes) */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          ID: {profile.id}
        </p>
      </div>
    </div>
  );
}
