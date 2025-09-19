"use client";

import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AddSpeciesDialog from "./add-species-dialog";
import SpeciesCard from "./species-card";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Comment = Database["public"]["Tables"]["comments"]["Row"];

type CommentWithAuthor = Comment & {
  author_profile: Profile | null;
};

type SpeciesWithAuthor = Species & {
  author_profile: Profile | null;
  comments: CommentWithAuthor[];
};

interface SpeciesListProps {
  species: SpeciesWithAuthor[];
  sessionId: string;
}

export default function SpeciesList({ species, sessionId }: SpeciesListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter species based on search query (case-insensitive)
  const filteredSpecies = species.filter((species) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    const scientificName = species.scientific_name?.toLowerCase() || "";
    const commonName = species.common_name?.toLowerCase() || "";
    const description = species.description?.toLowerCase() || "";
    
    return (
      scientificName.includes(query) ||
      commonName.includes(query) ||
      description.includes(query)
    );
  });

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <AddSpeciesDialog userId={sessionId} />
      </div>
      
      {/* Search Input */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by scientific name, common name, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            {filteredSpecies.length} species found for "{searchQuery}"
          </p>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex flex-wrap justify-center">
        {filteredSpecies.length > 0 ? (
          filteredSpecies.map((species) => (
            <SpeciesCard key={species.id} species={species} sessionId={sessionId} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? "No species found matching your search." : "No species available."}
            </p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">
                Try searching with different keywords or check your spelling.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
