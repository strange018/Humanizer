import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserQuota, QUOTA } from "@/lib/quota";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    // Return the anonymous quota constants so the client can self-manage
    return NextResponse.json({
      authenticated: false,
      limit: QUOTA.ANONYMOUS_DAILY_TOKENS,
    });
  }

  const quota = await getUserQuota(session.user.id);

  return NextResponse.json({
    authenticated: true,
    ...quota,
    // Serialize Date → ISO string for the client
    resetAt: quota.resetAt.toISOString(),
  });
}
