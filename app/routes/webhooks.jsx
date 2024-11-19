import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  switch (topic) {
    case "ORDERS_CREATE":
      console.log("orders/create RECEIVED");
      break;
    case "CUSTOMERS_DATA_REQUEST":
      res.status(200).send()
      break;
    case "CUSTOMERS_REDACT":
      res.status(200).send()
      break;
    case "SHOP_REDACT":
      res.status(200).send()
      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
