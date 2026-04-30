export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, service, budget, message } = req.body;

  const BOT_TOKEN = "8571773640:AAEYd6oOMqOVEniDuA_sRDTEXFDv0I8-4wg";
  const CHAT_ID = "7339903920";

  const text = `
📩 Nová poptávka:

👤 Jméno: ${name}
📧 Email: ${email}
📱 Telefon: ${phone}
🛠️ Služba: ${service}
💰 Rozpočet: ${budget} Kč

📝 Zpráva:
${message}
`;

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Failed to send" });
  }
}
