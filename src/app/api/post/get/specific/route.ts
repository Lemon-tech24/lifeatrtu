import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/utils/PrismaConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    const session = await getServerSession(authOptions);
    if (session) {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },

        include: {
          comments: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      });

      if (post) {
        return NextResponse.json({ ok: true, post: post });
      } else
        return NextResponse.json({
          ok: false,
          msg: "Failed to Retrieve Post Data",
        });
    } else
      return NextResponse.json({
        msg: "UNAUTHORIZED ACCESS",
        status: "UNAUTHORIZED",
      });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "error", status: "ERROR" });
  }
}
