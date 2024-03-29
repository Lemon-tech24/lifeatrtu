import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { prisma } from "@/utils/PrismaConfig";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  try {
    const { postId, reason } = await request.json();
    const session = await getServerSession(authOptions);

    if (session) {
      const existingReport = await prisma.report.findFirst({
        where: {
          postId: postId,
          userId: session.user.id,
        },
      });

      if (!existingReport) {
        const reportPost = await prisma.report.create({
          data: {
            postId: postId,
            userId: session.user.id,
            reasons: reason,
            disregard: false,
          },
        });

        if (reportPost) {
          return NextResponse.json({
            ok: true,
            msg: "Successfully Reported",
          });
        } else
          return NextResponse.json({
            ok: false,
            msg: "Failed To Report",
            status: "ERROR",
          });
      } else {
        const updateReport = await prisma.report.update({
          where: {
            id: existingReport.id,
            postId: postId,
            userId: session.user.id,
          },
          data: {
            reasons: reason,
          },
        });

        if (updateReport) {
          return NextResponse.json({
            ok: true,
            msg: "Successfully Reported",
          });
        } else
          return NextResponse.json({
            ok: false,
            msg: "Failed To Report",
            status: "ERROR",
          });
      }
    } else
      return NextResponse.json({
        msg: "UNAUTHORIZED ACCESS",
        status: "UNAUTHORIZED",
      });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Error", status: "ERROR" });
  }
}
