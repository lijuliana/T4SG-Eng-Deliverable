/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { message } = body as { message?: string };

    // Validate the message field
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Generate response using the species chat service
    const response = await generateResponse(message);

    // Return the response
    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return a 502 error for upstream/provider issues
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 502 }
    );
  }
}
