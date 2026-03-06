import type { AdminChangeRequest } from "@/lib/models"

export async function sendSlackAdminChangeRequestNotification(
  payload: AdminChangeRequest
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) {
    return
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  const textLines = [
    `New admin change request: ${payload.title}`,
    `Request ID: ${payload.id}`,
    `Priority: ${payload.priority}`,
    `Description: ${payload.description}`,
    `Created: ${payload.createdAt}`,
    `Review: ${appUrl}/admin`,
  ]

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: textLines.join("\n") }),
  })
}
