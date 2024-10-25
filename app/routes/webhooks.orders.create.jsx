import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, payload, topic } = await authenticate.webhook(request);

  // Implement handling of mandatory compliance topics
  // See: https://shopify.dev/docs/apps/build/privacy-law-compliance
  console.log(`Received ${topic} webhook for ${shop}`);
  console.log(JSON.stringify(payload, null, 2));
  const googleAppsScriptUrl = "https://script.google.com/macros/s/AKfycbyfWNdliUKzjkIoGSwx2FQsgB8rbGmTTtmalk85Zrlw984-NVIa1rmT9GfVLZoxdVY58g/exec";

  try {
    // Use fetch to send the payload to your Google Apps Script
    const response = await fetch(googleAppsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),  // Send the Shopify payload
    });

    // Check the response from Google Apps Script
    if (response.ok) {
      console.log("Payload successfully forwarded to Google Apps Script");
    } else {
      console.error("Failed to forward payload to Google Apps Script:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending payload to Google Apps Script:", error);
  }

  return new Response();
};