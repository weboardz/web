import { api } from "@/config";
import { NextRequest } from "next/server";

const POST = async (request: NextRequest) => {
  const { email, password, rememberMe } = await request.json();

  try {
    const {
      data: { token },
    } = await api.post<{ token: string }>("/auth/signin", { email, password });

    const expirationTime = rememberMe && 60 * 60 * 24; // 1 day

    return new Response("", {
      headers: {
        "Set-Cookie": `token=${token}; Path=/; max-age=${expirationTime}`,
      },
    });
  } catch (error) {
    return new Response("Could not sign in", { status: 401 });
  }
};

export { POST };
