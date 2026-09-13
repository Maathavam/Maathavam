import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ── Simple in-memory rate limiter (per IP, 20 req/min) ───────────────────────
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

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

const MAX_MSG_LENGTH = 1000; // characters per message
const MAX_HISTORY = 20;      // max messages to send as context

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    const { messages } = await req.json() as {
      messages: { role: "user" | "model"; parts: { text: string }[] }[];
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    // Validate last message length
    const lastText = messages[messages.length - 1]?.parts?.[0]?.text ?? "";
    if (lastText.length > MAX_MSG_LENGTH) {
      return NextResponse.json(
        { error: "Message too long. Please keep it under 1000 characters." },
        { status: 400 }
      );
    }

    // Cap history size to avoid huge payloads
    const cappedMessages = messages.slice(-MAX_HISTORY);

    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini requires history to start with a 'user' message.
    // Strip the synthetic welcome (role: model) and any leading model messages.
    const allButLast = cappedMessages.slice(0, -1);
    const firstUserIdx = allButLast.findIndex((m) => m.role === "user");
    const history = firstUserIdx >= 0 ? allButLast.slice(firstUserIdx) : [];

    const chat = model.startChat({ history });

    const lastMessage = cappedMessages[cappedMessages.length - 1];
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
