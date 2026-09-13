import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `You are the official assistant for மாதவம் (Maathavam), a Tamil cultural association at a college campus in India.

About Maathavam:
- மாதவம் means "penance" or "devotion" — symbolising deep dedication to Tamil culture and arts
- We celebrate and preserve Tamil language, literature, music, dance, drama and traditions
- We organise cultural events throughout the academic year for students and faculty
- Our philosophy is rooted in the classical Tamil concept of Aindu Nilam (five lands: Kurinji, Mullai, Marudam, Neithal, Paalai)

Our Major Events:
- பாரதி விழா (Barathi Vizha) — Annual tribute to Mahakavi Subramania Bharathi with poetry, drama and song (December)
- பொங்கல் விழா (Pongal Vizha) — Grand celebration of the Tamil harvest festival with kolam, folk arts, traditional cooking (January/Tai)
- முத்தமிழ் விழா (Muthamizh Vizha) — Grand celebration of Iyal (literature), Isai (music), Nadagam (drama) — our biggest annual event (March)

How to Join / Contact:
- Visit the Contact page on our website for coordinator details
- All students of the college can participate in Maathavam events

Language policy:
- Always respond in the same language the user writes in
- If they write in Tamil, respond fully in Tamil
- If they write in English, respond in English
- If they mix both, respond in Tamil with English where needed
- Be warm, respectful and culturally aware
- Use Tamil greetings like "வணக்கம்!" when appropriate
- Keep responses concise and helpful
- If asked something you don't know (like specific event dates not mentioned above), say the admin updates events regularly and they should check the Events page

Do NOT make up specific dates, fees, or contact information you don't have. Direct them to the website pages instead.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: { role: "user" | "model"; parts: { text: string }[] }[];
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini requires history to start with a 'user' message.
    // We strip the synthetic welcome (role: model) and any other
    // leading model messages before passing history.
    const allButLast = messages.slice(0, -1);
    const firstUserIdx = allButLast.findIndex((m) => m.role === "user");
    const history = firstUserIdx >= 0 ? allButLast.slice(firstUserIdx) : [];

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (err: unknown) {
    console.error("[chat] Gemini error:", err);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
