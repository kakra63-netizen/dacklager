// Cloudflare Pages Function: /api/ocr
// API-nyckeln ska sparas som en hemlighet i Cloudflare.
export async function onRequestPost({ request, env }) {
  try {
    if (!env.GOOGLE_CLOUD_VISION_API_KEY) {
      return Response.json(
        { error: "OCR inte konfigurerad: ange GOOGLE_CLOUD_VISION_API_KEY i Cloudflare Pages-inställningarna." },
        { status: 503 }
      );
    }

    const body = await request.json();

    if (!body || typeof body.image !== "string" ||
        !body.image.startsWith("data:image/")) {
      return Response.json({ error: "Ogiltig bild." }, { status: 400 });
    }

    if (body.image.length > 12000000) {
      return Response.json(
        { error: "Bilden är för stor. Välj en mindre bild." },
        { status: 413 }
      );
    }

    const match = body.image.match(
      /^data:(image\/(?:jpeg|png|webp|gif|bmp));base64,([\s\S]+)$/i
    );

    if (!match) {
      return Response.json(
        { error: "Bildformat stöds inte. Använd JPEG eller PNG." },
        { status: 400 }
      );
    }

    const apiResponse = await fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=" +
        encodeURIComponent(env.GOOGLE_CLOUD_VISION_API_KEY),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [{
            image: { content: match[2] },
            features: [{
              type: "DOCUMENT_TEXT_DETECTION",
              maxResults: 1
            }],
            imageContext: { languageHints: ["en"] }
          }]
        })
      }
    );

    const result = await apiResponse.json();

    if (!apiResponse.ok) {
      return Response.json(
        { error: "OCR-leverantören returnerade ett fel. Kontrollera API-nyckel, fakturering och kvot." },
        { status: 502 }
      );
    }

    const item = result.responses && result.responses[0];

    if (item && item.error) {
      return Response.json(
        { error: item.error.message || "OCR misslyckades." },
        { status: 502 }
      );
    }

    const text = item && item.fullTextAnnotation
      ? item.fullTextAnnotation.text
      : ((item && item.textAnnotations && item.textAnnotations[0])
          ? item.textAnnotations[0].description
          : "");

    return Response.json(
      { text: text || "" },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    return Response.json(
      { error: "Kunde inte bearbeta bilden. Kontrollera bildformat och försök igen." },
      { status: 500 }
    );
  }
}
