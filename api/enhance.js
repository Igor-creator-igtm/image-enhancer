import OpenAI from "openai";

export const config = {
api: {
bodyParser: false,
},
};

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).send("Method not allowed");
}

try {
// Prikupljamo raw podatke iz requesta (slika)
const chunks = [];
for await (const chunk of req) {
chunks.push(chunk);
}
const buffer = Buffer.concat(chunks);

```
// OpenAI obrada slike
const result = await openai.images.edits({
  model: "gpt-image-1",
  image: buffer,
  prompt: `
```

Enhance this photo into a natural, high-end professional DSLR image.

Preserve identity and keep all people exactly the same.
Maintain real expressions and the original moment.

Improve lighting, clarity and contrast while keeping natural light direction.
Apply shallow depth of field (f1.8 look) with a soft, realistic background.

Keep natural skin texture and realistic colors.
Make only subtle, realistic improvements without altering composition.

Avoid overprocessing, HDR, oversharpening, artificial effects or distortion.
Make improvements clearly visible but still realistic.

Do not change the person's face structure or identity in any way.
`,
});

```
// Base64 → slika
const image_base64 = result.data[0].b64_json;
const image_bytes = Buffer.from(image_base64, "base64");

// Vraćamo sliku frontend-u
res.setHeader("Content-Type", "image/png");
res.send(image_bytes);
```

} catch (err) {
console.error(err);
res.status(500).send("Error processing image");
}
}
