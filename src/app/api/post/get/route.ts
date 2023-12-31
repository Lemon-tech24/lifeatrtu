import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/utils/PrismaConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const { skip, take, order } = await request.json();
    const session = await getServerSession(authOptions);

    if (session) {
      const posts = await prisma.post.findMany({
        skip: skip,
        take: take,
        include: {
          _count: {
            select: {
              likes: true,
              reports: true,
              comments: true,
              engages: true,
            },
          },

          likes: true,
          comments: true,
          engages: true,
          user: true,
        },
        orderBy: {
          ...(order === "asc" || order === "desc"
            ? { createdAt: order }
            : order === "likes" || order === "comments" || order === "engages"
            ? { [order]: { _count: "asc" } }
            : {}),
        },
      });

      if (posts) {
        posts.forEach((post) => {
          post.userId = null as any;
          if (post.anonymous) {
            post.user.name = null as any;
            post.user.email = null as any;
            post.user.createdAt = null as any;
          }
        });
        return NextResponse.json(posts);
      } else
        return NextResponse.json({
          msg: "Retriving Post Data Failed",
          status: "ERROR",
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
