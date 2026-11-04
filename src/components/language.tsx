import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { canonicalPlace, URDU_PLACES } from "@/data/places";
const URDU: Record<string, string> = {
  "Meet the founder": "بانی سے ملیے",
  "Founder, RastaYaar": "بانی، راستہ یار",
  "Turning everyday commuting challenges into simple digital solutions, one journey at a time. Building a smarter, more accessible public transport experience for Karachi.":
    "روزمرہ کے سفری مسائل کو آسان ڈیجیٹل حل میں بدلنے کی کوشش، ایک سفر سے دوسرے سفر تک۔ کراچی کے لیے عوامی ٹرانسپورٹ کو زیادہ آسان، بہتر اور سب کی پہنچ میں لانے کی کاوش۔",
  Home: "ہوم",
  "Plan Trip": "سفر کی منصوبہ بندی",
  "Bus Routes": "بس روٹس",
  Areas: "علاقے",
  Blogs: "بلاگ",
  Fares: "کرایے",
  "About Us": "ہمارے بارے میں",
  "Contact Us": "رابطہ کریں",
  "Privacy Policy": "رازداری کی پالیسی",
  "Route Disclaimer": "روٹ کی وضاحت",
  "Plan your trip": "اپنے سفر کا راستہ تلاش کریں",
  From: "کہاں سے",
  To: "کہاں تک",
  "Find buses": "بسیں تلاش کریں",
  "Searching…": "تلاش جاری ہے…",
  "Route stops": "روٹ کے اسٹاپ",
  "Connecting buses": "دوسری بسوں سے رابطہ",
  Fare: "کرایہ",
  "Estimated fare:": "اندازاً کرایہ:",
  "Estimated total": "کل اندازاً کرایہ",
  "Stops in travel order": "سفر کی ترتیب میں اسٹاپ",
  "Direct bus": "براہِ راست بس",
  "Change at": "یہاں بس بدلیں",
  changes: "بس کی تبدیلیاں",
  stops: "اسٹاپ",
  buses: "بسیں",
  "Best balance": "بہترین مجموعی راستہ",
  "Lowest fare": "کم کرایہ",
  "Fewest stops": "کم اسٹاپ",
  "Fewest changes": "کم بس تبدیلیاں",
  "Sort journeys": "راستوں کی ترجیح",
  "Last-mile destination (optional)": "آخری منزل (اختیاری)",
  "Check walking distance": "پیدل فاصلہ معلوم کریں",
  "Walking distance": "پیدل فاصلہ",
  meters: "میٹر",
  minutes: "منٹ",
  "Walk or arrange a ride based on your needs.": "اپنی سہولت کے مطابق پیدل جائیں یا سواری لیں۔",
  Clear: "صاف کریں",
  "Popular areas": "مشہور علاقے",
  "Bus numbers": "بس نمبر",
  "Search a Karachi area or bus number": "کراچی کا علاقہ یا بس نمبر تلاش کریں",
  "Type an area — e.g. Sultanabad, Nagan Chorangi, Tower…":
    "علاقہ لکھیں — مثلاً سلطان آباد، ناگن چورنگی، ٹاور…",
  "Plan a trip": "سفر کی منصوبہ بندی",
  "Browse all routes": "تمام روٹس دیکھیں",
  "All routes": "تمام روٹس",
  "← All routes": "تمام روٹس ←",
  All: "تمام",
  "All bus routes": "تمام بس روٹس",
  "Local Bus (Mini Bus & Coach)": "مقامی بس (منی بس اور کوچ)",
  "Search by bus number or stop...": "بس نمبر یا اسٹاپ سے تلاش کریں…",
  "Filter by bus number or stop…": "بس نمبر یا اسٹاپ سے تلاش کریں…",
  "No routes matched that filter.": "اس تلاش کا کوئی روٹ نہیں ملا۔",
  "No routes found. Try another search.": "کوئی روٹ نہیں ملا۔ دوبارہ تلاش کریں۔",
  "Mini Bus": "منی بس",
  "Coach Bus": "کوچ بس",
  "Named Fleet": "مقامی بس سروس",
  "Other Bus": "دیگر بس",
  "Red Bus (Peoples Bus)": "ریڈ بس (پیپلز بس)",
  "EV Bus": "الیکٹرک بس",
  "BRT Line": "بی آر ٹی لائن",
  "Double Decker Bus": "ڈبل ڈیکر بس",
  "Pink Bus (Women-only)": "پنک بس (صرف خواتین کے لیے)",
  Mini: "منی",
  Coach: "کوچ",
  Named: "مقامی",
  Other: "دیگر",
  "Red Bus": "ریڈ بس",
  EV: "الیکٹرک",
  BRT: "بی آر ٹی",
  "Double Decker": "ڈبل ڈیکر",
  "Pink Bus": "پنک بس",
  "Karachi Public Transport": "کراچی پبلک ٹرانسپورٹ",
  "RastaYaar — Karachi Bus Routes": "راستہ یار — کراچی بس روٹس",
  "Bus Routes Karachi – Find Your Bus. Find Your Way.":
    "کراچی کی بسیں — اپنی بس اور اپنا راستہ تلاش کریں۔",
  "Karachi Bus Routes & Public Transport": "کراچی بس روٹس اور پبلک ٹرانسپورٹ",
  "Browse Karachi Bus Routes by Service": "سروس کے لحاظ سے کراچی بس روٹس دیکھیں",
  "Routes mapped": "بس روٹس",
  "Stops & areas": "اسٹاپ اور علاقے",
  "Fleet types": "بسوں کی اقسام",
  "Local fare (Rs.)": "مقامی کرایہ (روپے)",
  "View routes →": "روٹس دیکھیں ←",
  Explore: "مزید دیکھیں",
  Contact: "رابطہ",
  "Fares at a glance": "کرایوں پر ایک نظر",
  "Find Your Bus. Find Your Way. A community route guide for Karachi public transport.":
    "اپنی بس اور اپنا راستہ تلاش کریں۔ کراچی پبلک ٹرانسپورٹ کے لیے ایک عوامی رہنما۔",
  "For public information only. Route details and fares may change.":
    "عوامی معلومات کے لیے۔ روٹس اور کرایے تبدیل ہو سکتے ہیں۔",
  "Route data disclaimer": "روٹ کی معلومات کی وضاحت",
  "About this bus route": "اس بس روٹ کے بارے میں",
  "Community route update": "عوام کی فراہم کردہ روٹ کی معلومات",
  "External search": "ویب پر تلاش",
  "Search Google with AI": "اے آئی کے ذریعے گوگل پر تلاش",
  "Searching the web…": "ویب پر تلاش جاری ہے…",
  Sources: "ذرائع",
  "Google Search suggestions": "گوگل سرچ تجاویز",
  "External information: confirm service and fare before travelling.":
    "بیرونی معلومات: سفر سے پہلے سروس اور کرایے کی تصدیق کریں۔",
  "Web search is temporarily unavailable. Use Google below.":
    "ویب تلاش فی الحال دستیاب نہیں۔ نیچے گوگل استعمال کریں۔",
  "Search Google": "گوگل پر تلاش کریں",
  "No recorded journey connects these places yet.":
    "ان مقامات کے درمیان ابھی کوئی محفوظ راستہ نہیں ملا۔",
  "Enter a Karachi area or landmark. Compare journeys by fare, stops or bus changes.":
    "کراچی کا علاقہ یا اہم مقام لکھیں۔ کرایے، اسٹاپ یا بس تبدیلیوں کے لحاظ سے راستے دیکھیں۔",
  "Route order and fares are estimates from community records. Confirm the boarding point and fare locally.":
    "روٹ کی ترتیب اور کرایے عوامی معلومات پر مبنی اندازے ہیں۔ اسٹاپ اور کرایے کی مقامی طور پر تصدیق کریں۔",
  "Compare with Google Maps Transit": "گوگل میپس پر راستہ دیکھیں",
  "Start typing a place or bus number.": "علاقہ یا بس نمبر لکھیں۔",
  "Distance unavailable; open walking directions for this stop.":
    "فاصلہ دستیاب نہیں؛ اس اسٹاپ سے پیدل راستہ دیکھیں۔",
  "Open walking directions": "پیدل راستہ دیکھیں",
  "Get directions": "راستہ دیکھیں",
  "Return direction": "واپسی کا راستہ",
  "Outbound direction": "جانے کا راستہ",
  "Endpoint information only; full stop sequence pending.":
    "صرف ابتدائی اور آخری مقام دستیاب ہیں؛ مکمل اسٹاپ کی تفصیل ابھی درکار ہے۔",
  "Find bus routes in Karachi by area or destination. Explore Karachi minibuses, coaches, Red Bus, EV Bus, Green Line BRT, and other public transport routes, with estimated fares to help you plan your journey.":
    "کراچی میں علاقے یا منزل کے لحاظ سے بس روٹس تلاش کریں۔ منی بس، کوچ، ریڈ بس، الیکٹرک بس اور گرین لائن سمیت پبلک ٹرانسپورٹ کے راستے اور اندازاً کرایے دیکھیں۔",
  "Explore Karachi bus routes, from traditional minibuses and coaches to double-decker buses, Red Bus, EV Bus and BRT services. Find routes by area or destination and check estimated fares with RastaYaar.":
    "کراچی کی منی بس، کوچ، ڈبل ڈیکر، ریڈ بس، الیکٹرک بس اور بی آر ٹی کے راستے دیکھیں۔ راستہ یار کے ساتھ علاقے یا منزل کے لحاظ سے روٹس اور اندازاً کرایے معلوم کریں۔",
  "Areas & stops": "علاقے اور اسٹاپ",
  "areas, chowrangis, landmarks and stations across Karachi.":
    "کراچی کے علاقے، چورنگیاں، اہم مقامات اور اسٹیشن۔",
  "No area matched that search.": "اس نام کا کوئی علاقہ نہیں ملا۔",
  "← All areas": "تمام علاقے ←",
  "bus route": "بس روٹ",
  "pass through this area.": "اس علاقے سے گزرتے ہیں۔",
  "Buses serving": "یہاں کی بسیں:",
  "routes found in this category.": "روٹس اس زمرے میں ملے۔",
  "Local Bus": "مقامی بس",
  routes: "روٹس",
  across: "میں",
  "stops and areas": "اسٹاپ اور علاقے",
  "Estimated fares for Karachi public transport. Local mini bus and coach fares depend on distance; government services charge a flat fare.":
    "کراچی پبلک ٹرانسپورٹ کے اندازاً کرایے۔ مقامی منی بس اور کوچ کا کرایہ فاصلے پر منحصر ہوتا ہے؛ دوسری سروس کے قواعد مختلف ہو سکتے ہیں۔",
  "routes in this guide": "روٹس اس رہنما میں",
  "How local fares work": "مقامی کرایے کیسے طے ہوتے ہیں",
  "Short hops on mini buses and coaches usually start around Estimated Rs. 30.":
    "منی بس اور کوچ میں کم فاصلے کا اندازاً کرایہ 30 روپے سے شروع ہوتا ہے۔",
  "Long, cross-city journeys on the same buses can reach Estimated Rs. 150.":
    "طویل سفر کے لیے ان بسوں کا اندازاً کرایہ 150 روپے تک ہو سکتا ہے۔",
  "EV Bus is a flat Estimated Rs. 80 regardless of distance.":
    "الیکٹرک بس کا درج اندازاً کرایہ 80 روپے ہے۔",
  "Red Bus (Peoples Bus Service) is Estimated Rs. 80 – 120 depending on the corridor.":
    "ریڈ بس (پیپلز بس) کا درج اندازاً کرایہ روٹ کے مطابق 80 سے 120 روپے ہے۔",
  "Double Decker Bus (DD01) is a flat Estimated Rs. 80.":
    "ڈبل ڈیکر بس کا درج اندازاً کرایہ 80 روپے ہے۔",
  "Fares are estimated and can change; conductors announce the current rate.":
    "یہ اندازاً کرایے ہیں جو تبدیل ہو سکتے ہیں؛ موجودہ کرایہ کنڈکٹر سے معلوم کریں۔",
  "About the RastaYaar": "راستہ یار کے بارے میں",
  "Karachi moves on buses. Now the map moves with you.":
    "کراچی بسوں پر چلتا ہے۔ اب راستہ بھی آپ کے ساتھ ہے۔",
  "RastaYaar collects the city's scattered route knowledge — the kind you usually get by asking a conductor — into one searchable guide covering every service in the city.":
    "راستہ یار کراچی کی بسوں کے بارے میں بکھری ہوئی عوامی معلومات ایک جگہ جمع کرتا ہے تاکہ آپ اپنا راستہ آسانی سے تلاش کر سکیں۔",
  "Why RastaYaar exists": "راستہ یار کیوں بنایا گیا",
  "There has never been a single, simple place to check which bus goes where in Karachi. Route boards are hand-painted, numbers change, and the only reliable source has always been word of mouth. RastaYaar turns that shared knowledge into something you can search in seconds.":
    "کراچی میں بس کے راستے جاننے کے لیے اکثر لوگوں سے پوچھنا پڑتا ہے۔ بس نمبر اور راستے بدل سکتے ہیں۔ راستہ یار اسی مشترکہ معلومات کو چند لمحوں میں تلاش کرنے کی سہولت فراہم کرتا ہے۔",
  "Coverage includes mini buses, coach buses, named fleet routes (Mashriq, Muslim, Marwat, Bilal and more), Red Bus (Peoples Bus Service), Double Decker Bus, EV buses, and the BRT Green and Orange Lines —":
    "اس رہنما میں منی بس، کوچ، مقامی سروسز، ریڈ بس، ڈبل ڈیکر، الیکٹرک بس اور گرین و اورنج لائن شامل ہیں —",
  "The trip planner goes one step further: pick where you are and where you're going, and it works out the direct bus — or the single transfer that gets you there — with the fare you should expect for the whole journey.":
    "سفر پلانر میں اپنی روانگی اور منزل لکھیں؛ براہِ راست بس یا بس بدلنے کے راستے اور پورے سفر کا اندازاً کرایہ دیکھیں۔",
  "What you get": "آپ کے لیے سہولتیں",
  "Every service in the city": "شہر کی بس سروسز",
  "From hand-painted truck-art mini buses to double decker and air-conditioned rapid transit.":
    "روایتی رنگین منی بس سے ڈبل ڈیکر اور ایئرکنڈیشنڈ ٹرانزٹ تک۔",
  "Route data is compiled from the Karachi Public Transport Route Guide and community input, for public information only. Timings, routes and fares can change without notice — please verify with the conductor before travelling.":
    "روٹ کی معلومات کراچی ٹرانسپورٹ گائیڈ اور عوامی تجاویز سے لی گئی ہیں۔ اوقات، روٹس اور کرایے بدل سکتے ہیں؛ سفر سے پہلے تصدیق کریں۔",
  "Report a correction": "درست معلومات بھیجیں",
  "Have questions about a route? Want to report outdated information? We're here to help.":
    "کسی روٹ کے بارے میں سوال یا پرانی معلومات کی درستگی کے لیے ہم سے رابطہ کریں۔",
  Email: "ای میل",
  "Send Email": "ای میل کریں",
  "Page not found": "صفحہ نہیں ملا",
  "Go home": "ہوم پر جائیں",
  "Try again": "دوبارہ کوشش کریں",
  "This page didn't load": "یہ صفحہ نہیں کھل سکا",
  "Something went wrong on our end. You can try refreshing or head back home.":
    "صفحہ کھولنے میں مسئلہ ہوا۔ دوبارہ کوشش کریں یا ہوم پر جائیں۔",
  "The page you're looking for doesn't exist or has been moved.":
    "یہ صفحہ موجود نہیں یا اس کی جگہ بدل گئی ہے۔",
  "Mini bus / coach: Estimated Rs. 30 – 150": "منی بس / کوچ: اندازاً 30 سے 150 روپے",
  "EV Bus / Double Decker: Estimated Rs. 80": "الیکٹرک / ڈبل ڈیکر: اندازاً 80 روپے",
  "Red Bus: Estimated Rs. 80 – 120": "ریڈ بس: اندازاً 80 سے 120 روپے",
  "© 2026 RastaYaar. All rights reserved.": "© 2026 راستہ یار۔ جملہ حقوق محفوظ ہیں۔",
  "Search an area — Sultanabad, Korangi, Banaras…": "علاقہ تلاش کریں — سلطان آباد، کورنگی، بنارس…",
  "No area or bus matched": "کوئی علاقہ یا بس نہیں ملی",
  "Last updated: 2 November 2026": "آخری ترمیم: 2 نومبر 2026",
  "Information you provide": "آپ کی فراہم کردہ معلومات",
  "Analytics and technical information": "تجزیاتی اور تکنیکی معلومات",
  "Maps and external links": "نقشے اور بیرونی روابط",
  "Advertising and cookies": "اشتہارات اور کوکیز",
  "Your choices": "آپ کے اختیارات",
  "Policy updates": "پالیسی میں تبدیلی",
  "Route Data Disclaimer": "روٹ کی معلومات کی وضاحت",
  "To report an incorrect route or suggest a correction, email":
    "غلط روٹ کی اطلاع یا درستگی کے لیے ای میل کریں",
  "and include the route code, stop name and supporting details where possible.":
    "اور ممکن ہو تو بس نمبر، اسٹاپ کا نام اور متعلقہ تفصیلات شامل کریں۔",
  "RastaYaar is an independent public-transport information project. It is not an official government transport service and is not affiliated with Google, IoBM, or any bus operator.":
    "راستہ یار پبلک ٹرانسپورٹ کی معلومات کا ایک آزاد منصوبہ ہے۔ یہ سرکاری ٹرانسپورٹ سروس نہیں اور گوگل، آئی او بی ایم یا کسی بس آپریٹر سے وابستہ نہیں۔",
  "Route records may be incomplete, outdated, misspelled, or based on community-supplied information. A route listed on this site is not a guarantee that the service is currently operating, follows the exact displayed order, or stops at every listed location today.":
    "روٹ کی معلومات نامکمل، پرانی یا عوام کی فراہم کردہ ہو سکتی ہیں۔ درج روٹ سے موجودہ سروس، عین ترتیب یا ہر مقام پر بس کے رکنے کی ضمانت نہیں دی جاتی۔",
  "Fare ranges, stop counts, interchange suggestions and travel order are estimates. We do not currently provide live vehicle tracking or guarantee real-time arrival times. Confirm routes, fares and service availability with operators or local staff before travelling.":
    "کرایے، اسٹاپ کی تعداد، بس بدلنے کے مقامات اور سفر کی ترتیب اندازے ہیں۔ لائیو بس ٹریکنگ یا آمد کے وقت کی ضمانت نہیں۔ سفر سے پہلے مقامی طور پر تصدیق کریں۔",
  "External map and search results are provided by third parties and are not verified by RastaYaar. Their availability and information may differ from the local route database.":
    "بیرونی نقشے اور تلاش کے نتائج دوسری سروسز فراہم کرتی ہیں۔ راستہ یار نے ان کی تصدیق نہیں کی اور یہ مقامی معلومات سے مختلف ہو سکتے ہیں۔",
  "Karachi Red Bus — People's Bus Service": "کراچی ریڈ بس — پیپلز بس سروس",
  "Explore Karachi's Air-conditioned government buses, Red Bus routes R-1 to R-14, connecting major city corridors.":
    "کراچی کی ایئرکنڈیشنڈ پیپلز بس سروس کے ریڈ بس روٹس اور اہم مقامات دیکھیں۔",
  "The city's truck-art mini buses and coaches — the widest network, reaching almost every neighbourhood.":
    "شہر کی روایتی رنگین منی بسیں اور کوچ، جو بہت سے محلوں کو آپس میں ملاتی ہیں۔",
  "Experience Karachi's DD01 double-decker bus service connecting Model Colony and Tower.":
    "ماڈل کالونی اور ٹاور کو ملانے والی کراچی کی ڈبل ڈیکر بس DD01 کے بارے میں جانیں۔",
  "Other City Buses": "شہر کی دیگر بسیں",
  "Classic Bedford truck-art buses and other city routes like 4-L, 9-C, 11-C, 20, 51 and 55.":
    "روایتی بیڈفورڈ بسوں اور شہر کے دیگر روٹس، مثلاً 4-L، 9-C، 11-C، 20، 51 اور 55 کی معلومات۔",
  "EV Bus (Electric Bus Service)": "الیکٹرک بس سروس",
  "Karachi's electric buses on EV-1 to EV-5 linking Malir Cantt, Bahria Town, DHA City and Numaish.":
    "کراچی کی الیکٹرک بسیں، ملیر کینٹ، بحریہ ٹاؤن، ڈی ایچ اے سٹی اور نمائش سمیت اہم علاقوں کو ملاتی ہیں۔",
  "Green Line & Orange Line BRT": "گرین لائن اور اورنج لائن بی آر ٹی",
  "Travel on Karachi's rapid transit network, from Surjani and Orangi towards Guru Mandir and Nagan.":
    "کراچی کے تیز رفتار ٹرانزٹ نیٹ ورک پر سرجانی اور اورنگی سے گرومندر اور ناگن کی سمت سفر کریں۔",
  "Women-only service. Community-supplied endpoints; intermediate stops and current operation need confirmation. Not yet used for trip planning.":
    "صرف خواتین کے لیے سروس۔ ابتدائی اور آخری مقام عوام نے فراہم کیے ہیں؛ درمیانی اسٹاپ اور موجودہ سروس کی تصدیق درکار ہے۔ ابھی سفر پلانر میں شامل نہیں۔",
  "Community-reported NIPA–NED segment only; this is not the complete service route.":
    "عوام کی فراہم کردہ نیپا سے این ای ڈی تک کی معلومات؛ یہ سروس کا مکمل روٹ نہیں۔",
  "Community-reported downtown stop order, including nearby Governor House. Confirm exact boarding locations and direction locally; not a GPS-verified sequence.":
    "شہر کے مرکزی علاقے کے اسٹاپ کی عوام کی فراہم کردہ ترتیب، جس میں قریبی گورنر ہاؤس بھی شامل ہے۔ درست اسٹاپ اور سمت کی مقامی تصدیق کریں؛ جی پی ایس سے تصدیق نہیں ہوئی۔",
  Bus: "بس",
  "Shown on map": "نقشے پر موجود",
  "Coordinate needed": "مقام کے نقاط درکار",
  "Route stops on the map": "نقشے پر روٹ کے اسٹاپ",
  "Stops on this journey": "اس سفر کے اسٹاپ",
  "Open full map ↗": "مکمل نقشہ کھولیں ↗",
  "The RastaYaar Blog": "راستہ یار بلاگ",
  "Better journeys start with better information.": "بہتر معلومات سے بہتر سفر کی شروعات۔",
  "Practical bus guides, Karachi travel tips, and simple advice to help you plan your next trip with more confidence.":
    "کراچی کی بسوں کے رہنما، سفر کی تجاویز اور اپنی منزل تک پہنچنے کے آسان مشورے۔",
  "Latest articles": "تازہ مضامین",
  "Explore and learn": "دیکھیں اور جانیں",
  "helpful reads": "مفید مضامین",
  "🚌 Route guides": "🚌 روٹ گائیڈ",
  "📍 Karachi stops": "📍 کراچی کے اسٹاپ",
  "ROUTE INTELLIGENCE": "راستوں کی رہنمائی",
  "Find a smarter way across Karachi.": "کراچی میں بہتر راستہ تلاش کریں۔",
  "Direct buses, clear transfers, useful stop guidance.":
    "براہِ راست بسیں، آسان تبدیلیاں اور اسٹاپ کی رہنمائی۔",
  "LOCAL KNOW-HOW": "مقامی معلومات",
  "Know the stops before you go.": "روانگی سے پہلے اسٹاپ جانیں۔",
  "Landmarks, campuses and neighbourhood guides.": "اہم مقامات، تعلیمی ادارے اور محلوں کی رہنمائی۔",
  "COMMUTER PLAYBOOK": "مسافر کی رہنمائی",
  "Less guesswork. Better journeys.": "آسان منصوبہ بندی، بہتر سفر۔",
  "Practical explainers made for everyday travel.": "روزمرہ سفر کے لیے عملی معلومات۔",
  Saved: "محفوظ",
  "Saved routes & journeys": "محفوظ روٹس اور سفر",
  "Save for later": "بعد کے لیے محفوظ کریں",
  "Saved — click to remove": "محفوظ ہے — ہٹانے کے لیے کلک کریں",
  "Saved on this browser. Open a journey to check it against the latest route records.":
    "یہ معلومات اسی براؤزر میں محفوظ ہیں۔ تازہ روٹ معلومات دیکھنے کے لیے محفوظ سفر کھولیں۔",
  "Loading saved routes…": "محفوظ روٹس کھولے جا رہے ہیں…",
  "No saved routes yet. Save a bus route or a journey after planning your trip.":
    "ابھی کوئی روٹ محفوظ نہیں۔ بس کا روٹ یا سفر کی منصوبہ بندی کے بعد اپنا سفر محفوظ کریں۔",
  "Open route": "روٹ کھولیں",
  "Open saved journey": "محفوظ سفر کھولیں",
  Remove: "ہٹائیں",
  "Route no longer listed": "یہ روٹ اب فہرست میں موجود نہیں",
  "Saving is unavailable in this browser.": "اس براؤزر میں محفوظ کرنے کی سہولت دستیاب نہیں۔",
  "You can save up to 100 items. Remove one to save another.":
    "آپ 100 اندراج محفوظ کر سکتے ہیں۔ نیا اندراج محفوظ کرنے کے لیے ایک پرانا ہٹائیں۔",
  "Include women-only Pink Bus services": "صرف خواتین کے لیے پنک بس سروس بھی شامل کریں",
  "Pink Bus — Women-only Service": "پنک بس — صرف خواتین کے لیے",
  "Women-only R-1, R-2, R-3, R-9 and R-10 services. Browse their stops and plan a journey.":
    "خواتین کے لیے R-1، R-2، R-3، R-9 اور R-10 سروسز۔ اسٹاپ دیکھیں اور سفر کی منصوبہ بندی کریں۔",
  "Women-only service. Stop sequence copied from the same-numbered Red Bus route as instructed by the project owner; confirm current service and boarding points locally.":
    "صرف خواتین کے لیے۔ مالک کی ہدایت کے مطابق اسی نمبر کی ریڈ بس کے اسٹاپ شامل کیے گئے ہیں؛ موجودہ سروس اور اسٹاپ کی مقامی تصدیق کریں۔",
  "Save Bus": "بس محفوظ کریں",
  "Bus Saved": "بس محفوظ ہوگئی",
  "Bus Saved — click to remove": "بس محفوظ ہے — ہٹانے کے لیے کلک کریں",
  "Main navigation": "مرکزی مینو",
  Founder: "بانی",
  "Visit RastaYaar on Facebook": "فیس بک پر راستہ یار دیکھیں",
  "Green Line BRT — Green Bus Routes": "گرین لائن بی آر ٹی — گرین بس روٹس",
  "Orange Line BRT": "اورنج لائن بی آر ٹی",
  "Browse Green Line BRT stations and compare green bus routes with other Karachi public transport services.":
    "گرین لائن بی آر ٹی کے اسٹیشن دیکھیں اور کراچی کی دیگر پبلک ٹرانسپورٹ کے ساتھ راستوں کا موازنہ کریں۔",
  "Explore Orange Line stations and the recorded connections between Orangi Town and Nagan Chorangi.":
    "اورنگی ٹاؤن اور ناگن چورنگی کے درمیان اورنج لائن کے درج اسٹیشن اور رابطے دیکھیں۔",
  "Search by your area": "اپنے علاقے سے تلاش کریں",
  "Complete stop lists": "درج اسٹاپ کی فہرست",
  "Honest fare ranges": "واضح اندازاً کرایے",
  "Built for everyday riders": "روزمرہ کے مسافروں کے لیے",
  "Type Sultanabad, Nagan Chorangi or Korangi Crossing and see every bus that stops there — mini bus, Red Bus, EV or BRT together in one list.":
    "سلطان آباد، ناگن چورنگی یا کورنگی کراسنگ لکھیں اور اس جگہ کی درج منی بس، ریڈ بس، الیکٹرک بس اور بی آر ٹی معلومات ایک فہرست میں دیکھیں۔",
  "Each route page shows the full stop sequence end to end, so you know exactly where to board and where to get off.":
    "ہر روٹ کے صفحے پر درج اسٹاپ کی ترتیب دیکھ کر بس میں سوار ہونے اور اترنے کی جگہ معلوم کریں۔",
  "Local mini bus and coach Estimated Rs. 30 – 150, EV Bus and Double Decker Estimated Rs. 80, Red Bus Estimated Rs. 80 – 120 — so nobody overcharges you.":
    "منی بس اور کوچ کا درج اندازاً کرایہ 30 سے 150 روپے، الیکٹرک اور ڈبل ڈیکر کا 80 روپے، اور ریڈ بس کا 80 سے 120 روپے ہے۔ موجودہ کرایے کی تصدیق کریں۔",
  "Students, workers and visitors who just need one clear answer: which bus goes there, and what will it cost?":
    "طلبہ، ملازمین اور نئے آنے والے آسانی سے جان سکیں کہ کون سی بس منزل تک جاتی ہے اور اندازاً کتنا کرایہ ہوگا۔",
  "Browse by service": "سروس کے لحاظ سے دیکھیں",
  "Community-reported downtown sequence and N-5 Metropole boarding connection. Confirm the stop and direction locally.":
    "عوام کی فراہم کردہ مرکزی علاقے کے اسٹاپ اور این 5 کے میٹروپول اسٹاپ کی معلومات۔ درست اسٹاپ اور سمت کی مقامی تصدیق کریں۔",
  "Last updated: 3 November 2026": "آخری ترمیم: 3 نومبر 2026",
};
type Language = "en" | "ur";
const Context = createContext({
  language: "en" as Language,
  setLanguage: (_: Language) => {},
  t: (s: string) => s,
  place: (s: string | undefined) => s ?? "",
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  useEffect(() => {
    try {
      if (localStorage.getItem("rastayaar-language") === "ur") setLanguage("ur");
    } catch {
      // Language preference storage may be unavailable in restricted browser contexts.
    }
  }, []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ur" ? "rtl" : "ltr";
    try {
      localStorage.setItem("rastayaar-language", language);
    } catch {
      // Language preference storage may be unavailable in restricted browser contexts.
    }
  }, [language]);
  const t = (s: string) => {
    if (language !== "ur") return s;
    if (/^Estimated Rs\./.test(s)) return s.replace("Estimated Rs.", "اندازاً") + " روپے";
    return URDU[s.trim()] ?? s;
  };
  const place = (s: string | undefined) =>
    !s ? "" : language === "ur" ? (URDU_PLACES[canonicalPlace(s)] ?? s) : s;
  return (
    <Context.Provider value={{ language, setLanguage, t, place }}>{children}</Context.Provider>
  );
}
export const useLanguage = () => useContext(Context);
export function T({ children }: { children: string }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
}
