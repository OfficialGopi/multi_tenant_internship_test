import { sanitizeUser } from "@/utils/db.util";
import { verifyToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import { db } from "@/db";
async function checkUser() {
  try {
    const cookiesStore = await cookies();

    const accessToken = cookiesStore.get("access-token");

    if (!accessToken) {
      return null;
    }

    const { data, success } = verifyToken(accessToken.value, false);

    if (!success || !data) {
      return null;
    }

    const user = await db.user.findUnique({
      where: {
        id: data.userId,
        role: data.role,
        tenantId: data.tenantId,
      },
    });

    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export { checkUser };
