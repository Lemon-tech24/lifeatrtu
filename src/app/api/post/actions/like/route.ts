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
      const existingLike = await prisma.like.findFirst({
        where: {
          userId: session.user.id,
          postId: postId,
        },
      });

      if (existingLike) {
        const deleteLikes = await prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        });

        if (deleteLikes) return NextResponse.json({ ok: true, msg: "unliked" });
      } else {
        const like = await prisma.like.create({
          data: {
            postId: postId,
            userId: session.user.id,
          },
        });

        if (like) {
          return NextResponse.json({ ok: true, msg: "liked" });
        } else
          return NextResponse.json({
            ok: false,
            msg: "Failed to Like the post",
          });
      }
    } else
      return NextResponse.json({
        msg: "UNAUTHORIZED ACCESS",
        status: "UNAUTHORIZED",
      });
  } catch (err) {
    console.log(err);
    console.log(err);
    return NextResponse.json({ msg: "error", status: "ERROR" });
  }
}
