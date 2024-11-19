import { redirect } from "@remix-run/node";
import { saveAccessToken } from "~/models/session.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");
  const code = url.searchParams.get("code");

  if (!shop || !code) {
    throw new Response("Missing required parameters", { status: 400 });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_CLIENT_ID,
        client_secret: process.env.SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Error exchanging token:", errorText);
      throw new Response("Failed to exchange token", { status: 500 });
    }

    const { access_token } = await tokenResponse.json();
    console.log("Access Token:", access_token);

    // Save the access token to the database
    await saveAccessToken(shop, access_token);

    // Redirect back to Shopify Admin's App Section
    return redirect(`https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/apps/your-app-name`);
  } catch (error) {
    console.error("Error handling Shopify OAuth callback:", error.message);
    throw new Response("Server error during OAuth callback", { status: 500 });
  }
};
