export type RouteCategory =
  "mini_bus" | "named_route" | "other" | "coach" | "red_bus" | "ev_bus" | "brt" | "double_decker";

export interface BusRoute {
  code: string;
  slug: string;
  category: RouteCategory;
  stops: string[];
}

export const CATEGORY_META: Record<
  RouteCategory,
  { label: string; short: string; fare: string; token: string }
> = {
  mini_bus: { label: "Mini Bus", short: "Mini", fare: "Estimated Rs. 30 – 150", token: "cat-mini" },
  coach: { label: "Coach Bus", short: "Coach", fare: "Estimated Rs. 30 – 150", token: "cat-coach" },
  named_route: {
    label: "Named Fleet",
    short: "Named",
    fare: "Estimated Rs. 30 – 150",
    token: "cat-named",
  },
  other: { label: "Other Bus", short: "Other", fare: "Estimated Rs. 30 – 150", token: "cat-other" },
  red_bus: {
    label: "Red Bus (Peoples Bus)",
    short: "Red Bus",
    fare: "Estimated Rs. 80 – 120",
    token: "cat-red",
  },
  ev_bus: { label: "EV Bus", short: "EV", fare: "Estimated Rs. 80", token: "cat-ev" },
  brt: { label: "BRT Line", short: "BRT", fare: "Estimated Rs. 80 – 120", token: "cat-brt" },
  double_decker: {
    label: "Double Decker Bus",
    short: "Double Decker",
    fare: "Estimated Rs. 80",
    token: "cat-double-decker",
  },
};

export const CATEGORY_ORDER: RouteCategory[] = [
  "mini_bus",
  "coach",
  "named_route",
  "other",
  "red_bus",
  "ev_bus",
  "brt",
  "double_decker",
];

const s = (t: string) =>
  t
    .split("·")
    .map((x) => x.trim())
    .filter(Boolean);

export const slugify = (v: string) =>
  v
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const raw: Array<{ code: string; category: RouteCategory; stops: string }> = [
  // ---------------- MINI BUS ----------------
  {
    code: "A-3",
    category: "mini_bus",
    stops:
      "New Sabzi Mandi · Al-Asif Square · Scout Colony · Maskan · Disco Bakery · Gulshan Chorangi · NIPA Chorangi · Urdu College · Hasan Square · Essa Nagri · Ghareebabad · Liaqatabad 10 · No.4 · Petrol Pump · Nazimabad 2 · Habib Bank · Ghani Chorangi · Sher Shah · Gulbai Chowk · Machar Colony · Agrah Taj · IC · Kharadar · Tower · West Wharf · Dockyard",
  },
  {
    code: "A-25",
    category: "mini_bus",
    stops:
      "Abdullah Gabol Goth · New Sabzi Mandi · Punjab Adda · Al-Asif Square · Sohrab Goth · Water Pump · Ayesha Manzil · Karimabad · Liaqatabad 10 · No.4 · Petrol Pump · Nazimabad 2 · Habib Bank · Valika · Site Thana · Labour Square · Rasheedabad · Muhajir Camp 7 · 19/D · Roobi Cinema · Mwach Goth · Naval Colony · Yousaf Goth",
  },
  {
    code: "C-1",
    category: "mini_bus",
    stops:
      "Sadar · Lucky Star · Reejant Plaza · Jinnah Hospital · Kala Pul · Defence Mor · Akhtar Colony · Qayoomabad · Godam Chorangi · Chamra Chorangi · Veta Chorangi · Bilal Colony · Bilal Chorangi · Singer Chorangi · K Area · Darul-Uloom · 36-B · Zamanabad · Landhi 4 · Babar Market · 89 · Dawood Chorangi · Quaidabad · Manzil Pump · Bhens Colony Mor · Shah Lateef Town · Abdullah Goth",
  },
  {
    code: "D-1",
    category: "mini_bus",
    stops:
      "Gulshan Hadeed · Bacha Jail · Manzil Pump · Quaidabad · Maleer 15 · Kala Board · Maleer Halt · Airport · Star Gate · Colony Gate · Natha Khan · Drigh Road · Karsaz · National Stadium · Hasan Square · Liaqatabad 10 · No.4 · Petrol Pump · Nazimabad 2 · Habib Bank · Habib Chorangi · Frontier Mor · Metrovils · Frontier Colony · Mominabad · Abidabad · Dawood Goth · Baldia",
  },
  {
    code: "D-7",
    category: "mini_bus",
    stops:
      "Landhi Majeed Colony 2 · Muzafarabad Colony · Social Security Hospital · Gul Ahmed Textile · Dawood Chorangi · Quaidabad · Maleer 15 · Kala Board · Maleer Halt · Airport · Star Gate · Colony Gate · Natha Khan · Drigh Road · Labour Camp · Johar Mor · Aladeen · NIPA Chorangi · Gulshan Chorangi · Fazal Mil/Lucky One · Sohrab Goth · Al-Asif Square · Punjab Adda · New Sabzi Mandi",
  },
  {
    code: "D-11",
    category: "mini_bus",
    stops:
      "Qayoomabad · Bilal Chorangi · Chamra Chorangi · Sharafi Goth · Mills Area · Mensehra Colony · Dawood Chorangi · Quaidabad · Maleer 15 · Kala Board · Maleer Halt · Airport · Star Gate · Colony Gate · Natha Khan · Drigh Road · Karsaz · National Stadium · Hasan Square · Ghareebabad · Liaqatabad 10 · No.4 · Petrol Pump · Nazimabad 2 · Habib Bank · Valika · Site Police Station · College Mor · Labour Square · Rasheedabad · 19-D · Nayi Abadi 8,9 · Khaibar Chowk · Itihad Town",
  },
  {
    code: "F-11",
    category: "mini_bus",
    stops:
      "Bhens Colony · Gul Ahmed · Dawood Chorangi · Landhi 1 · Korangi · No.6 · 5½ · 5 · 3 · 1 · Crossing · Qayoomabad · Akhtar Colony · Defence Mor · Kala Pul · Gora Qabristan · Nursery · Tariq Road · Jail Chorangi · Askari Park · Hasan Square · Urdu College · NIPA Chorangi · Gulshan Chorangi · Fazal Mil/Lucky One · KMC Cardio Hospital · Water Pump · Gulberg · Piyala Hotel · Peoples Chorangi · DC Office · Sakhi Hasan · Qalandaria Chowk · Nusrat Bhutto Colony · Mianwali Colony · Naya Nazimabad · Pakhtunabad · Garam Chashma · Chungi Stop",
  },
  {
    code: "G-3",
    category: "mini_bus",
    stops:
      "Sachal Goth · Marora Goth · Safora Goth · Mosmiat · University · Safari Park · NIPA Chorangi · Urdu College · Hasan Square · Askari Park · New Town · Jail Chorangi · Jamshed Road · Guromandar · Numaish · Taj Complex · Sadar · Reegal · Burns Road · Civil Hospital · Light House · City Court · Boulton Market · Tower · Khoja Jamat Khana · Agrah Taj · Machar Colony · Gulbai · Sher Shah · Muhajir Camp 8½",
  },
  {
    code: "G-7",
    category: "mini_bus",
    stops:
      "Gulshan Ghazi · Nayi Abadi · Muhajir Camp 7,8 · Sher Shah · Gulbai · Machar Colony · Agrah Taj · Tower · Jama Cloth · Plaza · Numaish · Khudad Colony · Khalid Bin Waleed Road · Bahadurabad · Jail Chorangi · New Town · Askari Park · Hasan Square · Urdu College · NIPA Chorangi · Safari Park · University · Mosmiat · DOW Ojha Campus · Madras Chowk",
  },
  {
    code: "G-11",
    category: "mini_bus",
    stops:
      "Yousaf Goth · Itihad Town · New Saeedabad · Hub River Road · Philips · Poly Technic · Site Police Station · Bhawani Chali · Frontier Mor · Badar Chowk · Orangi 4,5 · Metro · Banaras · Abdullah College · Board Office · KDA · Ziauddin Hospital · Musa Colony · Karimabad · Ayesha Manzil · Water Pump · KMC Cardio Hospital · Fazal Mil · Gulshan Chorangi · NIPA · Safari Park · Johar Chorangi · Pehlwan Goth · Trauma Center · Kiran Hospital",
  },
  {
    code: "G-17",
    category: "mini_bus",
    stops:
      "Mwach Goth · Rubi Mor · Saeedabad · Pareshan Chowk · Faqeer Colony 10 · Badar Chowk 4,5 · Bacha Khan Chowk · Abdullah College · Board Office · Hydri · Sakhi Hasan · Nagan Chorangi · Shafique Mor · Sohrab Goth · Al-Asif Square · Scout Colony · Abul-Hasan Asfahani Road · Safari Park · University · Saforah Goth · Gul City",
  },
  {
    code: "G-19",
    category: "mini_bus",
    stops:
      "Chungi Stop · Garam Chashma · Manghopir · Kawari Colony · Qasba Mor · Banaras · Valika · Habib Bank · Bara Board · Golimar · Khamosh Colony · Dak Khana · Liaqatabad 10 · Ghareebabad · Hasan Square · Urdu College · NIPA · Aladeen · Johar Mor · Johar Chorangi · Rabia City · Pehlwan Goth · Gul City · Mosmiat · DOW Ojha Campus · Madras Chowk",
  },
  {
    code: "G-27",
    category: "mini_bus",
    stops:
      "Safoora Chorangi · PIA Society · Pehlwan Goth · Habib University · Johar Chorangi · Continental Bakery · Safari Park · NIPA Chorangi · Gulshan Chorangi · Fazal Mill · Sohrab Goth · Shafique Mor · Bufferzone · Peoples Chorangi · Dental College · Landi Kotal · Ziauddin Hospital · KDA · Board Office · Abdullah College · Urdu Chowk · L Block · Jamia Mehmoodia Orangi · Eid Gah Mor · Hub River Road",
  },
  {
    code: "H",
    category: "mini_bus",
    stops:
      "Lee Market · Pan Mandi · Civil Hospital · Sindh Secretariat · High Court · Press Club · Zainab Market · Lucky Star · Sadar · Rejant Plaza · Jinnah Hospital · Kala Pul · Defence Mor · Akhtar Colony · Qayoomabad · Crossing · Korangi Creek · Ibrahim Haidri",
  },
  {
    code: "N-4",
    category: "mini_bus",
    stops:
      "Islam Nagar Orangi · Faqeer Colony · Mominabad · Metrowel · Frontier Colony · Bhawani Chali · Site Police Station · Ghani Chorangi · Sher Shah · Gulbai · Tower · Keemari · Masan Road · Sherin Jinnah · Shahrah-e-Ghalib · Shahrah-e-Firdosi · Abdullah Shah · Khayaban-e-Shamsheer · Saudi Sifaratkhana · Punjab Colony · Sun Set Boulevard · Defence Mor · Akhtar Colony · Qayoomabad · Korangi Crossing · Nasir Colony · Chamra Chorangi · Jinnah Medical College · Mehran Town",
  },
  {
    code: "N-5",
    category: "mini_bus",
    stops:
      "Naval Colony · Fareed Colony · Urdu Chowk · Orangi 4,5 · Metro · Banaras · Valika · Habib Bank · Ghani Chorangi · Sher Shah · Gulbai · Sultanabad · Tower · PIDC · Cantt Station · Jinnah Hospital · Kala Pul · Defence Mor · Akhtar Colony · Qayoomabad · Godam Chorangi · Chamra Chorangi · Veta Chorangi · Bilal Colony",
  },
  {
    code: "SL",
    category: "mini_bus",
    stops:
      "Saddar · Lucky Star · Jinnah Hospital · Cantt Mor · COD · Kala Pul · Defence Mor · Akhtar Colony · Qayoomabad · Korangi Crossing · Nasir Jump · Korangi 1–6 · Chiragh Hotel · Landhi 4 · Babar Market · Landhi 89",
  },
  {
    code: "W-11",
    category: "mini_bus",
    stops:
      "Ahsanabad · New Karachi Allah Wali Chorangi · 5 Number Stop · Godhra · Shafiq Mor · Al Noor Mor · Sohrab Goth · Ancholi · Water Pump · Aisha Manzil · Karimabad · Liaqatabad 10 · Dak Khana · Teen Hati · Jahangir Road · Guru Mandar · Numaish · Seven Day Hospital · Tibet Center · Radio Pakistan · Jama Cloth · Light House · City Court · Boulton Market · Memon Masjid · Tower · Native Jetty · Jackson Market · Keamari",
  },
  {
    code: "W-18",
    category: "mini_bus",
    stops:
      "Baba Mor · Rahmania Mor · W9 Stop · Ajmer Nagri · Baradari · Disco Mor · UP Mor · Nagan Chorangi · Sohrab Goth · NIPA · Aladeen Park · Millennium Mall · Drigh Road · Natha Khan · Star Gate · Airport · Malir Halt · Kala Board · Quaidabad · Dawood Chorangi · Sher Pao · Lalabad · Rehri Goth",
  },
  {
    code: "W-22",
    category: "mini_bus",
    stops:
      "Chungi Stop · Baba Mor · Rahmania Mor · W9 Stop · Ajmer Nagri · Baradari · Disco Mor · Jamia Masjid Al Falahiya Sector 10 · Anda Mor · Qalandria Chowk · Kati Pahari · Pahar Ganj · Abdullah College · Board Office · Nazimabad 7 · Petrol Pump · Liaqatabad 4,10 · Ghareebabad · Hasan Square · Askari Park · Jail Chorangi · Khalid Bin Waleed Road · Allah Waali Chorangi · Nursery · Gora Qabristan · Kala Pul · Defence Mor · Akhtar Colony · Qayoomabad · Shah Bhatai Colony · Double Road Korangi 2 ⅓",
  },
  {
    code: "W-25",
    category: "mini_bus",
    stops:
      "Khameso Goth · Sindhi Hotel · 5 Number · Saba Cinema · Gabol Town · Godhra · Bismillah Hotel · UP Mor · Nagan Chorangi · Sakhi Hasan · Hydri · Board Office · Abdullah College · Banaras · Metro · Orangi 5 · ZMC · Nishan-e-Haider · Islam Chowk · Daba Mor · Raees Amrohi · Tori Chowk · Khyber Chowk · Qabail Chowk · Itihad Town",
  },
  {
    code: "W-55",
    category: "mini_bus",
    stops:
      "Khaibarabad · Gulshan Bahar · German School · Faisal Chowk · Qatar Hospital · Orangi 1 · Qasba Mor · Banaras · Abdullah College · Board Office · KDA · Haidri · 2K Stop · Sakhi Hasan · Nagan Chorangi · UP Mor · Saleem Center · Power House · 2 Minute · 4K Chorangi · Surjani KDA · Khuda Ki Basti · New Lyari",
  },
  {
    code: "X-8",
    category: "mini_bus",
    stops:
      "Itihad Town · Dawood Goth · Naval Colony · Mwach Goth · Hub River Road · Shershah · Gulbai · Mauripur Road · ICI Bridge · Kharadar · Tower · Keemari · Masan Road · Sherin Jinnah Colony · Shahrah-e-Firdosi · Abdullah Shah Ghazi · 26th Street · Khayaban-e-Shamsheer · Saba Avenue · Khayaban-e-Itihad · Qayoomabad · Godam Chorangi · Chamra Chorangi · Veta Chorangi · Bilal Colony · Bilal Chorangi · Singer Chorangi · K Area · Darul-Uloom · 36-B · Zamanabad · Landhi 4 · Babar Market · 89 · Dawood Chorangi · Mehran Highway · Rohri Goth",
  },
  {
    code: "X-10",
    category: "mini_bus",
    stops:
      "Itihad Town · Muhajir Camp · Shershah · Ghani Chorangi · Habib Bank · Nazimabad 2 · Petrol Pump · Liaqatabad 4 · Liaqatabad 10 · Dakhana · 3 Hatti · Guru Mandar · Numaish · Sadar · Mehran Hotel · Cantt Station · Race Course · Dehli Colony · Gizri · Misri Shah",
  },
  {
    code: "X-23",
    category: "mini_bus",
    stops:
      "Fareed Colony · Faqeer Colony · Orangi 10 · No.4 · Mominabad · Frontier · Site Area · Valika · Habib Bank · Nazimabad 2 · Petrol Pump · Liaqatabad 4 · Liaqatabad 10 · Ghareebabad · Hasan Square · Askari Park · Bahadurabad · Tariq Road · Mehmoodabad · Manzoor Colony · Qayoomabad · Chamra Chorangi · Bilal Colony · Hashim Goth",
  },
  {
    code: "Z-2",
    category: "mini_bus",
    stops:
      "Gulshan Ghazi · Fareed Colony · Orangi 10,5 · Banaras · Habib Bank · Bara Board · Garden · Maki Masjid · Jublee · Sadar · Mehran Hotel · Cantt Station · Punjab Colony · Khayaban-e-Ghalib · Khayaban-e-Shaheed",
  },
  {
    code: "Z-18",
    category: "mini_bus",
    stops:
      "Fareed Colony · Gulshan Ghazi · Jangal School · Saeedabad · Mwach Mor · Muhajir Camp · Shershah · Gulbai Chowk · Khoja Jamat Khana · Kharadar · Kakri Ground · Lee Market · Purana Haji Camp · Ranchor Lane · Ramswami · Garden · Raiksar · Bismillah Hotel · Bara Board · Habib Bank · Valika · Banaras · Orangi 5 · Nishan-e-Haider · Orangi 11½ · Islam Chowk · Noori Chowk · Itihad Town",
  },
  {
    code: "16",
    category: "mini_bus",
    stops:
      "Sadar · Jutt Lane · Gora Qabristan · Nursery · Baloch Colony · Karsaz · Drigh Road · Natha Khan · Colony Gate · Star Gate · Airport · Maleer Halt · Kala Board · Maleer 15 · Quaidabad · Bacha Jail · Bhens Colony Mor · Bhens Colony 5,6,9",
  },

  // ---------------- NAMED ROUTES ----------------
  {
    code: "Mashriq",
    category: "named_route",
    stops:
      "Muzafarabad Colony · Landhi · Gul Ahmed · Dawood Chorangi · Mansehra Colony · Singer Chorangi · Chamra Chorangi · Qayoomabad · Akhtar Colony · Defence Mor · Kala Pul · Jinnah Hospital · Saddar · Maki Masjid · Garden · Bara Board · Habib Bank · Valika · Metrovill · Mominabad · Faqeer Colony · Itihad Town",
  },
  {
    code: "Muslim",
    category: "named_route",
    stops:
      "Steel Town · Pipri · Shah Latif Town · Quaidabad · Malir 15 · Malir Halt · Airport · Drigh Road · Karsaz · Baloch Pul · Nursery · Gora Qabristan · Regent Plaza · Jinnah Hospital · Cantt Station · PIDC · Light House · City Court · Boulton Market · Tower · Shereen Jinnah Colony",
  },
  {
    code: "New Afridi",
    category: "named_route",
    stops:
      "Bhains Colony · Jumma Goth · Mansehra Colony · Hospital Chorangi · Dawood Chorangi · Murtaza Chorangi · Indus Chorangi · Bilal Chorangi · Shan Chorangi · Brooks Chorangi · KPT Interchange · Nadra Mega Center DHA · Gold Mark Shipping Mall · Sun Set Boulevard · Punjab Chorangi · Schon Circle · Tower · IC · Baldia Bridge · Meezan Head Office · Sher Shah Chowk · Ghani Chorangi · Rasheedabad · Siemens Chorangi · Habib Bank Chorangi · Merroville · Khyber Gate · Mominabad · Faqeer Colony · Gulshan-e-Ghazi",
  },
  {
    code: "Super Hasanzai",
    category: "named_route",
    stops:
      "New Sabzi Mandi · Jamali Pull · Maymar Mor · Sohrab Goth · Lucky One · Gulshan Chorangi · NIPA Chorangi · Hasan Square · Old Sabzi Mandi · Jail Chorangi · Tariq Road · Shahrah-e-Qaideen · Nursery · Shahrah-e-Faisal · FTC · Jinnah Hospital · Railway Cantt Station · Teen Talwar · Do Talwar · South City Hospital · Bilawal Chorangi · Shereen Jinnah Colony",
  },
  {
    code: "7 Star",
    category: "named_route",
    stops:
      "Orangi Zahoor Chowk 11½ · No.5 · Banaras · Habib Bank · Nazimabad 2 · Petrol Pump · Liaqatabad 4 · No.10 · Ghareebabad · Hasan Square · National Stadium · Karsaz · Drigh Road · Natha Khan · Airport · Kala Board · Lal Masjid · Tanki · Saoodabad · Khokhrapar",
  },
  {
    code: "Sheraz",
    category: "named_route",
    stops:
      "Malir Cantt · Race Course · Saforah Goth · Mosmiat · University · Safari Park · NIPA · Urdu College · Hasan Square · Askari Park · Jail Chorangi · Islamia College · Numaish · Taj Complex · Plaza · Jama Cloth · Light House · City Court · Boulton Market · Tower · Kharadar · IC · Agrah Taj · Machar Colony · Gulbai · Truck Adda · Mauripur Graks · Mauripur Village · 500 Quarters · Musharaf Colony",
  },
  {
    code: "MashAllah",
    category: "named_route",
    stops:
      "Hijrat Colony · Sultanabad · Tower · Boulton Market · Light House · Jama Cloth · Plaza · Maki Masjid · Garden · Raiksar · Bismillah Hotel · Bara Board · Habib Bank · Valika · Banaras · Metro · Orangi 5,12,13,14 · Khairabad",
  },
  {
    code: "Abdullah",
    category: "named_route",
    stops:
      "Itihad Town · Saeedabad 9,8 · Gulshan Ghazi Mor · Bismillah Chowk · Nayi Abadi · Jangal School · 19-D · Baldia 7 · Muhajir Camp 4 · Shershah · Gulbai · Machar Colony · Agrah Taj · IC · Kharadar · Tower · Mai Kolachi Road · Schon Circle · Punjab Chorangi · Sun Set Boulevard · Defence Mor · Akhtar Colony · Qayoomabad · Korangi Crossing · Nasir Jump · Korangi 2½,3,4,5,6 · Landhi 6 · Chirag Hotel · Babar Market · 89 · Dawood Chorangi · Quaidabad · Qazafi Town",
  },
  {
    code: "AL-Qadri",
    category: "named_route",
    stops:
      "Khokhrapar · Drigh Road · National Cement · National Stadium · Liaquat Medical Hospital · Jail Road · Teen Hati · Lasbela · Lawrence Road · Ranchor Lane · Lee Market · Kharadar · Jamat Khana · Gulbai · Mauripur · Naval Colony · Hawksbay",
  },
  { code: "Rind", category: "named_route", stops: "Lee Market · Hub Chowki" },

  // ---------------- OTHER BUS ROUTES ----------------
  {
    code: "9-C",
    category: "other",
    stops:
      "Malir Cantt · Wireless Gate · Star Gate · Colony Gate · Natha Khan · Drigh Road · Karsaz · Awami Markaz · Baloch Colony · Fine House · Lal Kothi · Nursery · FTC · Jinnah Hospital · Cantt Station · Race Course · Bacha Party · Punjab Chorangi · Khada Market · DHA 26th Street · Abdullah Shah Ghazi · Bilawal Chorangi · Clifton · Ziauddin Hospital",
  },
  {
    code: "4-L",
    category: "other",
    stops:
      "Maymar Complex · Paradise Bakery · Al-Asif Square · Sohrab Goth · Water Pump · Karimabad · Liaqatabad · Teen Hatti · Guru Mandar · Numaish · Saddar · Empress Market · Burns Road · MA Jinnah Road · Bolton Market",
  },
  {
    code: "4-Q",
    category: "other",
    stops:
      "Gulzaar-e-Hijri · Abbas Town · Sohrab Goth · Water Pump · Karimabad · Liaqatabad · Teen Hatti · Guru Mandar · Numaish · MA Jinnah Road · Jama Cloth · Bolton Market",
  },
  {
    code: "7-C",
    category: "other",
    stops:
      "Bufferzone Gulzar-e-Madina Masjid · DC Office · Peoples Chorangi · Saifi College · Dental College · Ziauddin Hospital · Musa Colony · Karimabad · Liaqatabad 10 · Dakhana · Khamosh Colony · Golimar · Bara Board · Habib Bank · Ghani Chorangi · Sher Shah · Meranaka · Chakiwarah · Lee Market · Kharadar · Tower · Fisheries · Dockyard",
  },
  {
    code: "11-C",
    category: "other",
    stops:
      "Azam Basti · Parsi Colony · Kala Pul · Jinnah Hospital · Saddar · 7th Day Hospital · Numaish · Guru Mandar · Islamia College · Jail Chorangi · New Town Police Station · Sabzi Mandi · Civic Centre · Urdu College · NIPA · Safari Park · Karachi University · Samama · Mosamiyat · Johar Complex · Safoora Goth · Saadi Town",
  },
  {
    code: "20",
    category: "other",
    stops:
      "Baldia Town Sector 9-E · Sector 8 · Saeedabad · Rubi Mor · Police Training School · Swat Colony 2 · No.3 · Rasheedabad · Labour Square · Police Station · Valika · Habib Bank · Bara Board · Bismillah Hotel · Raiksar · Garden · Maki Masjid · Taj Complex · Sadar · Lucky Star · Zainab Market · Mehran Hotel · Cantt Station · Mohta Palace · Shereen Jinnah Colony",
  },
  {
    code: "51 (Thatta)",
    category: "other",
    stops:
      "Thatta City · Shidi Village · Pir Sarhindi Village · Lashari Village · Model Village · Ghaghar Phatak · Steel Town · Steel Mill Mor · Port Qasim Mor · Abdullah Goth · Chokandi Qabristan · Fast University · Bhains Colony Mor · Manzil Pump · Quaidabad · Murgi Khana · Malir High Court · Malir 15 · Malir Halt · Natha Khan · Drigh Road Stop · COD · Millennium Mall · Dalmia/Stadium Road · Bahria University · National Cricket Stadium · Aga Khan Hospital · Liaquat National Hospital · New Town Chowk · Numaish · Garden · Lee Market",
  },
  {
    code: "55",
    category: "other",
    stops:
      "Memon Goth · Bakra Piri · Malir 15 · Malir Halt · Natha Khan · Drigh Road Stop · COD · Millennium Mall · Dalmia/Stadium Road · Bahria University · National Cricket Stadium · Aga Khan Hospital · Liaquat National Hospital · New Town Chowk · Numaish · Garden · Lee Market",
  },

  // ---------------- COACH ----------------
  {
    code: "Marwat",
    category: "coach",
    stops:
      "Hawksbay Beach · Pakistan Marine Academy Maripur · Truck Adda Maripur · PAF Masroor Base · Gulbai · Agra Taj · ICI Bridge · Tower · Paper Market · Bolton Market · Light House · Civil Hospital · Jama Cloth · Burns Road · Amma Tower · Numaish · Khudad Colony · Noorani Kabab House · Allah Wali Chorangi · Nursery · Habitt/Fine House · Baloch Colony Pull · Karsaz Mor · Karsaz Market · Drigh Road · Malir Halt · Malir 15 · Malir Nadi · Quaidabad · Dawood Chorangi · Future Colony · Murtaza Chorangi · Jamia DarulUloom · Indus Chorangi · Bilal Chorangi · Shan Chorangi · Brooks Chorangi · Sadiq Jam Bridge · Qayumabad · Akhtar Colony · Defence Mor · Khayaban-e-Shahbaz · Khayaban-e-Badar · 26th Street · Abdullah Shah Ghazi · South City Hospital · Bilawal Chorangi · Shireen Jinnah Colony",
  },
  {
    code: "Bilal",
    category: "coach",
    stops:
      "Itihad Town · Fareed Colony · Urdu Chowk · Orangi 10 · No.5 · Banaras · Habib Bank · Nazimabad 2 · Petrol Pump Chorangi · Liaqatabad 4 · No.10 · Ghareebabad · Hasan Square · Askari Park · Jail Chorangi · Tariq Road · Hill Park · Baloch Colony · Qayoomabad · Korangi Industrial Area · Chamra Chorangi · Mansehra Colony · Dawood Chorangi · Gul Ahmed · Labour Square · Landhi · BMDF Colony",
  },
  {
    code: "Gulistan",
    category: "coach",
    stops:
      "Bhitayabad · Habib University · Johar Chorangi · Johar Mor · NIPA Chorangi · Hasan Square · New Town · Jail Chorangi · Numaish · MA Jinnah Road · Tower · Bahria Complex (1,2,3) · American Embassy · Mai Kolachi Road · Boat Basin · Bilawal Chorangi · South City Hospital · Abdullah Shah Ghazi · Sea View · Saudi Embassy · Sultan Masjid",
  },
  {
    code: "Ilyas",
    category: "coach",
    stops:
      "Landhi 1 · Chaawal Godam · Landhi 6 · Korangi 6 · Korangi 1 · Crossing · Qayoomabad · Akhtar Colony · Defence · Punjab Colony · Cantt Post Office · PIDC · Light House · City Court · Boulton Market · Tower · Gulbai · Shershah · Hub River Road · Saeedabad · Itihad Town",
  },
  {
    code: "Masood",
    category: "coach",
    stops:
      "Bhains Colony · Labour Square · Manzil Pump · Quaidabad · Malir 15 · Malir Halt · Jinnah Avenue · Race Course Road · Safoora Chorangi · Karachi University · NED University · NIPA Chorangi · Gulshan Chorangi · Lucky One · Sohrab Goth Chorangi · Nagan Chorangi · Power House Chorangi · 2 Minute Chorangi · 4K Chorangi · Surjani KDA Chorangi · Khuda Ki Basti",
  },
  {
    code: "Khan",
    category: "coach",
    stops:
      "Abdullah Chowk · Surjani KDA · 4K Chorangi · 2 Minute Chorangi · Power House Chorangi · Saleem Center · UP Mor · Nagan Chorangi · Sakhi Hasan · Five Star Chorangi · Hyderi · Board Office · Nazimabad Petrol Pump · Nazimabad 1 · Golimar Chorangi · Lasbela · Patel Para · Numaish · MA Jinnah Road · Tower · American Embassy · Boat Basin · Schon Circle · 2 Talwar · Abdullah Shah Ghazi",
  },

  // ---------------- RED BUS ----------------
  {
    code: "R-1",
    category: "red_bus",
    stops:
      "Khokrapar · Saudabad · RCD Ground · Kalaboard · Malir Halt · Colony Gate · Nata Khan Bridge · Drigh Road Station · PAF Base Faisal · Laal Kothi · Karsaz · Nursery · FTC · Regent Plaza · Metropole · Fawwara Chowk · Arts Council · Shaheen Complex · I.I. Chundrigar · Tower · Fisheries · Dockyard",
  },
  {
    code: "R-2",
    category: "red_bus",
    stops:
      "Power House · UP Mor · Nagan Chorangi · Shafiq Mor · Sohrab Goth · Gulshan Chorangi · NIPA · Johar Mor · COD · Drigh Road Station · Colony Gate · Shah Faisal Colony · Singer Chorangi · Khaddi Stop · Indus Hospital",
  },
  {
    code: "R-3",
    category: "red_bus",
    stops:
      "Power House · UP Mor · Nagan Chorangi · Sakhi Hasan · 5 Star Chorangi · KDA Chorangi · Board Office · Nazimabad Eid Gah Ground · Liaqatabad 10 · Essa Nagri · Civic Centre · National Stadium · Karsaz · Nursery · FTC · Korangi Road · KPT Interchange · Shan Chorangi · Nasir Jump",
  },
  {
    code: "R-4",
    category: "red_bus",
    stops:
      "Power House · UP Mor · Nagan Chorangi · Shafiq Mor · Sohrab Goth · Water Pump · Ayesha Manzil · Karimabad · Liaqatabad 10 · Laloo Khait · Teen Hati · Jehangir Road · Numaish · Mobile Market · Urdu Bazar · Civil Hospital · City Court · Light House · Bolton Market · Tower · Keemari",
  },
  {
    code: "R-8",
    category: "red_bus",
    stops:
      "Yousuf Goth · Naval Colony · Baldia · Sher Shah · Gulbai · Agra Taj Colony · Daryabad · Jinnah Bridge · Tower",
  },
  {
    code: "R-9",
    category: "red_bus",
    stops:
      "Gulshan-e-Hadeed · Salah Uddin Ayubi Road · Allah Wali Chorangi · National Highway 5 · Steel Mill Mor · Port Bin Qasim Mor · Razzakabad · Abdullah Goth · Chowkundi Mor · Fast University · Shah Latif Town · Bhains Colony Mor · Manzil Pump · Quaidabad · Murghi Khana · Prince Aly Boys School · Nadra Center Malir · Malir Session Court · Malir 15 · Kalaboard · Malir Halt · Colony Gate · Nata Khan Bridge · Drigh Road Station · PAF Base Faisal · Laal Kothi · Karsaz · Nursery · FTC · Regent Plaza · Metropole · Fawwara Chowk · Arts Council · Shaheen Complex · I.I. Chundrigar · Tower",
  },
  {
    code: "R-10",
    category: "red_bus",
    stops:
      "Numaish Chorangi · Mobile Market · Metropole · Frere Hall · Teen Talwar · Do Talwar · Abdullah Shah Ghazi · Dolmen Mall · Clock Tower DHA · 26th Street · Masjid-e-Ayesha · Rahat Park · KPT Interchange · Korangi Crossing · CBM University · Parco · Ibrahim Hyderi",
  },
  {
    code: "R-11",
    category: "red_bus",
    stops:
      "Miran Nakka · Gulistan Colony · Bihar Colony · Agra Taj · Daryabad · Jinnah Bridge · Bahria Complex · MT Khan Road · PICD · Submarine Chowk · Bahria Complex 3 · Khadda Market · Abdullah Shah Ghazi · Bilawal Chorangi · Ziauddin Hospital · Shereen Jinnah Colony",
  },
  {
    code: "R-12",
    category: "red_bus",
    stops:
      "Naddi Kinara · Khokhrapar · Saudabad Chorangi · RCD Ground · Kalaboard · Malir 15 · Malir Mandir · Malir Session Court · Murghi Khana · Quaidabad · Dawood Chorangi · Babar Market · Landhi Road · Nasir Jump · Indus Hospital · Korangi Crossing · Qayumabad · Defence Mor · National Medical Center · Gora Qabristan · FTC · Jutt Land · Lines Area · Army Public School · Lucky Star Saddar",
  },
  {
    code: "R-13",
    category: "red_bus",
    stops: "Hawksbay · Mauripur · Gulbai · Agra Taj · Daryabad · Jinnah Bridge · Tower",
  },
  {
    code: "R-14",
    category: "red_bus",
    stops:
      "Maymar Extension · Maymar Mor · Ahsanabad · Jamali Pull · Al-Asif Square · Sohrab Goth · Ayesha Manzil · Liaqatabad · Teen Hatti · Jahangir Road · Guru Mandar · Numaish · Taj Complex · Sindh High Court · Tower",
  },

  // ---------------- EV BUS ----------------
  {
    code: "EV-1",
    category: "ev_bus",
    stops:
      "CMH Malir Cantt · Tank Chowk · Model Colony Mor · Jinnah Ave · Airport · Colony Gate · Nata Khan Bridge · Drigh Road Station · PAF Base Faisal · Laal Kothi · Karsaz · Nursery · FTC · Korangi Road · DHA Phase 1 · Masjid-e-Ayesha · Clock Tower DHA · Dolmen Mall Clifton",
  },
  {
    code: "EV-2",
    category: "ev_bus",
    stops:
      "Bahria Town · Dumba Goth · Toll Plaza · Baqai University · Malir Cantt Gate 5 · Malir Cantt Gate 6 · Tank Chowk · Model Mor · Jinnah Ave · Malir Halt",
  },
  {
    code: "EV-3",
    category: "ev_bus",
    stops:
      "Malir Cantt Check Post 5 · Rim Jhim Tower · Safoora Chorangi · Mausamiyat Chorangi · Kamran Chorangi · Darul Sehat Hospital · Johar Chorangi · Johar Mor · Millennium Mall · Dalmia Road · Bahria University · National Stadium · Aga Khan Hospital · Liaquat National Hospital · PIB Colony · Jail Chorangi · Dawood Engineering University · Islamia College · People Secretariat Chorangi · Numaish",
  },
  {
    code: "EV-4",
    category: "ev_bus",
    stops:
      "Bahria Town · Dumba Goth · M9 Toll Plaza · Jamali Pull · New Sabzi Mandi · Al Asif · Sohrab Goth · Water Pump · Ayesha Manzil",
  },
  {
    code: "EV-5",
    category: "ev_bus",
    stops:
      "DHA City · Bahria Town · Dumba Goth · M9 Toll Plaza · Jamali Pull · New Sabzi Mandi · Al Asif · Sohrab Goth",
  },

  // ---------------- BRT ----------------
  {
    code: "Green Line",
    category: "brt",
    stops:
      "Abdullah Chowk Station · KDA Flats Station · Karimi Chorangi Station · Surjani Chorangi (4K) Station · 2 Minute Chorangi Station · Road 2400 (Aisha Complex) Station · Power House Chorangi Station · Road 4200 (Saleem Centre) Station · UP Mor Station · Nagan Chorangi Station · Erum Shopping Mall (Shadman No.2) Station · Jummah Bazaar (Bhayani Center) Station · Five Star Chorangi Station · Hyderi Station · Board Office Station · Annu Bhai Park Station · Enquiry Office Station · Nazimabad No.1 Station · Sanitary Market (Gulbahar) Station · Lasbela Chowk Station · Patel Para (Guru Mandir) Station",
  },
  {
    code: "Orange Line",
    category: "brt",
    stops:
      "Orangi Town Headquarter Terminal · Nishan-e-Haider Chorangi Station · Abdullah College Station · Jinnah University Station · Board Office Station · Hyderi Station · Five Star Chorangi Station · Jummah Bazaar (Bhayani Center) Station · Erum Shopping Mall (Shadman No.2) Station · Nagan Chorangi Station",
  },

  // ---------------- DOUBLE DECKER ----------------
  {
    code: "DD01",
    category: "double_decker",
    stops:
      "Model Colony · Malir Halt · Colony Gate · Nata Khan Bridge · Drigh Road Station · PAF Base Faisal · Laal Kothi · Karsaz · Nursery · FTC · Regent Plaza · Metropole · Fawwara Chowk · Arts Council · Shaheen Complex · I.I. Chundrigar · Tower",
  },
];

export const ROUTES: BusRoute[] = raw.map((r) => ({
  code: r.code,
  slug: slugify(r.code),
  category: r.category,
  stops: s(r.stops),
}));

export interface AreaEntry {
  name: string;
  slug: string;
  routes: BusRoute[];
}

// Normalize stop-name variants so e.g. "Nagan Chorangi" (Red Bus) and
// "Nagan Chorangi Station" (BRT) resolve to ONE area listing every category.
const areaKey = (stop: string) =>
  stop
    .toLowerCase()
    .replace(/\s+station$/, "")
    .replace(/\s+terminal$/, "")
    .replace(/\s*\(.*?\)\s*/g, " ")
    .replace(/five star/g, "5 star")
    .replace(/chowrangi/g, "chorangi")
    .replace(/[.,-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const areaMap = new Map<string, { name: string; routes: BusRoute[] }>();
for (const route of ROUTES) {
  for (const stop of route.stops) {
    const key = areaKey(stop);
    const existing = areaMap.get(key);
    if (existing) {
      // Prefer the shorter, non-"Station" display name.
      if (stop.length < existing.name.length) existing.name = stop;
      if (!existing.routes.includes(route)) existing.routes.push(route);
    } else {
      areaMap.set(key, { name: stop, routes: [route] });
    }
  }
}

export const AREAS: AreaEntry[] = Array.from(areaMap.values())
  .map((a) => ({ name: a.name, slug: slugify(a.name), routes: a.routes }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const getRoute = (slug: string) => ROUTES.find((r) => r.slug === slug);
export const getArea = (slug: string) => AREAS.find((a) => a.slug === slug);

export const POPULAR_AREAS = [
  "Gulshan Chorangi",
  "Sohrab Goth",
  "Tower",
  "Numaish",
  "Nursery",
  "Saddar",
  "Quaidabad",
  "Nagan Chorangi",
  "Banaras",
  "Sultanabad",
  "Malir Halt",
  "Korangi Crossing",
];

/** Simple typo-tolerant scoring for local spelling variants. */
export function normalize(v: string) {
  return v
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\b(chorangi|chowrangi|chorangy|chowrangy)\b/g, "chorangi")
    .replace(/\b(qayoomabad|qayumabad)\b/g, "qayoomabad")
    .replace(/\b(maleer|malir)\b/g, "malir")
    .replace(/\b(itihad|ittehad|itehad)\b/g, "itihad")
    .replace(/\b(mor|more)\b/g, "mor")
    .replace(/z/g, "s")
    .replace(/ee/g, "i")
    .replace(/aa/g, "a")
    .replace(/\s+/g, " ")
    .trim();
}

export function scoreMatch(target: string, query: string): number {
  const t = normalize(target);
  const q = normalize(query);
  if (!q) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;
  const words = q.split(" ").filter(Boolean);
  const hits = words.filter((w) => t.includes(w)).length;
  if (hits === words.length && words.length > 0) return 45;
  if (hits > 0) return 20 + hits * 5;
  return 0;
}
