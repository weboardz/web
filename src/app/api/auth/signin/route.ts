import { api } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, password, rememberMe } = await req.json();

  try {
    const { data: credentials } = await api.post("/auth/signin", {
      email,
      password,
    });

    console.log(credentials);

    const expirationTimeInSeconds = 60 * 60 * 24; // 1 day

    return NextResponse.redirect("http://localhost:5000/home", {
      headers: {
        "Set-Cookie": `token=${credentials.token}; Path=/; max-age=${expirationTimeInSeconds};`,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
