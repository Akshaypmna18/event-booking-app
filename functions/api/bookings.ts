import { PagesFunctionArgs } from "../types";

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};

const KEY = "bookings";

export const onRequestPost = async ({ request, env }: PagesFunctionArgs) => {
  const kv = env.EVENT_BOOKING_APP;

  if (!kv) {
    return new Response(
      JSON.stringify({ error: "KV namespace not bound (EVENT_BOOKING_APP)" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { value } = body;

    if (value === undefined) {
      return new Response(JSON.stringify({ error: "Missing 'value' field" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const existingData = await kv.get(KEY);
    let dataArray = [];

    if (existingData) {
      dataArray = JSON.parse(existingData);

      if (!Array.isArray(dataArray)) dataArray = [dataArray];
    }

    dataArray.push(value);

    await kv.put(KEY, JSON.stringify(dataArray));

    return new Response(
      JSON.stringify({
        success: true,
        key: KEY,
        addedItem: value,
        totalItems: dataArray.length,
        url: BASE_URL,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Error in POST /bookings:", err);
    return new Response(
      JSON.stringify({ error: "Invalid JSON body or internal error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
};

export const onRequestGet = async ({ env }: PagesFunctionArgs) => {
  const kv = env.EVENT_BOOKING_APP;

  if (!kv) {
    return new Response(JSON.stringify({ error: "KV namespace not bound" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const value = await kv.get(KEY);

    if (value === null) {
      return new Response(JSON.stringify({ key: KEY, bookings: [] }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const bookings = JSON.parse(value);

    return new Response(
      JSON.stringify({
        key: KEY,
        bookings: bookings,
        count: Array.isArray(bookings) ? bookings.length : 1,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Error in GET /bookings:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};

export const onRequestDelete = async ({ env }: PagesFunctionArgs) => {
  const kv = env.EVENT_BOOKING_APP;

  if (!kv) {
    return new Response(JSON.stringify({ error: "KV namespace not bound" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    await kv.delete(KEY);

    return new Response(
      JSON.stringify({ success: true, message: "Data cleared" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("Error in DELETE /bookings:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
};
