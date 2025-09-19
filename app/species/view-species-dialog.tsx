"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import Image from "next/image";
import AddCommentDialog from "./add-comment-dialog";
import CommentCard from "./comment-card";

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

interface ViewSpeciesDialogProps {
  species: SpeciesWithAuthor;
  currentUserId: string;
  children: React.ReactNode;
}

export default function ViewSpeciesDialog({ species, currentUserId, children }: ViewSpeciesDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Species Details</DialogTitle>
          <DialogDescription>
            Detailed information about {species.scientific_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Species Image */}
          {species.image && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image 
                src={species.image} 
                alt={species.scientific_name} 
                fill 
                style={{ objectFit: "cover" }} 
                className="rounded-lg"
              />
            </div>
          )}
          
          {/* Species Information */}
          <div className="space-y-4">
            {/* Scientific Name */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Scientific Name</h3>
              <p className="text-lg text-gray-700 italic">{species.scientific_name}</p>
            </div>
            
            {/* Common Name */}
            {species.common_name && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Common Name</h3>
                <p className="text-lg text-gray-700">{species.common_name}</p>
              </div>
            )}
            
            {/* Kingdom */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Kingdom</h3>
              <p className="text-lg text-gray-700">{species.kingdom}</p>
            </div>
            
            {/* Total Population */}
            {species.total_population && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Population</h3>
                <p className="text-lg text-gray-700">{species.total_population.toLocaleString()}</p>
              </div>
            )}
            
            {/* Endangered Status */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Conservation Status</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${species.endangered ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <p className={`text-lg font-medium ${species.endangered ? 'text-red-600' : 'text-green-600'}`}>
                  {species.endangered ? 'Endangered' : 'Not Endangered'}
                </p>
              </div>
            </div>
            
            {/* Author Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Added by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {species.author_profile?.display_name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {species.author_profile?.display_name || 'Unknown User'}
                  </p>
                  {species.author_profile?.email && (
                    <p className="text-sm text-gray-500">{species.author_profile.email}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description */}
            {species.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                <p className="text-gray-700 leading-relaxed">{species.description}</p>
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Comments ({species.comments?.length || 0})
              </h3>
              <AddCommentDialog speciesId={species.id}>
                <Button size="sm">Add Comment</Button>
              </AddCommentDialog>
            </div>
            
            {/* Comments List */}
            <div className="space-y-3">
              {species.comments && species.comments.length > 0 ? (
                species.comments
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .map((comment) => (
                    <CommentCard 
                      key={comment.id} 
                      comment={comment} 
                      currentUserId={currentUserId}
                    />
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
