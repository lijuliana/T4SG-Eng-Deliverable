import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import UserCard from "./user-card";
import type { Database } from "@/lib/schema";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default async function UsersPage() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Fetch all user profiles
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("display_name", { ascending: true }) as { data: Profile[] | null };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Users</TypographyH2>
        <p className="text-sm text-gray-600">
          {profiles?.length || 0} user{profiles?.length !== 1 ? 's' : ''} registered
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {profiles?.map((profile) => (
          <UserCard key={profile.id} profile={profile} />
        ))}
      </div>
    </>
  );
}
