"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { type Database } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

type Comment = Database["public"]["Tables"]["comments"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type CommentWithAuthor = Comment & {
  author_profile: Profile | null;
};

interface CommentCardProps {
  comment: CommentWithAuthor;
  currentUserId: string;
}

export default function CommentCard({ comment, currentUserId }: CommentCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const supabase = createBrowserSupabaseClient();
      
      const { error } = await (supabase as any)
        .from("comments")
        .delete()
        .eq("id", comment.id);

      if (error) {
        throw error;
      }

      router.refresh();

      toast({
        title: "Comment deleted!",
        description: "Your comment has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error.message || "Failed to delete comment.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const canDelete = comment.author_id === currentUserId;

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          {/* Author Avatar */}
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold text-sm">
              {comment.author_profile?.display_name?.charAt(0) || '?'}
            </span>
          </div>
          
          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="font-medium text-sm text-gray-900">
                {comment.author_profile?.display_name || 'Unknown User'}
              </p>
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        </div>
        
        {/* Delete Button */}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
