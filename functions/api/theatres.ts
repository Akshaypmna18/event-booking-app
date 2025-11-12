export const onRequestGet = async () => {
  const apps = [
    {
      id: "theatre-1",
      name: "ABC-Multiplex",
      seatLayout: {
        silver: { rows: 3, price: 100 },
        gold: { rows: 3, price: 150 },
        platinum: { rows: 3, price: 200 },
      },
    },
    {
      id: "theatre-2",
      name: "XYZ-Multiplex",
      seatLayout: {
        silver: { rows: 3, price: 100 },
        gold: { rows: 5, price: 150 },
        platinum: { rows: 4, price: 200 },
      },
    },
  ];

  return new Response(JSON.stringify(apps), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // optional: for local dev
      // 🛑 The critical headers to prevent ALL caching
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache", // For backward compatibility with HTTP/1.0
      Expires: "0", // Ensures content is immediately stale
    },
  });
};
