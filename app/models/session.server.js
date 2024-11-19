import prisma from "../db.server";

// Save or update the access token for a shop
export const saveAccessToken = async (shop, accessToken) => {
  const existingSession = await prisma.session.findUnique({
    where: { shop },
  });

  if (existingSession) {
    // Update the existing session
    return prisma.session.update({
      where: { shop },
      data: { accessToken },
    });
  } else {
    // Create a new session
    return prisma.session.create({
      data: {
        id: shop, // Use the shop domain as the ID
        shop,
        accessToken,
      },
    });
  }
};

// Retrieve the access token for a shop
export const getAccessToken = async (shop) => {
  const session = await prisma.session.findUnique({
    where: { shop },
  });

  return session?.accessToken || null; // Return the token or null if not found
};
