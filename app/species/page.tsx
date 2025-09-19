import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import SpeciesList from "./species-list";
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

export default async function SpeciesPage() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  const { data: species } = await supabase
    .from("species")
    .select(`
      *,
      author_profile:profiles!species_author_fkey(*),
      comments(
        *,
        author_profile:profiles!comments_author_id_fkey(*)
      )
    `)
    .order("id", { ascending: false }) as { data: SpeciesWithAuthor[] | null };

  return <SpeciesList species={species || []} sessionId={sessionId} />;
}
