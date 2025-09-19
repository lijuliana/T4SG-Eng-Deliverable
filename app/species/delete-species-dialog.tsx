"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { type Database } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function DeleteSpeciesDialog({
  species,
  children,
}: {
  species: Species;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const supabase = createBrowserSupabaseClient();
      
      const { error } = await (supabase as any)
        .from("species")
        .delete()
        .eq("id", species.id);

      if (error) {
        throw error;
      }

      setOpen(false);
      router.refresh();

      toast({
        title: "Species deleted!",
        description: `Successfully deleted ${species.scientific_name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.message || "Failed to delete species.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Species</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{species.scientific_name}</strong>?
            {species.common_name && (
              <>
                {" "}({species.common_name})
              </>
            )}
            <br />
            <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Species"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
