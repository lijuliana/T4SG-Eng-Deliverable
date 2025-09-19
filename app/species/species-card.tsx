"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import ViewSpeciesDialog from "./view-species-dialog";
import EditSpeciesDialog from "./edit-species-dialog";
import DeleteSpeciesDialog from "./delete-species-dialog";

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

export default function SpeciesCard({ species, sessionId }: { species: SpeciesWithAuthor; sessionId: string }) {
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow flex flex-col">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p className="flex-grow">{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      
      {/* Button row with learn more, edit, and delete buttons */}
      <div className="mt-3 flex gap-2">
        {/* Learn More button - always at the bottom */}
        <ViewSpeciesDialog species={species} currentUserId={sessionId}>
          <Button className="flex-1">Learn More</Button>
        </ViewSpeciesDialog>
        {/* Show edit and delete buttons only for species created by the current user through the Add Species button */}
        {species.author === sessionId && species.user_created && (
          <>
            <EditSpeciesDialog species={species}>
              <Button variant="outline" className="flex-shrink-0">
                Edit
              </Button>
            </EditSpeciesDialog>
            <DeleteSpeciesDialog species={species}>
              <Button variant="destructive" className="flex-shrink-0 bg-red-600 hover:bg-red-700">
                Delete
              </Button>
            </DeleteSpeciesDialog>
          </>
        )}
      </div>
    </div>
  );
}
