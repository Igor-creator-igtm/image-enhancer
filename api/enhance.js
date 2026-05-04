import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function parseForm(req) {
  const form = formidable({ multiples: false });
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const { files } = await parseForm(req);

    const file = files.image;
    if (!file) {
      return res.status(400).send("No image uploaded");
    }

    const stream = fs.createReadStream(file.filepath);

    const result = await client.images.edits({
      model: "gpt-image-1",
      image: stream,
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
    });

    const image_base64 = result.data[0].b64_json;
    const image_bytes = Buffer.from(image_base64, "base64");

    res.setHeader("Content-Type", "image/png");
    res.send(image_bytes);

  } catch (err) {
    console.error("RUNTIME ERROR:", err);
    res.status(500).send("Server error");
  }
}
