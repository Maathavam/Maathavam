// ─────────────────────────────────────────────────────────────────────────────
// data/events.ts
// ─────────────────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  name: string;
  nameTamil: string;
  image: string;
  description: string;
  descriptionTamil: string;
  date?: string;
  dateTamil?: string;
  details: string;
  detailsTamil: string;
}

export const events: Event[] = [
  {
    id: "barathi-vizha",
    name: "Barathi Vizha",
    nameTamil: "பாரதி விழா",
    image: "/images/events/kalaignan.jpg",
    description:
      "A celebration honouring the great Tamil poet Subramania Bharathi — with recitation, drama, and song.",
    descriptionTamil:
      "மகாகவி சுப்பிரமணிய பாரதியாரின் நினைவைப் போற்றும் கவிதை, நாடகம், இசை நிகழ்வு.",
    date: "December 11, 2025",
    dateTamil: "டிசம்பர் 11, 2025",
    details: `Barathi Vizha is our annual tribute to Mahakavi Subramania Bharathi — the revolutionary Tamil poet who used verse as a weapon of freedom and social reform.

Events include:
• Bharathi kavithai araṅkēṟṟam — recitation of his iconic poems
• One-act drama based on his life and works
• Patriotic Tamil songs composed by Bharathi performed by students
• Essay competition: "Bharathi's Vision and Modern Tamil Youth"
• Bharathi paṭa kaṇkāṭci — exhibition on his life, writings, and legacy

Bharathi's words continue to ignite hearts across generations. This festival keeps that flame alive on our campus.`,
    detailsTamil: `பாரதி விழா என்பது மகாகவி சுப்பிரமணிய பாரதியாரை நினைவு கூரும் ஆண்டு விழாவாகும். சுதந்திரத்திற்காகவும் சமூக சீர்திருத்தத்திற்காகவும் கவிதையை ஆயுதமாக்கிய அந்த மாபெரும் கவிஞரை மாதவம் வணங்குகிறது.

நிகழ்வுகள்:
• பாரதி கவிதை அரங்கேற்றம்
• பாரதியின் வாழ்க்கையை அடிப்படையாகக் கொண்ட ஓரங்க நாடகம்
• பாரதி இயற்றிய தேசியப் பாடல்கள்
• கட்டுரைப் போட்டி: "பாரதியின் கனவும் இன்றைய தமிழ் இளையோரும்"
• பாரதி படக் கண்காட்சி

பாரதியின் வார்த்தைகள் தலைமுறை தாண்டி இதயங்களில் தீ மூட்டுகின்றன. அந்தத் தீயை எங்கள் வளாகத்தில் ஓங்கி எரியச் செய்வதே இவ்விழாவின் நோக்கம்.`,
  },
  {
    id: "pongal-vizha",
    name: "Pongal Vizha",
    nameTamil: "பொங்கல் விழா",
    image: "/images/events/pongal.jpg",
    description:
      "A grand celebration of the Tamil harvest festival with traditional rituals, kolam competition, and cultural performances.",
    descriptionTamil:
      "தமிழரின் பெரும் திருநாளான தைப்பொங்கலை பாரம்பரிய சடங்குகள், கோலப் போட்டி, கலாச்சார நிகழ்வுகளுடன் கொண்டாடும் திருவிழா.",
    date: "January 14, 2026",
    dateTamil: "ஜனவரி 14, 2026",
    details: `Pongal Vizha celebrates Tai Pongal — the Tamil harvest festival of gratitude and new beginnings.

The event features:
• Traditional pongal cooking ceremony with clay pots and sugarcane
• Intricate kolam competition with cash prizes
• Folk dance performances including Kummi and Karakattam
• Photography competition themed around Tamil village life
• Cultural quiz on Tamil traditions and harvest festivals

The event brings together students and faculty, transforming the campus into a vibrant Tamil village for the day.`,
    detailsTamil: `பொங்கல் விழா, தைப்பொங்கலை — தமிழரின் அறுவடைத் திருநாளை — சிறப்பாகக் கொண்டாடுகிறது.

நிகழ்வுகள்:
• மண்பானையில் பாரம்பரிய பொங்கல் வைத்தல்
• கோலப் போட்டி — பரிசுத் தொகையுடன்
• கும்மி, கரகாட்டம் உள்ளிட்ட நாட்டுப்புறக் கலை நிகழ்வுகள்
• தமிழ் கிராம வாழ்க்கை தொடர்பான புகைப்படப் போட்டி
• தமிழ் மரபுகள் பற்றிய கலாச்சார வினாடி வினா

இந்நிகழ்வு மாணவர்கள் மற்றும் ஆசிரியர்களை ஒருங்கிணைத்து, வளாகத்தை ஒரு நாளைக்கு சிறு தமிழ் கிராமமாக மாற்றுகிறது.`,
  },
  {
    id: "muthamizh-vizha",
    name: "Muthamizh Vizha",
    nameTamil: "முத்தமிழ் விழா",
    image: "/images/events/thirukkural.jpg",
    description:
      "A grand festival celebrating all three branches of Tamil — Iyal (literature), Isai (music), and Nadagam (drama).",
    descriptionTamil:
      "இயல், இசை, நாடகம் என முத்தமிழின் மூன்று கிளைகளையும் ஒருங்கே கொண்டாடும் மாபெரும் திருவிழா.",
    date: "March 21, 2026",
    dateTamil: "மார்ச் 21, 2026",
    details: `Muthamizh Vizha celebrates the three glorious branches of Tamil — Iyal (literature), Isai (music), and Nadagam (drama) — collectively known as Muthamizh.

Events include:
• Iyal — Tamil literature: poetry composition, short story contest, Thirukkural recitation
• Isai — Tamil music: Carnatic vocal, folk song, and instrument competitions
• Nadagam — Tamil drama: one-act play competition and mime performance
• Seminar by eminent Tamil scholars on the unity of Muthamizh
• Award ceremony honouring outstanding contributors to Tamil arts

This festival embodies the full richness of Tamil cultural expression and is Maathavam's grandest annual event.`,
    detailsTamil: `முத்தமிழ் விழா, தமிழின் மூன்று பெருங்கிளைகளான இயல், இசை, நாடகம் ஆகியவற்றை ஒருங்கே கொண்டாடும் விழாவாகும்.

நிகழ்வுகள்:
• இயல் — கவிதை இயற்றல், சிறுகதைப் போட்டி, திருக்குறள் முற்றோதல்
• இசை — கர்நாடக இசை, நாட்டுப்புற இசை, கருவி இசைப் போட்டிகள்
• நாடகம் — ஓரங்க நாடகப் போட்டி, மாவட்டரங்க நிகழ்வு
• தமிழ் அறிஞர்களால் முத்தமிழ் ஒற்றுமை பற்றிய கருத்தரங்கு
• தமிழ் கலைகளுக்கு சிறந்த பங்களிப்பு செய்தோரை கௌரவிக்கும் விருதுவழங்கல்

இவ்விழா மாதவத்தின் மிகப் பெரிய ஆண்டு விழாவாகும்.`,
  },
];
