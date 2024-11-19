import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import { getAccessToken } from "../models/session.server";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop"); // Shopify shop domain
  console.log(`Shop domain: ${shop}`);

  // Fetch the access token for the shop
  const accessToken = await getAccessToken(shop); // Your Prisma function to retrieve the token

  if (!accessToken) {
    console.log("No access token found for shop:", shop);
    throw new Response("Access token not found", { status: 404 });
  }

  console.log("Access Token:", accessToken);

  return json({ shop, accessToken });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  console.log(admin);
  return json({});
};

export default function Index() {
  const { shop, accessToken } = useLoaderData(); // Access data from the loader

  const handleIframeLoad = (iframe) => {
    if (iframe && iframe.contentWindow && accessToken) {
      console.log("Sending access token to iframe...");
      iframe.contentWindow.postMessage(
        { token: accessToken, shop },
        "https://merchant.portalprints.com" // Replace with the iframe's origin
      );
    }
  };

  return (
    <div>
      <h1>Welcome to Portal Prints Shopify app!</h1>
      {shop && (
        <iframe
          src={`https://merchant.portalprints.com/shopify?shop=${shop}&accessToken=${accessToken}`}
          style={{ width: "100%", height: "100vh", border: "none" }}
          title="Portal Prints"
          ref={handleIframeLoad} // Pass the iframe to the handler
        />
      )}
    </div>
  );
}
