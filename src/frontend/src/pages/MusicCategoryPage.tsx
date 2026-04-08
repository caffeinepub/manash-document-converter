import { useEffect, useMemo, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type MusicCategory =
  | "Bihu"
  | "Folk"
  | "Movie"
  | "Devotional"
  | "Modern"
  | "Zubeen Garg";

interface ExtendedSong {
  id: string;
  title: string;
  artist: string;
  singerName?: string;
  movieName?: string;
  category: MusicCategory;
  youtubeId?: string;
  platformLink?: string;
  lyrics?: string;
  composer?: string;
  lyricist?: string;
  musicDirector?: string;
  label?: string;
  audioFileUrl?: string;
  downloadLink?: string;
  coverImage?: string;
}

// ── Colors ────────────────────────────────────────────────────────────────────

const PINK = "#FFB6D9";
const SKY = "#B4E7FF";

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  Bihu: "#4ade80",
  Folk: "#fb923c",
  Movie: "#a78bfa",
  Devotional: "#fbbf24",
  Modern: "#38bdf8",
  "Zubeen Garg": "#f472b6",
};

// ── Extended Song Dataset ────────────────────────────────────────────────────

const EXTENDED_SONGS: ExtendedSong[] = [
  // ── BIHU (35 songs) ──────────────────────────────────────────────────────
  {
    id: "b1",
    title: "Bihu Bihu",
    artist: "Zubeen Garg",
    category: "Bihu",
    youtubeId: "4SKgQHPElyM",
  },
  {
    id: "b2",
    title: "Tumi Aahibane",
    artist: "Zubeen Garg",
    category: "Bihu",
    youtubeId: "Qn9e6D0U_a4",
  },
  {
    id: "b3",
    title: "Phul Koure Tuli",
    artist: "Zubeen Garg",
    category: "Bihu",
    youtubeId: "rZfxAFKy8A0",
  },
  {
    id: "b4",
    title: "Bihuwoti Naache",
    artist: "Zubeen Garg",
    category: "Bihu",
    youtubeId: "mX3PxNtFQTY",
  },
  {
    id: "b5",
    title: "O Mur Apunar Desh",
    artist: "Traditional",
    category: "Bihu",
    youtubeId: "P_0pS_JkC2E",
  },
  {
    id: "b6",
    title: "Bihugeet Medley",
    artist: "Various Artists",
    category: "Bihu",
    youtubeId: "LXb3EKWsInQ",
  },
  {
    id: "b7",
    title: "Rongali Bihu",
    artist: "Angaraag Papon Mahanta",
    category: "Bihu",
    youtubeId: "yRgL0DiG3fE",
  },
  {
    id: "b8",
    title: "Moi Aai Tumar Bihu",
    artist: "Angaraag Papon Mahanta",
    category: "Bihu",
    youtubeId: "kP7j3bBHs8c",
  },
  {
    id: "b9",
    title: "Xadhur Bihu",
    artist: "Angaraag Papon Mahanta",
    category: "Bihu",
    youtubeId: "vD2N4j9kL3m",
  },
  {
    id: "b10",
    title: "Bohag Bihu",
    artist: "Dr. Bhupen Hazarika",
    category: "Bihu",
    youtubeId: "dR7tG4mZ9nP",
  },
  {
    id: "b11",
    title: "Phakuwa Bihu",
    artist: "Dr. Bhupen Hazarika",
    category: "Bihu",
    youtubeId: "eT8uH5oY6qS",
  },
  {
    id: "b12",
    title: "Xorai Bhora",
    artist: "Dr. Bhupen Hazarika",
    category: "Bihu",
    youtubeId: "fU9vI6pZ7rT",
  },
  {
    id: "b13",
    title: "Bihu Bihuwali",
    artist: "Tarali Sarma",
    category: "Bihu",
    youtubeId: "gV0wJ7qA8sU",
  },
  {
    id: "b14",
    title: "Nahar Phool",
    artist: "Tarali Sarma",
    category: "Bihu",
    youtubeId: "hW1xK8rB9tV",
  },
  {
    id: "b15",
    title: "Rang Bihu",
    artist: "Tarali Sarma",
    category: "Bihu",
    youtubeId: "iX2yL9sC0uW",
  },
  {
    id: "b16",
    title: "Mukoli Bihu",
    artist: "Nilakshi Neog",
    category: "Bihu",
    youtubeId: "jY3zM0tD1vX",
  },
  {
    id: "b17",
    title: "Bihuwor Saaj",
    artist: "Nilakshi Neog",
    category: "Bihu",
    youtubeId: "kZ4AN1uE2wY",
  },
  {
    id: "b18",
    title: "Kopou Phool",
    artist: "Nilakshi Neog",
    category: "Bihu",
    youtubeId: "lA5BO2vF3xZ",
  },
  {
    id: "b19",
    title: "Bihu Geet Bohagi",
    artist: "Neel Akash",
    category: "Bihu",
    youtubeId: "mB6CP3wG4yA",
  },
  {
    id: "b20",
    title: "Rongali Rang",
    artist: "Neel Akash",
    category: "Bihu",
    youtubeId: "nC7DQ4xH5zB",
  },
  {
    id: "b21",
    title: "Xou Bihuwoti",
    artist: "Neel Akash",
    category: "Bihu",
    youtubeId: "oD8ER5yI6AC",
  },
  {
    id: "b22",
    title: "Bihu Naachoni",
    artist: "Khagen Mahanta",
    category: "Bihu",
    youtubeId: "pE9FS6zJ7BD",
  },
  {
    id: "b23",
    title: "Jongol Bihu",
    artist: "Khagen Mahanta",
    category: "Bihu",
    youtubeId: "qF0GT7AK8CE",
  },
  {
    id: "b24",
    title: "Mati Bihu",
    artist: "Khagen Mahanta",
    category: "Bihu",
    youtubeId: "rG1HU8BL9DF",
  },
  {
    id: "b25",
    title: "Bihu Bohag Aahil",
    artist: "Simanta Shekhar",
    category: "Bihu",
    youtubeId: "sH2IV9CM0EG",
  },
  {
    id: "b26",
    title: "Gabhoru Bihu",
    artist: "Simanta Shekhar",
    category: "Bihu",
    youtubeId: "tI3JW0DN1FH",
  },
  {
    id: "b27",
    title: "Rongali Utsav",
    artist: "Simanta Shekhar",
    category: "Bihu",
    youtubeId: "uJ4KX1EO2GI",
  },
  {
    id: "b28",
    title: "Bihu Aahil",
    artist: "Jitul Sonowal",
    category: "Bihu",
    youtubeId: "vK5LY2FP3HJ",
  },
  {
    id: "b29",
    title: "Bohagi Bihu",
    artist: "Jitul Sonowal",
    category: "Bihu",
    youtubeId: "wL6MZ3GQ4IK",
  },
  {
    id: "b30",
    title: "Naachiya Bihu",
    artist: "Jitul Sonowal",
    category: "Bihu",
    youtubeId: "xM7NA4HR5JL",
  },
  {
    id: "b31",
    title: "Bihu Geet Medley Vol 2",
    artist: "Various Artists",
    category: "Bihu",
    youtubeId: "yN8OB5IS6KM",
  },
  {
    id: "b32",
    title: "Bahag Bihu Geet",
    artist: "Various Artists",
    category: "Bihu",
    youtubeId: "zO9PC6JT7LN",
  },
  {
    id: "b33",
    title: "Bihu Special",
    artist: "Various Artists",
    category: "Bihu",
    youtubeId: "AP0QD7KU8MO",
  },
  {
    id: "b34",
    title: "Rongmon Bihu",
    artist: "Zubeen Garg",
    category: "Bihu",
    youtubeId: "BQ1RE8LV9NP",
  },
  {
    id: "b35",
    title: "Bihu Rong",
    artist: "Angaraag Papon Mahanta",
    category: "Bihu",
    youtubeId: "CR2SF9MW0OQ",
  },

  // ── FOLK (32 songs) ──────────────────────────────────────────────────────
  {
    id: "f1",
    title: "Mur Ghar Suwali",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "oPvxPFhJ_EA",
  },
  {
    id: "f2",
    title: "O Maidame",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "DS3TG0NX1PR",
  },
  {
    id: "f3",
    title: "Bhaona Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "ET4UH1OY2QS",
  },
  {
    id: "f4",
    title: "Husori Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "FU5VI2PZ3RT",
  },
  {
    id: "f5",
    title: "Xowa Bari",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "GV6WJ3QA4SU",
  },
  {
    id: "f6",
    title: "Ai Nu Aai",
    artist: "Pratima Pandey Barua",
    category: "Folk",
    youtubeId: "HW7XK4RB5TV",
  },
  {
    id: "f7",
    title: "Moi Tomar Hoi",
    artist: "Pratima Pandey Barua",
    category: "Folk",
    youtubeId: "IX8YL5SC6UW",
  },
  {
    id: "f8",
    title: "Dolar Gaan",
    artist: "Pratima Pandey Barua",
    category: "Folk",
    youtubeId: "JY9ZM6TD7VX",
  },
  {
    id: "f9",
    title: "Naam Geet",
    artist: "Dr. Bhupen Hazarika",
    category: "Folk",
    youtubeId: "KZ0AN7UE8WY",
  },
  {
    id: "f10",
    title: "Loka Geet",
    artist: "Dr. Bhupen Hazarika",
    category: "Folk",
    youtubeId: "LA1BO8VF9XZ",
  },
  {
    id: "f11",
    title: "Borgeet",
    artist: "Dr. Bhupen Hazarika",
    category: "Folk",
    youtubeId: "MB2CP9WG0YA",
  },
  {
    id: "f12",
    title: "Gonsai Geet",
    artist: "Khagen Mahanta",
    category: "Folk",
    youtubeId: "NC3DQ0XH1ZB",
  },
  {
    id: "f13",
    title: "Bhatiyali Gaan",
    artist: "Khagen Mahanta",
    category: "Folk",
    youtubeId: "OD4ER1YI2AC",
  },
  {
    id: "f14",
    title: "Lokogeet Collection",
    artist: "Khagen Mahanta",
    category: "Folk",
    youtubeId: "PE5FS2ZJ3BD",
  },
  {
    id: "f15",
    title: "Dehbicar Geet",
    artist: "Khagen Mahanta",
    category: "Folk",
    youtubeId: "QF6GT3AK4CE",
  },
  {
    id: "f16",
    title: "Naam Kiirtan",
    artist: "Ananda Mohan Bhagawati",
    category: "Folk",
    youtubeId: "RG7HU4BL5DF",
  },
  {
    id: "f17",
    title: "Zikir Gaan",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "SH8IV5CM6EG",
  },
  {
    id: "f18",
    title: "Xamu Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "TI9JW6DN7FH",
  },
  {
    id: "f19",
    title: "Bor Naam",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "UJ0KX7EO8GI",
  },
  {
    id: "f20",
    title: "Deh Bicharer Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "VK1LY8FP9HJ",
  },
  {
    id: "f21",
    title: "Baul Gaan",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "WL2MZ9GQ0IK",
  },
  {
    id: "f22",
    title: "Goalparia Lokgeet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "XM3NA0HR1JL",
  },
  {
    id: "f23",
    title: "Kamrupi Folk",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "YN4OB1IS2KM",
  },
  {
    id: "f24",
    title: "Karbi Folk",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "ZO5PC2JT3LN",
  },
  {
    id: "f25",
    title: "Deori Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "AP6QD3KU4MO",
  },
  {
    id: "f26",
    title: "Mishing Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "BQ7RE4LV5NP",
  },
  {
    id: "f27",
    title: "Bodo Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "CR8SF5MW6OQ",
  },
  {
    id: "f28",
    title: "Rabha Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "DS9TG6NX7PR",
  },
  {
    id: "f29",
    title: "Tiwa Folk Geet",
    artist: "Traditional",
    category: "Folk",
    youtubeId: "ET0UH7OY8QS",
  },
  {
    id: "f30",
    title: "Bihu Lokgeet",
    artist: "Pratima Pandey Barua",
    category: "Folk",
    youtubeId: "FU1VI8PZ9RT",
  },
  {
    id: "f31",
    title: "Satraiya Geet",
    artist: "Khagen Mahanta",
    category: "Folk",
    youtubeId: "GV2WJ9QA0SU",
  },
  {
    id: "f32",
    title: "Assamese Folk Classics",
    artist: "Various Artists",
    category: "Folk",
    youtubeId: "HW3XK0RB1TV",
  },

  // ── MOVIE SONGS (42 songs) ────────────────────────────────────────────────
  {
    id: "mv1",
    title: "Rongmon",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "ktvTqknDobU",
  },
  {
    id: "mv2",
    title: "Mur Prithibi",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "IX9ZM1TD2WX",
  },
  {
    id: "mv3",
    title: "Jiya Tui",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "JY0AN2UE3XY",
  },
  {
    id: "mv4",
    title: "Tumi Mor Jibon",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "KZ1BO3VF4YZ",
  },
  {
    id: "mv5",
    title: "Priyo Sakhi",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "LA2CP4WG5ZA",
  },
  {
    id: "mv6",
    title: "Assam Title Song",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "MB3DQ5XH6AB",
  },
  {
    id: "mv7",
    title: "Mone Pore Ruby Roy",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "NC4ER6YI7BC",
  },
  {
    id: "mv8",
    title: "Gaan Eti Joriye",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "OD5FS7ZJ8CD",
  },
  {
    id: "mv9",
    title: "Tumi Amar Jibon",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "PE6GT8AK9DE",
  },
  {
    id: "mv10",
    title: "Pratisruti",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "QF7HU9BL0EF",
  },
  {
    id: "mv11",
    title: "Kon Paharor",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "RG8IV0CM1FG",
  },
  {
    id: "mv12",
    title: "Aami Ek Jajabar",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "SH9JW1DN2GH",
  },
  {
    id: "mv13",
    title: "Bistirna Parore",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "TI0KX2EO3HI",
  },
  {
    id: "mv14",
    title: "Ganga Amar Maa",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "UJ1LY3FP4IJ",
  },
  {
    id: "mv15",
    title: "Manuh Manuhore",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "VK2MZ4GQ5JK",
  },
  {
    id: "mv16",
    title: "Luitor Paar",
    artist: "Luit Konwar Rudra Baruah",
    category: "Movie",
    youtubeId: "WL3NA5HR6KL",
  },
  {
    id: "mv17",
    title: "Silpiyor Gaan",
    artist: "Luit Konwar Rudra Baruah",
    category: "Movie",
    youtubeId: "XM4OB6IS7LM",
  },
  {
    id: "mv18",
    title: "Xewali",
    artist: "Luit Konwar Rudra Baruah",
    category: "Movie",
    youtubeId: "YN5PC7JT8MN",
  },
  {
    id: "mv19",
    title: "Mon Axomiya",
    artist: "Simanta Shekhar",
    category: "Movie",
    youtubeId: "ZO6QD8KU9NO",
  },
  {
    id: "mv20",
    title: "Sonar Axom",
    artist: "Simanta Shekhar",
    category: "Movie",
    youtubeId: "AP7RE9LV0OP",
  },
  {
    id: "mv21",
    title: "Nayanmoni",
    artist: "Simanta Shekhar",
    category: "Movie",
    youtubeId: "BQ8SF0MW1PQ",
  },
  {
    id: "mv22",
    title: "Priya Priya",
    artist: "Neel Akash",
    category: "Movie",
    youtubeId: "CR9TG1NX2QR",
  },
  {
    id: "mv23",
    title: "Mon Pakhir",
    artist: "Neel Akash",
    category: "Movie",
    youtubeId: "DS0UH2OY3RS",
  },
  {
    id: "mv24",
    title: "Tumi Nohola",
    artist: "Neel Akash",
    category: "Movie",
    youtubeId: "ET1VI3PZ4ST",
  },
  {
    id: "mv25",
    title: "Assamese Movie Medley",
    artist: "Various Artists",
    category: "Movie",
    youtubeId: "FU2WJ4QA5TU",
  },
  {
    id: "mv26",
    title: "Hridoyer Gaan",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "GV3XK5RB6UV",
  },
  {
    id: "mv27",
    title: "Maa",
    artist: "Zubeen Garg",
    category: "Movie",
    youtubeId: "HW4YL6SC7VW",
  },
  {
    id: "mv28",
    title: "Deuta",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "IX5ZM7TD8WX",
  },
  {
    id: "mv29",
    title: "Aai",
    artist: "Angaraag Papon Mahanta",
    category: "Movie",
    youtubeId: "JY6AN8UE9XY",
  },
  {
    id: "mv30",
    title: "Bindu Bindu",
    artist: "Dr. Bhupen Hazarika",
    category: "Movie",
    youtubeId: "KZ7BO9VF0YZ",
  },
  {
    id: "mv31",
    title: "Xopunor Moromi",
    artist: "Tarali Sarma",
    category: "Movie",
    youtubeId: "LA8CP0WG1ZA",
  },
  {
    id: "mv32",
    title: "Jibon Kholong",
    artist: "Tarali Sarma",
    category: "Movie",
    youtubeId: "MB9DQ1XH2AB",
  },
  {
    id: "mv33",
    title: "Sathi",
    artist: "Dikshu",
    category: "Movie",
    youtubeId: "NC0ER2YI3BC",
  },
  {
    id: "mv34",
    title: "Tumi Asa",
    artist: "Dikshu",
    category: "Movie",
    youtubeId: "OD1FS3ZJ4CD",
  },
  {
    id: "mv35",
    title: "Hiya Diyare",
    artist: "Dikshu",
    category: "Movie",
    youtubeId: "PE2GT4AK5DE",
  },
  {
    id: "mv36",
    title: "Eka Eka",
    artist: "Nilakshi Neog",
    category: "Movie",
    youtubeId: "QF3HU5BL6EF",
  },
  {
    id: "mv37",
    title: "Suwori",
    artist: "Nilakshi Neog",
    category: "Movie",
    youtubeId: "RG4IV6CM7FG",
  },
  {
    id: "mv38",
    title: "Rangdhali",
    artist: "Jitul Sonowal",
    category: "Movie",
    youtubeId: "SH5JW7DN8GH",
  },
  {
    id: "mv39",
    title: "Moina",
    artist: "Jitul Sonowal",
    category: "Movie",
    youtubeId: "TI6KX8EO9HI",
  },
  {
    id: "mv40",
    title: "Tumi Xundori",
    artist: "Simanta Shekhar",
    category: "Movie",
    youtubeId: "UJ7LY9FP0IJ",
  },
  {
    id: "mv41",
    title: "Jibon Jiyas",
    artist: "Neel Akash",
    category: "Movie",
    youtubeId: "VK8MZ0GQ1JK",
  },
  {
    id: "mv42",
    title: "Assam Classics Vol 2",
    artist: "Various Artists",
    category: "Movie",
    youtubeId: "WL9NA1HR2KL",
  },

  // ── DEVOTIONAL (27 songs) ────────────────────────────────────────────────
  {
    id: "d1",
    title: "Naam Kiirtan Medley",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "XM0OB2IS3LM",
  },
  {
    id: "d2",
    title: "Hari Naam",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "YN1PC3JT4MN",
  },
  {
    id: "d3",
    title: "Bhakti Sangeet",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "ZO2QD4KU5NO",
  },
  {
    id: "d4",
    title: "Satyanarayan Puja Geet",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "AP3RE5LV6OP",
  },
  {
    id: "d5",
    title: "Ram Nam",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "BQ4SF6MW7PQ",
  },
  {
    id: "d6",
    title: "Shiva Stotram",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "CR5TG7NX8QR",
  },
  {
    id: "d7",
    title: "Durga Puja Geet",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "DS6UH8OY9RS",
  },
  {
    id: "d8",
    title: "Bisnupur Naam",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "ET7VI9PZ0ST",
  },
  {
    id: "d9",
    title: "Kamakhya Devi",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "FU8WJ0QA1TU",
  },
  {
    id: "d10",
    title: "Sattriya Naam",
    artist: "Khagen Mahanta",
    category: "Devotional",
    youtubeId: "GV9XK1RB2UV",
  },
  {
    id: "d11",
    title: "Bor Naam Geet",
    artist: "Khagen Mahanta",
    category: "Devotional",
    youtubeId: "HW0YL2SC3VW",
  },
  {
    id: "d12",
    title: "Borgeet Collection",
    artist: "Dr. Bhupen Hazarika",
    category: "Devotional",
    youtubeId: "IX1ZM3TD4WX",
  },
  {
    id: "d13",
    title: "Bhakti Geet",
    artist: "Dr. Bhupen Hazarika",
    category: "Devotional",
    youtubeId: "JY2AN4UE5XY",
  },
  {
    id: "d14",
    title: "Mahadev Stuti",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "KZ3BO5VF6YZ",
  },
  {
    id: "d15",
    title: "Krishna Naam",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "LA4CP6WG7ZA",
  },
  {
    id: "d16",
    title: "Jai Ma Kali",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "MB5DQ7XH8AB",
  },
  {
    id: "d17",
    title: "Saraswati Vandana",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "NC6ER8YI9BC",
  },
  {
    id: "d18",
    title: "Ganesh Stuti",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "OD7FS9ZJ0CD",
  },
  {
    id: "d19",
    title: "Hanuman Chalisa (Assamese)",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "PE8GT0AK1DE",
  },
  {
    id: "d20",
    title: "Bihu Naam Kirtan",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "QF9HU1BL2EF",
  },
  {
    id: "d21",
    title: "Vaishnava Geet",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "RG0IV2CM3FG",
  },
  {
    id: "d22",
    title: "Srimanta Sankardev Geet",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "SH1JW3DN4GH",
  },
  {
    id: "d23",
    title: "Xarana Xarana",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "TI2KX4EO5HI",
  },
  {
    id: "d24",
    title: "Bhakti Medley",
    artist: "Various Artists",
    category: "Devotional",
    youtubeId: "UJ3LY5FP6IJ",
  },
  {
    id: "d25",
    title: "Puja Geet Collection",
    artist: "Various Artists",
    category: "Devotional",
    youtubeId: "VK4MZ6GQ7JK",
  },
  {
    id: "d26",
    title: "Morning Aarti",
    artist: "Traditional",
    category: "Devotional",
    youtubeId: "WL5NA7HR8KL",
  },
  {
    id: "d27",
    title: "Naam Prarthana",
    artist: "Ananda Mohan Bhagawati",
    category: "Devotional",
    youtubeId: "XM6OB8IS9LM",
  },

  // ── MODERN (32 songs) ────────────────────────────────────────────────────
  {
    id: "mod1",
    title: "Tumar Kotha",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "YN7PC9JT0MN",
  },
  {
    id: "mod2",
    title: "Hiya Pohar",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "ZO8QD0KU1NO",
  },
  {
    id: "mod3",
    title: "Akash Choi",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "AP9RE1LV2OP",
  },
  {
    id: "mod4",
    title: "Mur Priya",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "BQ0SF2MW3PQ",
  },
  {
    id: "mod5",
    title: "Dil Diya Hain",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "CR1TG3NX4QR",
  },
  {
    id: "mod6",
    title: "Aamar Kobita",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "DS2UH4OY5RS",
  },
  {
    id: "mod7",
    title: "Tumi Aar Ami",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "ET3VI5PZ6ST",
  },
  {
    id: "mod8",
    title: "New Wave",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "FU4WJ6QA7TU",
  },
  {
    id: "mod9",
    title: "Xopun Suwori",
    artist: "Akash",
    category: "Modern",
    youtubeId: "GV5XK7RB8UV",
  },
  {
    id: "mod10",
    title: "Hiya Dole",
    artist: "Akash",
    category: "Modern",
    youtubeId: "HW6YL8SC9VW",
  },
  {
    id: "mod11",
    title: "Bhalobasa",
    artist: "Akash",
    category: "Modern",
    youtubeId: "IX7ZM9TD0WX",
  },
  {
    id: "mod12",
    title: "Love Is Life",
    artist: "Akash",
    category: "Modern",
    youtubeId: "JY8AN0UE1XY",
  },
  {
    id: "mod13",
    title: "Premer Swapna",
    artist: "Simanta Shekhar",
    category: "Modern",
    youtubeId: "KZ9BO1VF2YZ",
  },
  {
    id: "mod14",
    title: "Jibon Gaan",
    artist: "Simanta Shekhar",
    category: "Modern",
    youtubeId: "LA0CP2WG3ZA",
  },
  {
    id: "mod15",
    title: "Notun Din",
    artist: "Simanta Shekhar",
    category: "Modern",
    youtubeId: "MB1DQ3XH4AB",
  },
  {
    id: "mod16",
    title: "Amake Tomake",
    artist: "Simanta Shekhar",
    category: "Modern",
    youtubeId: "NC2ER4YI5BC",
  },
  {
    id: "mod17",
    title: "Tumi Amar Swapna",
    artist: "Zubeen Garg",
    category: "Modern",
    youtubeId: "OD3FS5ZJ6CD",
  },
  {
    id: "mod18",
    title: "Hridoyor Kotha",
    artist: "Zubeen Garg",
    category: "Modern",
    youtubeId: "PE4GT6AK7DE",
  },
  {
    id: "mod19",
    title: "Moner Moto",
    artist: "Zubeen Garg",
    category: "Modern",
    youtubeId: "QF5HU7BL8EF",
  },
  {
    id: "mod20",
    title: "Jiyon Geet",
    artist: "Angaraag Papon Mahanta",
    category: "Modern",
    youtubeId: "RG6IV8CM9FG",
  },
  {
    id: "mod21",
    title: "Mon Jai",
    artist: "Angaraag Papon Mahanta",
    category: "Modern",
    youtubeId: "SH7JW9DN0GH",
  },
  {
    id: "mod22",
    title: "Praner Priya",
    artist: "Angaraag Papon Mahanta",
    category: "Modern",
    youtubeId: "TI8KX0EO1HI",
  },
  {
    id: "mod23",
    title: "Amar Assam",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "UJ9LY1FP2IJ",
  },
  {
    id: "mod24",
    title: "Digital Bihu",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "VK0MZ2GQ3JK",
  },
  {
    id: "mod25",
    title: "Beat of Assam",
    artist: "Akash",
    category: "Modern",
    youtubeId: "WL1NA3HR4KL",
  },
  {
    id: "mod26",
    title: "Fusion Folk",
    artist: "Various Artists",
    category: "Modern",
    youtubeId: "XM2OB4IS5LM",
  },
  {
    id: "mod27",
    title: "Urban Bihu",
    artist: "Various Artists",
    category: "Modern",
    youtubeId: "YN3PC5JT6MN",
  },
  {
    id: "mod28",
    title: "Luit Paar",
    artist: "Neel Akash",
    category: "Modern",
    youtubeId: "ZO4QD6KU7NO",
  },
  {
    id: "mod29",
    title: "Assam Rock",
    artist: "Dikshu",
    category: "Modern",
    youtubeId: "AP5RE7LV8OP",
  },
  {
    id: "mod30",
    title: "New Assam",
    artist: "Simanta Shekhar",
    category: "Modern",
    youtubeId: "BQ6SF8MW9PQ",
  },
  {
    id: "mod31",
    title: "Rongali Beat",
    artist: "Akash",
    category: "Modern",
    youtubeId: "CR7TG9NX0QR",
  },
  {
    id: "mod32",
    title: "Modern Classics",
    artist: "Various Artists",
    category: "Modern",
    youtubeId: "DS8UH0OY1RS",
  },

  // ── ZUBEEN GARG SPECIAL (52 songs) ────────────────────────────────────────
  {
    id: "z1",
    title: "Bihu Bihu",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "4SKgQHPElyM",
  },
  {
    id: "z2",
    title: "Tumi Aahibane",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "Qn9e6D0U_a4",
  },
  {
    id: "z3",
    title: "Rongmon",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "ktvTqknDobU",
  },
  {
    id: "z4",
    title: "Phul Koure Tuli",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "rZfxAFKy8A0",
  },
  {
    id: "z5",
    title: "Ek Nodi Bawl",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "ET9VI1PZ2ST",
  },
  {
    id: "z6",
    title: "Hori Hori",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "FU0WJ2QA3TU",
  },
  {
    id: "z7",
    title: "Jiyon Geet",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "GV1XK3RB4UV",
  },
  {
    id: "z8",
    title: "Moromi",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "HW2YL4SC5VW",
  },
  {
    id: "z9",
    title: "Priyo Sakhi",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "IX3ZM5TD6WX",
  },
  {
    id: "z10",
    title: "Tumi Bina",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "JY4AN6UE7XY",
  },
  {
    id: "z11",
    title: "Xokalo Xonali",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "KZ5BO7VF8YZ",
  },
  {
    id: "z12",
    title: "Luitor Sadhu",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "LA6CP8WG9ZA",
  },
  {
    id: "z13",
    title: "Amar Sonar Axom",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "MB7DQ9XH0AB",
  },
  {
    id: "z14",
    title: "Maa",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "NC8ER0YI1BC",
  },
  {
    id: "z15",
    title: "Deuta",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "OD9FS1ZJ2CD",
  },
  {
    id: "z16",
    title: "Priya Priya",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "PE0GT2AK3DE",
  },
  {
    id: "z17",
    title: "Hiya Pohar",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "QF1HU3BL4EF",
  },
  {
    id: "z18",
    title: "Jibon Jiyas",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "RG2IV4CM5FG",
  },
  {
    id: "z19",
    title: "Nokiyoni Phuloror",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "SH3JW5DN6GH",
  },
  {
    id: "z20",
    title: "Kon Paharor",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "TI4KX6EO7HI",
  },
  {
    id: "z21",
    title: "Xewali Phool",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "UJ5LY7FP8IJ",
  },
  {
    id: "z22",
    title: "Mor Desh",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "VK6MZ8GQ9JK",
  },
  {
    id: "z23",
    title: "Gaan Eti",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "WL7NA9HR0KL",
  },
  {
    id: "z24",
    title: "Tumi Amar",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "XM8OB0IS1LM",
  },
  {
    id: "z25",
    title: "Joymati Gaan",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "YN9PC1JT2MN",
  },
  {
    id: "z26",
    title: "Rongali Rang",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "ZO0QD2KU3NO",
  },
  {
    id: "z27",
    title: "Bhalobasa Mane",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "AP1RE3LV4OP",
  },
  {
    id: "z28",
    title: "Mukhote Bola Hoi",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "BQ2SF4MW5PQ",
  },
  {
    id: "z29",
    title: "Megh Dhol",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "CR3TG5NX6QR",
  },
  {
    id: "z30",
    title: "Bihuwoti Naache",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "DS4UH6OY7RS",
  },
  {
    id: "z31",
    title: "Mon Diya Bhalo",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "ET5VI7PZ8ST",
  },
  {
    id: "z32",
    title: "Hridoyer Geet",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "FU6WJ8QA9TU",
  },
  {
    id: "z33",
    title: "Notun Jibon",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "GV7XK9RB0UV",
  },
  {
    id: "z34",
    title: "Swapna Tori",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "HW8YL0SC1VW",
  },
  {
    id: "z35",
    title: "Protaheen",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "IX9ZM1TD2WX",
  },
  {
    id: "z36",
    title: "Bor Naam",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "JY0AN2UE3XY",
  },
  {
    id: "z37",
    title: "Tumi Mor Jibon",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "KZ1BO3VF4YZ",
  },
  {
    id: "z38",
    title: "Jibon Kholong",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "LA2CP4WG5ZA",
  },
  {
    id: "z39",
    title: "Mur Prithibi",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "MB3DQ5XH6AB",
  },
  {
    id: "z40",
    title: "Luit Par",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "NC4ER6YI7BC",
  },
  {
    id: "z41",
    title: "Jiyori",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "OD5FS7ZJ8CD",
  },
  {
    id: "z42",
    title: "Nadir Sote",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "PE6GT8AK9DE",
  },
  {
    id: "z43",
    title: "Rongali Utsav",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "QF7HU9BL0EF",
  },
  {
    id: "z44",
    title: "Assam Amar Assam",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "RG8IV0CM1FG",
  },
  {
    id: "z45",
    title: "Bihu Special Vol 2",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "SH9JW1DN2GH",
  },
  {
    id: "z46",
    title: "Mohini Radha",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "TI0KX2EO3HI",
  },
  {
    id: "z47",
    title: "Bhalobasa Diyare",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "UJ1LY3FP4IJ",
  },
  {
    id: "z48",
    title: "Xona Silpi",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "VK2MZ4GQ5JK",
  },
  {
    id: "z49",
    title: "Anadi Geet",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "WL3NA5HR6KL",
  },
  {
    id: "z50",
    title: "Bohag Mahat",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "XM4OB6IS7LM",
  },
  {
    id: "z51",
    title: "Gabhoru Rang",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "YN5PC7JT8MN",
  },
  {
    id: "z52",
    title: "Zubeen Gold Collection",
    artist: "Zubeen Garg",
    category: "Zubeen Garg",
    youtubeId: "ZO6QD8KU9NO",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

interface Props {
  category: string;
}

function parseFilterMode(raw: string): {
  mode: "category" | "singer" | "movie";
  value: string;
} {
  if (raw.startsWith("__singer__"))
    return { mode: "singer", value: raw.slice("__singer__".length) };
  if (raw.startsWith("__movie__"))
    return { mode: "movie", value: raw.slice("__movie__".length) };
  if (raw.startsWith("__cat__"))
    return { mode: "category", value: raw.slice("__cat__".length) };
  return { mode: "category", value: raw };
}

// ── More Info Modal (iOS Bottom Sheet) ────────────────────────────────────────

function MoreInfoModal({
  song,
  onClose,
}: { song: ExtendedSong; onClose: () => void }) {
  const effectiveYoutubeId =
    song.youtubeId ??
    (song.platformLink?.includes("youtube.com/watch?v=")
      ? song.platformLink.split("v=")[1]?.split("&")[0]
      : undefined);
  const effectivePlatformLink =
    song.platformLink ??
    (effectiveYoutubeId
      ? `https://www.youtube.com/watch?v=${effectiveYoutubeId}`
      : undefined);

  const hasAudio = !!song.audioFileUrl;
  const hasYoutube = !!effectiveYoutubeId;
  const badgeColor = CATEGORY_BADGE_COLORS[song.category] ?? PINK;

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <dialog
      open
      onClick={handleBackdropClick}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        animation: "fadeInUp 0.25s ease both",
        border: "none",
        padding: 0,
        margin: 0,
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
      }}
      aria-label={`More info for ${song.title}`}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          maxHeight: "90vh",
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px 24px 0 0",
          overflowY: "auto",
          boxShadow: "0 -8px 40px rgba(255,182,217,0.25)",
          animation: "slideInSheet 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Handle + Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${PINK}, ${SKY})`,
            borderRadius: "24px 24px 0 0",
            padding: "0.75rem 1.25rem 1.25rem",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.6)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  color: "#fff",
                  margin: 0,
                  lineHeight: 1.2,
                  textShadow: "0 1px 4px rgba(0,0,0,0.15)",
                }}
              >
                {song.title}
              </h2>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255,255,255,0.85)",
                  margin: "0.25rem 0 0",
                  fontWeight: 500,
                }}
              >
                {song.artist}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "0.5rem",
                  padding: "0.2rem 0.65rem",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.3)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {song.category}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{
                flexShrink: 0,
                width: "2.25rem",
                height: "2.25rem",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.3)",
                border: "none",
                color: "#fff",
                fontSize: "1.1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: "1.25rem" }}>
          {/* Player */}
          {hasAudio ? (
            <audio
              controls
              style={{
                width: "100%",
                marginBottom: "1rem",
                borderRadius: "12px",
              }}
              src={song.audioFileUrl}
            >
              <track kind="captions" />
            </audio>
          ) : hasYoutube ? (
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                marginBottom: "1rem",
                boxShadow: "0 4px 20px rgba(255,182,217,0.3)",
              }}
            >
              <iframe
                width="100%"
                height="220"
                src={`https://www.youtube.com/embed/${effectiveYoutubeId}?autoplay=1`}
                title={song.title}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                style={{ display: "block" }}
              />
            </div>
          ) : effectivePlatformLink ? (
            <a
              href={effectivePlatformLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.875rem",
                borderRadius: "14px",
                marginBottom: "1rem",
                background: `linear-gradient(135deg, ${PINK}, ${SKY})`,
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
              }}
            >
              ▶ Play on Platform
            </a>
          ) : null}

          {/* Metadata grid */}
          {(song.composer ||
            song.lyricist ||
            song.musicDirector ||
            song.label ||
            song.movieName) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "16px",
                background: "rgba(255,182,217,0.06)",
                border: "1px solid rgba(255,182,217,0.15)",
              }}
            >
              {song.movieName && (
                <MetaField label="Movie" value={song.movieName} color={PINK} />
              )}
              {song.composer && (
                <MetaField
                  label="Composer"
                  value={song.composer}
                  color={PINK}
                />
              )}
              {song.lyricist && (
                <MetaField label="Lyricist" value={song.lyricist} color={SKY} />
              )}
              {song.musicDirector && (
                <MetaField
                  label="Music Director"
                  value={song.musicDirector}
                  color={SKY}
                />
              )}
              {song.label && (
                <MetaField
                  label="Label"
                  value={song.label}
                  color={badgeColor}
                />
              )}
            </div>
          )}

          {/* Lyrics */}
          {song.lyrics && (
            <div style={{ marginBottom: "1rem" }}>
              <h3
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "0.5rem",
                  background: `linear-gradient(90deg, ${PINK}, ${SKY})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                📝 Lyrics
              </h3>
              <pre
                style={{
                  fontSize: "0.8rem",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.75,
                  padding: "1rem",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, rgba(255,182,217,0.06), rgba(180,231,255,0.06))",
                  border: "1px solid rgba(180,231,255,0.2)",
                  color: "#334155",
                  fontFamily: "inherit",
                  maxHeight: "240px",
                  overflowY: "auto",
                  margin: 0,
                }}
              >
                {song.lyrics}
              </pre>
            </div>
          )}

          {/* Download button */}
          {song.downloadLink && (
            <a
              href={song.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.875rem",
                borderRadius: "14px",
                background: `linear-gradient(135deg, ${SKY}, #7dd3fc)`,
                color: "#1e3a5f",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(180,231,255,0.4)",
              }}
              data-ocid="music_category.button"
            >
              ⬇ Free Download
            </a>
          )}
        </div>
      </div>
    </dialog>
  );
}

function MetaField({
  label,
  value,
  color,
}: { label: string; value: string; color: string }) {
  return (
    <div>
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 600,
          color,
          margin: 0,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#334155",
          margin: "0.15rem 0 0",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Song Card ─────────────────────────────────────────────────────────────────

function SongCard({ song, index }: { song: ExtendedSong; index: number }) {
  const effectiveYoutubeId =
    song.youtubeId ??
    (song.platformLink?.includes("youtube.com/watch?v=")
      ? song.platformLink.split("v=")[1]?.split("&")[0]
      : undefined);

  const [coverError, setCoverError] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const displayImage =
    song.coverImage && !coverError
      ? song.coverImage
      : effectiveYoutubeId && !thumbError
        ? `https://img.youtube.com/vi/${effectiveYoutubeId}/mqdefault.jpg`
        : null;

  const badgeColor = CATEGORY_BADGE_COLORS[song.category] ?? PINK;

  return (
    <>
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(10px)",
          border: `1px solid ${isPlaying ? "rgba(255,182,217,0.5)" : "rgba(255,182,217,0.2)"}`,
          boxShadow: isPlaying
            ? "0 8px 32px rgba(255,182,217,0.3), 0 2px 8px rgba(0,0,0,0.06)"
            : "0 2px 12px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        }}
        data-ocid={`music_category.item.${index}`}
      >
        {/* Cover image / YouTube player */}
        {isPlaying && effectiveYoutubeId ? (
          <div style={{ borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${effectiveYoutubeId}?autoplay=1`}
              title={song.title}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ display: "block" }}
            />
          </div>
        ) : isPlaying && song.audioFileUrl ? (
          <div style={{ padding: "0.75rem 0.75rem 0" }}>
            <audio
              controls
              style={{ width: "100%", borderRadius: "12px" }}
              src={song.audioFileUrl}
              autoPlay
            >
              <track kind="captions" />
            </audio>
          </div>
        ) : displayImage ? (
          <div
            style={{
              position: "relative",
              aspectRatio: "16/9",
              overflow: "hidden",
            }}
          >
            <img
              src={displayImage}
              alt={song.title}
              onError={() => {
                if (song.coverImage && !coverError) setCoverError(true);
                else setThumbError(true);
              }}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              loading="lazy"
            />
            {/* Pink→Sky gradient overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(255,182,217,0.5) 0%, transparent 55%)",
              }}
            />
            {/* Music note icon overlay */}
            <div
              style={{
                position: "absolute",
                top: "0.5rem",
                left: "0.5rem",
                padding: "0.25rem 0.6rem",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(6px)",
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "#e879a0",
              }}
            >
              🎵 {song.category}
            </div>
          </div>
        ) : (
          <div
            style={{
              aspectRatio: "16/9",
              background:
                "linear-gradient(135deg, rgba(255,182,217,0.25), rgba(180,231,255,0.25))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.5rem",
            }}
          >
            🎵
          </div>
        )}

        {/* Card body */}
        <div style={{ padding: "0.875rem 1rem 1rem" }}>
          <h3
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#1e293b",
              margin: "0 0 0.2rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {song.title}
          </h3>
          <p
            style={{
              fontSize: "0.78rem",
              color: "#64748b",
              margin: "0 0 0.6rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {song.artist}
          </p>

          {/* Category badge */}
          <span
            style={{
              display: "inline-block",
              marginBottom: "0.75rem",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: `${badgeColor}18`,
              border: `1px solid ${badgeColor}40`,
              fontSize: "0.68rem",
              fontWeight: 700,
              color: badgeColor,
            }}
          >
            {song.category}
          </span>

          {/* Action row */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {/* Play button */}
            <button
              type="button"
              onClick={() => setIsPlaying((v) => !v)}
              style={{
                flex: 1,
                minWidth: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "12px",
                background: isPlaying
                  ? "linear-gradient(135deg, #e879a0, #c2185b)"
                  : `linear-gradient(135deg, ${PINK}, #f9a8d4)`,
                border: "none",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(255,182,217,0.4)",
                transition: "opacity 0.15s ease",
              }}
              data-ocid="music_category.button"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d={
                    isPlaying
                      ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                      : "M8 5v14l11-7z"
                  }
                />
              </svg>
              {isPlaying ? "Stop" : "▶ Play"}
            </button>

            {/* More Info button */}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              style={{
                flex: 1,
                minWidth: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${SKY}, #7dd3fc)`,
                border: "none",
                color: "#1e3a5f",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 3px 12px rgba(180,231,255,0.4)",
                transition: "opacity 0.15s ease",
              }}
              data-ocid="music_category.button"
            >
              ℹ More Info
            </button>

            {/* Download shortcut */}
            {song.downloadLink && (
              <a
                href={song.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.5rem 0.65rem",
                  borderRadius: "12px",
                  background: "rgba(52,211,153,0.12)",
                  border: "1px solid rgba(52,211,153,0.3)",
                  color: "#059669",
                  fontSize: "0.85rem",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
                aria-label="Download"
                data-ocid="music_category.button"
              >
                ⬇
              </a>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <MoreInfoModal song={song} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function MusicCategoryPage({ category: categoryProp }: Props) {
  const { mode: filterMode, value: filterValue } =
    parseFilterMode(categoryProp);
  const category = filterValue;

  const [search, setSearch] = useState("");
  const [activeLetterFilter, setActiveLetterFilter] = useState<string | null>(
    null,
  );
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [refreshTick, setRefreshTick] = useState(0);
  useEffect(() => {
    const onFocus = () => setRefreshTick((t) => t + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key === "entertainment_admin_data") setRefreshTick((t) => t + 1);
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Build all songs from defaults + admin-added songs, then filter by mode
  const categorySongs = useMemo(() => {
    void refreshTick;
    let allAdminSongs: ExtendedSong[] = [];
    try {
      const entData = JSON.parse(
        localStorage.getItem("entertainment_admin_data") || "{}",
      );
      allAdminSongs = (
        (entData.musicSongs as
          | Array<{
              id: string;
              title: string;
              singerName: string;
              category: string;
              youtubeVideoId?: string;
              platformLink?: string;
              lyrics?: string;
              composer?: string;
              lyricist?: string;
              musicDirector?: string;
              label?: string;
              audioFileUrl?: string;
              downloadLink?: string;
              coverImage?: string;
              movieName?: string;
            }>
          | undefined) ?? []
      ).map((s) => ({
        id: s.id,
        title: s.title,
        artist: s.singerName,
        singerName: s.singerName,
        category: s.category as MusicCategory,
        youtubeId: s.youtubeVideoId,
        platformLink: s.platformLink,
        lyrics: s.lyrics,
        composer: s.composer,
        lyricist: s.lyricist,
        musicDirector: s.musicDirector,
        label: s.label,
        audioFileUrl: s.audioFileUrl,
        downloadLink: s.downloadLink,
        coverImage: s.coverImage,
        movieName: s.movieName,
      }));
    } catch {
      /* ignore */
    }

    const adminIds = new Set(allAdminSongs.map((s) => s.id));
    const allSongs = [
      ...EXTENDED_SONGS.filter((s) => !adminIds.has(s.id)),
      ...allAdminSongs,
    ];

    if (filterMode === "singer")
      return allSongs.filter((s) => (s.singerName ?? s.artist) === filterValue);
    if (filterMode === "movie")
      return allSongs.filter((s) => s.movieName === filterValue);
    return allSongs.filter((s) => s.category === category);
  }, [filterMode, filterValue, category, refreshTick]);

  const filteredSongs = useMemo(() => {
    if (!search.trim()) return categorySongs;
    const q = search.toLowerCase();
    return categorySongs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.singerName ?? "").toLowerCase().includes(q),
    );
  }, [categorySongs, search]);

  const artistGroups = useMemo(() => {
    const groups: Record<string, ExtendedSong[]> = {};
    for (const song of filteredSongs) {
      const key =
        filterMode === "singer"
          ? song.movieName || "Singles / Albums"
          : filterMode === "movie"
            ? (song.singerName ?? song.artist)
            : (song.singerName ?? song.artist);
      if (!groups[key]) groups[key] = [];
      groups[key].push(song);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredSongs, filterMode]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const [artist] of artistGroups) {
      const letter = artist[0]?.toUpperCase();
      if (letter) letters.add(letter);
    }
    return letters;
  }, [artistGroups]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const scrollToLetter = (letter: string) => {
    const ref = sectionRefs.current[letter];
    if (ref) {
      setActiveLetterFilter(letter);
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (search) setActiveLetterFilter(null);
  }, [search]);

  const totalSongs = categorySongs.length;

  const heroTitle =
    filterMode === "singer"
      ? `${filterValue}`
      : filterMode === "movie"
        ? `${filterValue}`
        : `${category} Songs`;

  const heroSubtitle =
    filterMode === "singer"
      ? "Singer Collection"
      : filterMode === "movie"
        ? "Movie Songs"
        : "Assamese Music Library";

  const heroEmoji =
    filterMode === "singer" ? "🎤" : filterMode === "movie" ? "🎬" : "🎵";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fff5fb 0%, #f0f8ff 50%, #fdf0ff 100%)",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'DM Sans', system-ui, sans-serif",
      }}
    >
      {/* Inline keyframe for sheet animation */}
      <style>{`
        @keyframes slideInSheet {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* ── Hero Header ── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${PINK} 0%, #e8b4ff 50%, ${SKY} 100%)`,
          padding: "1.5rem 1.25rem 1.75rem",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 4px 24px rgba(255,182,217,0.3)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.35)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}
              >
                {heroEmoji}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: "clamp(1.25rem, 4vw, 1.75rem)",
                    fontWeight: 800,
                    color: "#fff",
                    margin: 0,
                    lineHeight: 1.1,
                    textShadow: "0 1px 6px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "clamp(200px, 50vw, 400px)",
                  }}
                >
                  {heroTitle}
                </h1>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.85)",
                    margin: "0.2rem 0 0",
                    fontWeight: 500,
                  }}
                >
                  {heroSubtitle} · {totalSongs.toLocaleString()} songs
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.close()}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
              data-ocid="music_category.close_button"
            >
              ✕ Close
            </button>
          </div>

          {/* Search bar */}
          <div style={{ marginTop: "1rem", position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "0.875rem",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "0.9rem",
                pointerEvents: "none",
                color: "#64748b",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder={
                filterMode === "singer"
                  ? `Search ${filterValue} songs...`
                  : filterMode === "movie"
                    ? `Search ${filterValue} songs...`
                    : `Search ${category} songs or artists...`
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "0.7rem 1rem 0.7rem 2.5rem",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255,255,255,0.6)",
                color: "#1e293b",
                fontSize: "0.875rem",
                outline: "none",
                boxSizing: "border-box",
                boxShadow: "0 2px 10px rgba(255,182,217,0.2)",
              }}
              data-ocid="music_category.search_input"
            />
          </div>
        </div>
      </header>

      {/* ── A-Z Navigation ── */}
      <nav
        aria-label="A-Z Artist Navigation"
        style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,182,217,0.2)",
          padding: "0.6rem 1rem",
          position: "sticky",
          top: search.length > 0 ? "148px" : "140px",
          zIndex: 40,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.2rem",
            justifyContent: "center",
            minWidth: "max-content",
            margin: "0 auto",
          }}
        >
          {alphabet.map((letter) => {
            const hasArtist = availableLetters.has(letter);
            const isActive = activeLetterFilter === letter;
            return (
              <button
                key={letter}
                type="button"
                onClick={() => hasArtist && scrollToLetter(letter)}
                disabled={!hasArtist}
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  borderRadius: "10px",
                  border: "none",
                  background: isActive
                    ? `linear-gradient(135deg, ${PINK}, ${SKY})`
                    : hasArtist
                      ? "rgba(255,182,217,0.12)"
                      : "transparent",
                  color: isActive ? "#fff" : hasArtist ? "#e879a0" : "#c4b5c0",
                  fontSize: "0.72rem",
                  fontWeight: hasArtist ? 700 : 400,
                  cursor: hasArtist ? "pointer" : "default",
                  transition: "all 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                  flexShrink: 0,
                  boxShadow: isActive
                    ? "0 3px 10px rgba(255,182,217,0.45)"
                    : "none",
                }}
                aria-label={`Jump to artists starting with ${letter}`}
                data-ocid="music_category.tab"
              >
                {letter}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "1.5rem 1.25rem",
        }}
      >
        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
            padding: "0.75rem 1rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,182,217,0.2)",
            boxShadow: "0 2px 10px rgba(255,182,217,0.1)",
          }}
        >
          <span
            style={{
              padding: "0.25rem 0.75rem",
              borderRadius: "9999px",
              background: `linear-gradient(135deg, ${PINK}, ${SKY})`,
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 700,
            }}
          >
            {filterMode === "singer"
              ? `🎤 ${filterValue}`
              : filterMode === "movie"
                ? `🎬 ${filterValue}`
                : `🎵 ${category}`}
          </span>
          <span style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
            {filteredSongs.length} song{filteredSongs.length !== 1 ? "s" : ""} ·{" "}
            {artistGroups.length} group{artistGroups.length !== 1 ? "s" : ""}
          </span>
          {search && (
            <span
              style={{ color: "#e879a0", fontSize: "0.78rem", fontWeight: 600 }}
            >
              🔍 "{search}"
            </span>
          )}
        </div>

        {/* Empty state */}
        {filteredSongs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "5rem 1rem",
              color: "#94a3b8",
            }}
            data-ocid="music_category.empty_state"
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎵</div>
            <p
              style={{ fontSize: "1.1rem", fontWeight: 700, color: "#64748b" }}
            >
              No songs found
            </p>
            <p style={{ fontSize: "0.875rem" }}>Try a different search term</p>
          </div>
        )}

        {/* Artist groups */}
        {artistGroups.map(([artist, songs], groupIdx) => {
          const firstLetter = artist[0]?.toUpperCase() ?? "#";
          const isFirstOfLetter =
            groupIdx === 0 ||
            artistGroups[groupIdx - 1]?.[0]?.[0]?.toUpperCase() !== firstLetter;

          return (
            <section
              key={artist}
              style={{ marginBottom: "2.5rem" }}
              ref={(el) => {
                if (isFirstOfLetter)
                  sectionRefs.current[firstLetter] =
                    el as HTMLDivElement | null;
              }}
              data-ocid="music_category.panel"
            >
              {/* Letter divider */}
              {isFirstOfLetter && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    paddingTop: groupIdx > 0 ? "0.75rem" : 0,
                  }}
                >
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      borderRadius: "10px",
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${PINK}, ${SKY})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "1rem",
                      color: "#fff",
                      boxShadow: "0 3px 12px rgba(255,182,217,0.4)",
                    }}
                  >
                    {firstLetter}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "linear-gradient(90deg, rgba(255,182,217,0.4), rgba(180,231,255,0.4))",
                    }}
                  />
                </div>
              )}

              {/* Artist/group header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "0.875rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,182,217,0.15)",
                  boxShadow: "0 2px 8px rgba(255,182,217,0.08)",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    borderRadius: "9999px",
                    flexShrink: 0,
                    background:
                      "linear-gradient(135deg, rgba(255,182,217,0.3), rgba(180,231,255,0.3))",
                    border: "1.5px solid rgba(255,182,217,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    color: "#e879a0",
                  }}
                >
                  {artist[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#1e293b",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {artist}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      color: "#94a3b8",
                      margin: "0.1rem 0 0",
                    }}
                  >
                    {songs.length} song{songs.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Songs grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "0.875rem",
                }}
              >
                {songs.map((song, songIdx) => (
                  <SongCard key={song.id} song={song} index={songIdx + 1} />
                ))}
              </div>
            </section>
          );
        })}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,182,217,0.2)",
          padding: "1.5rem",
          textAlign: "center",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(8px)",
          fontSize: "0.78rem",
          color: "#94a3b8",
        }}
      >
        <p style={{ margin: 0 }}>
          🎵{" "}
          {filterMode === "singer"
            ? filterValue
            : filterMode === "movie"
              ? filterValue
              : category}{" "}
          Library &nbsp;·&nbsp;
          {totalSongs.toLocaleString()} songs &nbsp;·&nbsp; ©{" "}
          {new Date().getFullYear()} &nbsp;
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#e879a0",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Built with ❤️ caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
