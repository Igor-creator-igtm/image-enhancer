import OpenAI from "openai";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // uzmi fajl iz requesta kao blob
    const arrayBuffer = await new Response(req).arrayBuffer();

    const result = await client.images.generate({
      model: "gpt-image-1",
      prompt: `
Enhance this photo into a natural, high-end professional DSLR image.

Preserve identity and keep all people exactly the same.
Maintain real expressions and the original moment.

Improve lighting, clarity and contrast while keeping natural light direction.
Apply shallow depth of field (f1.8 look) with a soft, realistic background.

Keep natural skin texture and realistic colors.
Make only subtle, realistic improvements without altering composition.

Avoid overprocessing, HDR, oversharpening, artificial effects or distortion.
Make improvements clearly visible but still realistic.
      `,
      size: "1024x1024",
      // OVDE prosleđujemo sliku
      image: arrayBuffer,
    });

    const image_base64 = result.data[0].b64_json;
    const image_bytes = Buffer.from(image_base64, "base64");

    res.setHeader("Content-Type", "image/png");
    res.send(image_bytes);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).send("Server error");
  }
}
