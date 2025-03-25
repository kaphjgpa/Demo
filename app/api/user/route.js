import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession();
  return NextResponse.json({
    session,
  });
}

//This is how you an acess the user details on the API route
