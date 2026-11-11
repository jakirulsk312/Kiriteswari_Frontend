import { apiRequest } from "@/lib/api";

type NotificationConfig = {
  data?: {
    web3formsAccessKey?: string;
  };
};

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
};

export async function sendAdminNotification({
  subject,
  message,
  replyTo,
}: {
  subject: string;
  message: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const config = await apiRequest<NotificationConfig>("/notifications/config");
    const accessKey = config.data?.web3formsAccessKey;

    if (!accessKey) {
      console.warn("Admin email notification skipped: WEB3FORMS_ACCESS_KEY is not configured.");
      return false;
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        from_name: "Kiriteswari Temple Website",
        ...(replyTo ? { email: replyTo, replyto: replyTo } : {}),
        subject,
        message,
        botcheck: "",
      }),
    });

    const responseText = await response.text();
    let result: Web3FormsResponse;
    try {
      result = JSON.parse(responseText) as Web3FormsResponse;
    } catch {
      console.error(
        `Admin email notification failed: Web3Forms returned a non-JSON response (HTTP ${response.status}, ${response.headers.get("content-type") || "unknown content type"}).`
      );
      return false;
    }

    if (!response.ok || result.success !== true) {
      console.error(
        `Admin email notification failed (HTTP ${response.status}):`,
        result.message || "Web3Forms rejected the notification."
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Admin email notification failed:", error);
    return false;
  }
}
