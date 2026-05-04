export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // uzimamo test sliku sa interneta
    const response = await fetch("https://via.placeholder.com/512");

    const buffer = await response.arrayBuffer();

    // vraćamo kao sliku
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(buffer));

  } catch (err) {
    console.error(err);
    res.status(500).send("Test error");
  }
}
