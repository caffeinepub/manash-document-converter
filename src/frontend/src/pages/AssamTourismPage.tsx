import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  MapPin,
  Mountain,
  Navigation,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useInView } from "../hooks/useInView";

interface Props {
  navigate: (p: Page) => void;
}

interface TourismPlace {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  bestTime: string;
  howToReach: string;
  localFood: string;
  culturalInfo: string;
  category: string;
  isCustom?: boolean;
}

const BUILT_IN_PLACES: TourismPlace[] = [
  {
    id: "kaziranga",
    name: "Kaziranga National Park",
    tagline: "Home of the One-Horned Rhinoceros",
    description:
      "A UNESCO World Heritage Site and one of India's most celebrated national parks, Kaziranga is home to the world's largest population of Indian one-horned rhinoceroses. Spread across the floodplains of the Brahmaputra River, it also shelters tigers, elephants, wild water buffalo, and over 470 bird species.",
    image: "/assets/generated/kaziranga.dim_800x500.jpg",
    bestTime: "November to April",
    howToReach:
      "Nearest airport: Jorhat (97 km). Nearest railhead: Furkating (75 km). Well connected by NH-37.",
    localFood:
      "Try local dhabas for Assamese thali, rice beer (Xaaj), and fresh fish curry from Brahmaputra",
    culturalInfo:
      "The park is sacred to the Karbi Anglong tribal communities. Elephant safaris and jeep safaris are must-do activities.",
    category: "Wildlife",
  },
  {
    id: "majuli",
    name: "Majuli Island",
    tagline: "World's Largest River Island",
    description:
      "Majuli, cradled in the Brahmaputra River, is the world's largest freshwater river island and the cultural capital of Assam. Home to ancient Vaishnava Sattras (monasteries), traditional mask-making, and the serene way of life of the Mishing tribe, Majuli is a living cultural treasure.",
    image: "/assets/generated/majuli.dim_800x500.jpg",
    bestTime: "October to March",
    howToReach:
      "Take a ferry from Jorhat Nimati Ghat (ferry available). Nearest airport: Jorhat (15 km from ghat).",
    localFood:
      "Try Mishing tribe's apong (rice beer), roasted fish wrapped in banana leaf, and pitha (rice cakes)",
    culturalInfo:
      "The Raas festival here (November) is one of Assam's most spectacular cultural events. Traditional Sattriya dance originated in Majuli.",
    category: "Culture & Heritage",
  },
  {
    id: "kamakhya",
    name: "Kamakhya Temple",
    tagline: "One of India's Most Powerful Shakti Peethas",
    description:
      "Perched atop the Nilachal Hill in Guwahati, Kamakhya Temple is one of the most revered Shakti Peethas in India. This ancient temple dedicated to Goddess Kamakhya draws millions of pilgrims and tourists each year, especially during the famous Ambubachi Mela festival.",
    image: "/assets/generated/kamakhya.dim_800x500.jpg",
    bestTime:
      "October to March (avoid Ambubachi unless attending the festival)",
    howToReach:
      "Located 8 km from Guwahati city center. Easily accessible by auto, taxi, or bus from Guwahati railway station and airport.",
    localFood:
      "Try prasad (sacred offering) at the temple; nearby eateries serve Assamese thali, fish tenga, and masor tenga",
    culturalInfo:
      "The temple's architecture follows the Nilachal style with a beehive-shaped shikhara. The Ambubachi Mela (June) attracts thousands of tantric saints and pilgrims.",
    category: "Spiritual",
  },
  {
    id: "brahmaputra",
    name: "Brahmaputra River",
    tagline: "The Lifeline of Assam",
    description:
      "The mighty Brahmaputra, known as 'Luit' in Assamese, is one of the world's great rivers and the very soul of Assam. Flowing from Tibet through Arunachal Pradesh into the Assam valley, it creates a mesmerizing landscape of islands, floodplains, and biodiversity hotspots.",
    image: "/assets/generated/brahmaputra.dim_800x500.jpg",
    bestTime: "October to April (river cruise season)",
    howToReach:
      "Flows through the heart of Assam; best experienced from Guwahati, Dibrugarh, or Jorhat. River cruises available from Guwahati.",
    localFood:
      "Fresh Brahmaputra fish dishes — ilish maach, rohu curry — are celebrated Assamese delicacies",
    culturalInfo:
      "The Bihu festival is celebrated on its banks. River island Umananda (Peacock Island) in the middle of Brahmaputra near Guwahati houses a famous Shiva temple.",
    category: "Nature",
  },
  {
    id: "sivasagar",
    name: "Sivasagar",
    tagline: "The Ancient Capital of the Ahom Kingdom",
    description:
      "Sivasagar, formerly known as Rangpur, was the capital of the mighty Ahom Kingdom that ruled Assam for 600 years (1228–1826 AD). Today it's a treasure trove of Ahom-era monuments, including the Rang Ghar (ancient amphitheatre), Talatal Ghar (seven-story underground palace), and grand temples.",
    image: "/assets/generated/sivasagar.dim_800x500.jpg",
    bestTime: "November to March",
    howToReach:
      "Nearest airport: Jorhat (60 km). Sivasagar has its own railway station on the Assam Rail Link. Well connected by NH-37.",
    localFood:
      "Try traditional Assamese cuisine — aloo pitika, khar, masor tenga, and local sweets at Sivasagar town",
    culturalInfo:
      "The Rang Ghar is considered the oldest surviving amphitheatre in Asia. The Sivadol temple complex houses the tallest Shiva temple in Assam.",
    category: "History & Heritage",
  },
  {
    id: "manas",
    name: "Manas National Park",
    tagline: "UNESCO World Heritage Site & Project Tiger Reserve",
    description:
      "Manas National Park, a UNESCO World Heritage Site, is one of Assam's most biodiverse treasures. Nestled in the foothills of the Bhutan Himalayas, it is home to the endangered golden langur, pygmy hog, Assamese macaque, Bengal tiger, and Asian elephant in pristine forest landscapes.",
    image: "/assets/generated/manas.dim_800x500.jpg",
    bestTime: "November to April",
    howToReach:
      "Nearest airport: Guwahati (176 km). Nearest railway: Barpeta Road (41 km). Regular buses from Guwahati to Barpeta Road.",
    localFood:
      "Limited options in the park; base camp areas serve basic Assamese meals and local snacks",
    culturalInfo:
      "The Bodo people are indigenous to this region. The park is part of the Manas Tiger Reserve and Manas Elephant Reserve. Jeep safaris and elephant safaris are available.",
    category: "Wildlife",
  },
  {
    id: "haflong",
    name: "Haflong",
    tagline: "Assam's Only Hill Station",
    description:
      "Haflong, the only hill station in Assam, sits at an altitude of 680 meters in the Dima Hasao district. Known as the 'Switzerland of the East', it offers breathtaking views of the Barail mountain range, the beautiful Haflong Lake, and lush green forests.",
    image: "/assets/generated/haflong.dim_800x500.jpg",
    bestTime: "October to May",
    howToReach:
      "Nearest airport: Silchar (105 km). Haflong railway station is on the Lumding–Sabroom line. Connected by NH-54.",
    localFood:
      "Try Dimasa and Zeme Naga tribal cuisine — smoked pork, bamboo shoot dishes, and fermented rice preparations",
    culturalInfo:
      "Haflong is home to the Dimasa Kachari and other hill tribes. The Haflong Week festival (January) is a colorful cultural celebration. The orchid garden has over 100 varieties.",
    category: "Nature & Hill Station",
  },
  {
    id: "tezpur",
    name: "Tezpur",
    tagline: "City of Eternal Romance & Ancient History",
    description:
      "Tezpur, the cultural capital of Assam, sits on the north bank of the Brahmaputra and is known as the 'City of Blood' due to the legendary battle of Banasura. The Agnigarh Hill, Cole Park, and ancient ruins of Da-Parbatia make it a fascinating destination.",
    image: "/assets/generated/tezpur.dim_800x500.jpg",
    bestTime: "October to April",
    howToReach:
      "Nearest airport: Tezpur Airport (14 km). Connected to Guwahati by NH-15 (183 km). Regular bus and train services.",
    localFood:
      "Tezpur is famous for Assamese sweets (sandesh, kharisa), fresh river fish, and traditional Assamese thali",
    culturalInfo:
      "The Agnigarh hill overlooks the Brahmaputra and is associated with the legend of Usha and Aniruddha. The Cole Park is one of Northeast India's most beautiful parks.",
    category: "Culture & Heritage",
  },
  {
    id: "jorhat",
    name: "Jorhat Tea Gardens",
    tagline: "The Tea Capital of the World",
    description:
      "Jorhat, often called the 'Tea Capital of the World', is surrounded by over 200 tea estates that produce some of the finest Assam tea. The rolling green tea gardens, colonial-era planter bungalows, and the unique culture of the tea tribe make Jorhat a distinctive travel experience.",
    image: "/assets/generated/jorhat-tea.dim_800x500.jpg",
    bestTime: "April to June (plucking season) or October to November",
    howToReach:
      "Jorhat Airport connects to Kolkata, Delhi, and Guwahati. Mariani Junction is the nearest major railway station (17 km).",
    localFood:
      "Fresh Assam tea is the highlight — visit any tea estate for a freshly brewed cup. Also try local Assamese cuisine in tea garden bungalows",
    culturalInfo:
      "Jorhat is also the gateway to Majuli Island. The Tocklai Tea Research Institute here is the oldest tea research station in the world.",
    category: "Tea & Culture",
  },
  {
    id: "bihu",
    name: "Bihu Festival",
    tagline: "The Soul of Assamese Identity",
    description:
      "Bihu is not just a festival — it is the heartbeat of Assam. Celebrated three times a year (Rongali/Bohag Bihu in April, Kongali/Kati Bihu in October, Bhogali/Magh Bihu in January), it is a celebration of the land, harvest, and the Assamese way of life with music, dance, and feasting.",
    image: "/assets/generated/bihu-festival.dim_800x500.jpg",
    bestTime:
      "April (Rongali Bihu - most vibrant), January (Bhogali Bihu - feast celebration)",
    howToReach:
      "Celebrated across all of Assam. Guwahati hosts the biggest celebrations. Accessible via Guwahati airport and railway station.",
    localFood:
      "Bihu special foods: pitha (rice cakes), laru (coconut/sesame sweets), jolpan (traditional breakfast), xaaj (rice beer), til pitha",
    culturalInfo:
      "Bihu dance (Bihu naas) and Bihu songs (Bihu geet) are UNESCO-recognized cultural forms. Dhol (drum) and pepa (horn flute) are traditional instruments played during celebrations.",
    category: "Festival & Culture",
  },
];

const CATEGORIES = [
  "All",
  "Wildlife",
  "Culture & Heritage",
  "Spiritual",
  "Nature",
  "History & Heritage",
  "Festival & Culture",
  "Tea & Culture",
  "Nature & Hill Station",
];

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Wildlife: "bg-green-100 text-green-800 border-green-200",
    "Culture & Heritage": "bg-blue-100 text-blue-800 border-blue-200",
    Spiritual: "bg-orange-100 text-orange-800 border-orange-200",
    Nature: "bg-teal-100 text-teal-800 border-teal-200",
    "History & Heritage": "bg-amber-100 text-amber-800 border-amber-200",
    "Festival & Culture": "bg-pink-100 text-pink-800 border-pink-200",
    "Tea & Culture": "bg-lime-100 text-lime-800 border-lime-200",
    "Nature & Hill Station": "bg-cyan-100 text-cyan-800 border-cyan-200",
  };
  return map[category] || "bg-gray-100 text-gray-800 border-gray-200";
}

function PlaceCard({ place, index }: { place: TourismPlace; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 flex flex-col group ${
        inView ? "animate-fade-up" : "opacity-0"
      }`}
      style={{
        animationDelay: inView ? `${(index % 3) * 0.12}s` : "0s",
        border: "1px solid oklch(0.92 0.02 240)",
      }}
      data-ocid={`assam-tourism.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "200px" }}>
        <img
          src={place.image}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/800x500/0a1628/gold?text=${encodeURIComponent(place.name)}`;
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.10 0.04 240 / 0.7), transparent 60%)",
          }}
        />
        {place.isCustom && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "oklch(0.78 0.18 65)",
              color: "oklch(0.10 0.03 250)",
            }}
          >
            ✨ Local Gem
          </span>
        )}
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryColor(
            place.category,
          )}`}
        >
          {place.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-bold text-lg mb-1 leading-tight"
          style={{ color: "oklch(0.15 0.04 250)" }}
        >
          {place.name}
        </h3>
        <p
          className="text-sm italic mb-3"
          style={{ color: "oklch(0.58 0.12 65)" }}
        >
          {place.tagline}
        </p>
        <p
          className={`text-sm leading-relaxed mb-4 ${
            expanded ? "" : "line-clamp-2"
          }`}
          style={{ color: "oklch(0.40 0.03 240)" }}
        >
          {place.description}
        </p>

        {/* Expanded details */}
        {expanded && (
          <div
            className="space-y-3 mb-4 border-t pt-4"
            style={{ borderColor: "oklch(0.92 0.02 240)" }}
          >
            <div className="flex gap-3">
              <Calendar
                size={16}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.55 0.15 160)" }}
              />
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide block"
                  style={{ color: "oklch(0.40 0.04 240)" }}
                >
                  Best Time to Visit
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.35 0.03 240)" }}
                >
                  {place.bestTime}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Navigation
                size={16}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.55 0.18 240)" }}
              />
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide block"
                  style={{ color: "oklch(0.40 0.04 240)" }}
                >
                  How to Reach
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.35 0.03 240)" }}
                >
                  {place.howToReach}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Utensils
                size={16}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.60 0.18 65)" }}
              />
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide block"
                  style={{ color: "oklch(0.40 0.04 240)" }}
                >
                  Local Food
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.35 0.03 240)" }}
                >
                  {place.localFood}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Info
                size={16}
                className="mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.55 0.15 290)" }}
              />
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wide block"
                  style={{ color: "oklch(0.40 0.04 240)" }}
                >
                  Cultural Insight
                </span>
                <span
                  className="text-sm"
                  style={{ color: "oklch(0.35 0.03 240)" }}
                >
                  {place.culturalInfo}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-auto flex items-center gap-1.5 text-sm font-semibold transition-colors self-start"
          style={{ color: "oklch(0.50 0.18 240)" }}
          data-ocid={`assam-tourism.item.${index + 1}.toggle`}
        >
          {expanded ? (
            <>
              <ChevronUp size={16} /> Show Less
            </>
          ) : (
            <>
              <ChevronDown size={16} /> Read More
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function AssamTourismPage({ navigate: _navigate }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: statsRef, inView: statsInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);

  const customPlaces: TourismPlace[] = (() => {
    try {
      const raw = localStorage.getItem("assamTourismPlaces");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const allPlaces: TourismPlace[] = [
    ...customPlaces.map((p) => ({ ...p, isCustom: true })),
    ...BUILT_IN_PLACES,
  ];

  const filtered =
    activeCategory === "All"
      ? allPlaces
      : allPlaces.filter((p) => p.category === activeCategory);

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.97 0.005 240)" }}
    >
      {/* Hero Section */}
      <section
        ref={heroRef as React.RefObject<HTMLElement>}
        className="relative overflow-hidden"
        style={{
          background: "oklch(0.10 0.04 250)",
          minHeight: "420px",
        }}
      >
        {/* Decorative background pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, oklch(0.28 0.12 250 / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, oklch(0.35 0.15 65 / 0.15) 0%, transparent 50%)",
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.78 0.18 65 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.18 65 / 0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          className={`relative max-w-5xl mx-auto px-6 py-20 text-center ${
            heroInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Mountain size={20} style={{ color: "oklch(0.78 0.18 65)" }} />
            <span
              className="text-sm font-semibold uppercase tracking-[0.2em]"
              style={{ color: "oklch(0.78 0.18 65)" }}
            >
              Discover Incredible Assam
            </span>
            <Mountain size={20} style={{ color: "oklch(0.78 0.18 65)" }} />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-bold mb-5 leading-tight"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.02 60), oklch(0.78 0.18 65), oklch(0.90 0.10 85))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
            }}
          >
            Incredible Assam
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: "oklch(0.72 0.05 240)" }}
          >
            Discover the Land of the Red River and Blue Hills — a land of
            unparalleled natural beauty, ancient heritage, and living culture
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://assamtourism.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
              style={{
                background: "oklch(0.78 0.18 65)",
                color: "oklch(0.10 0.03 250)",
                boxShadow: "0 4px 20px oklch(0.78 0.18 65 / 0.4)",
              }}
              data-ocid="assam-tourism.primary_button"
            >
              <ExternalLink size={16} />
              Official Assam Tourism
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        ref={statsRef as React.RefObject<HTMLElement>}
        className="py-6 px-4"
        style={{ background: "oklch(0.13 0.04 250)" }}
      >
        <div
          className={`max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 text-center ${
            statsInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          {[
            { label: "Famous Places", value: "10+" },
            { label: "UNESCO Heritage Sites", value: "2" },
            { label: "National Parks", value: "5+" },
            { label: "Unique Cultures", value: "30+" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span
                className="text-3xl font-bold"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                {stat.value}
              </span>
              <span
                className="text-xs font-medium uppercase tracking-wider mt-0.5"
                style={{ color: "oklch(0.60 0.05 240)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section
        className="sticky top-16 z-30 py-3 px-4 overflow-x-auto"
        style={{
          background: "oklch(0.98 0.003 240 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.90 0.02 240)",
          boxShadow: "0 2px 12px oklch(0 0 0 / 0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto flex gap-2 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background:
                  activeCategory === cat
                    ? "oklch(0.78 0.18 65)"
                    : "oklch(0.93 0.02 240)",
                color:
                  activeCategory === cat
                    ? "oklch(0.10 0.03 250)"
                    : "oklch(0.40 0.04 240)",
                fontWeight: activeCategory === cat ? "700" : "500",
                boxShadow:
                  activeCategory === cat
                    ? "0 2px 10px oklch(0.78 0.18 65 / 0.35)"
                    : "none",
              }}
              data-ocid={`assam-tourism.${cat.toLowerCase().replace(/[^a-z0-9]/g, "-")}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Places Grid */}
      <section
        ref={gridRef as React.RefObject<HTMLElement>}
        className="py-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className={`mb-6 flex items-center justify-between ${
              gridInView ? "animate-fade-up" : "opacity-0"
            }`}
          >
            <h2
              className="text-xl font-bold"
              style={{ color: "oklch(0.15 0.04 250)" }}
            >
              {activeCategory === "All" ? "All Places" : activeCategory}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "oklch(0.55 0.04 240)" }}
              >
                ({filtered.length} destinations)
              </span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div
              className="text-center py-20"
              data-ocid="assam-tourism.empty_state"
            >
              <MapPin
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(0.70 0.05 240)" }}
              />
              <p style={{ color: "oklch(0.50 0.04 240)" }}>
                No places in this category yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((place, i) => (
                <PlaceCard key={place.id} place={place} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "oklch(0.10 0.04 250)" }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-bold mb-3"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.78 0.18 65), oklch(0.90 0.10 85))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Plan Your Visit to Assam
          </h2>
          <p
            className="text-base mb-8"
            style={{ color: "oklch(0.65 0.05 240)" }}
          >
            Experience the magic of Assam — its wildlife, culture, cuisine, and
            the warmth of its people. Your adventure awaits!
          </p>
          <a
            href="https://assamtourism.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base transition-all hover:scale-105 hover:shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.68 0.22 55))",
              color: "oklch(0.10 0.03 250)",
              boxShadow: "0 8px 30px oklch(0.78 0.18 65 / 0.4)",
            }}
            data-ocid="assam-tourism.footer.primary_button"
          >
            <ExternalLink size={18} />
            Visit Assam Tourism Official Site
          </a>
        </div>
      </section>
    </div>
  );
}
