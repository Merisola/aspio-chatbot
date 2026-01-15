export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const response = await fetch(
      "https://chatbotfastapi-production-7dff.up.railway.app/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy failed" });
  }
}
