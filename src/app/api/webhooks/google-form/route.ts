export async function POST(req: Request) {
  const timestamp = new Date().toISOString();
  const body = await req.json();

  const formData = {
    formId: body.formId,
    formTitle: body.formTitle,
    responseId: body.responseId,
    timestamp: body.timestamp,
    respondentEmail: body.respondentEmail,
    responses: body.responses,
    raw: body,
  };
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log(
    "║                   🎣 WEBHOOK ENDPOINT CALL                  ║",
  );
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║ 📍 Endpoint:  POST /api/webhooks/google-form               ║`);
  console.log(`║ ⏰ Timestamp: ${timestamp.padEnd(36)}║`);
  console.log(`║ 📊 Method:    ${req.method.padEnd(41)}║`);
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\n");
  console.log("📨 Request Body:");
  console.log(formData);
  console.log("\n");

  return Response.json(
    {
      message: "Data received successfully",
    },
    { status: 200 },
  );
}

export async function GET(req: Request) {
  const timestamp = new Date().toISOString();

  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log(
    "║                   🎣 WEBHOOK ENDPOINT CALL                  ║",
  );
  console.log("╠════════════════════════════════════════════════════════════╣");
  console.log(`║ 📍 Endpoint:  GET /api/webhooks/google-form                ║`);
  console.log(`║ ⏰ Timestamp: ${timestamp.padEnd(36)}║`);
  console.log(`║ 📊 Method:    ${req.method.padEnd(41)}║`);
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\n");

  return Response.json(
    {
      message: "Data retrieved successfully",
    },
    { status: 200 },
  );
}
