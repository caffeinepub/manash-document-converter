import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "../App";
import { useInView } from "../hooks/useInView";

interface Props {
  navigate: (p: Page) => void;
}

// ── Data ────────────────────────────────────────────────────────────────────

const FUN_FACTS = [
  "The human brain can process images in as little as 13 milliseconds.",
  "Honey never spoils — 3,000-year-old honey found in Egyptian tombs is still edible.",
  "Assam produces more than 50% of India's total tea output.",
  "A group of flamingos is called a 'flamboyance'.",
  "The Brahmaputra River is one of the few rivers in the world that flows both west and east.",
  "Kaziranga National Park in Assam hosts 2/3 of the world's one-horned rhinos.",
  "The average person walks about 100,000 miles in their lifetime.",
  "Mount Everest grows about 4mm each year due to geological uplift.",
  "Assam's Majuli island is the world's largest river island.",
  "A snail can sleep for 3 years if the weather is too hot, cold, or dry.",
  "India has the world's largest postal network with over 1.5 lakh post offices.",
  "The peacock was declared India's national bird in 1963.",
  "Sanskrit is considered the mother of most Indian languages.",
  "The number of possible games of chess is greater than the number of atoms in the universe.",
  "Lightning strikes Earth about 100 times every second.",
  "Octopuses have three hearts and blue blood.",
  "Assam's one-horned rhino is the state animal and appears on its emblem.",
  "India launched the world's most affordable satellite mission — Mangalyaan — for ₹450 crore.",
  "A day on Venus is longer than a year on Venus.",
  "The Great Wall of China is not visible from space with the naked eye.",
];

const JOKES = [
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
  },
  {
    setup: "Why did the math book look so sad?",
    punchline: "Because it had too many problems.",
  },
  { setup: "What do you call a fish without eyes?", punchline: "A fsh!" },
  {
    setup: "Why do cows wear bells?",
    punchline: "Because their horns don't work!",
  },
  {
    setup: "What did one wall say to the other?",
    punchline: "I'll meet you at the corner!",
  },
  {
    setup: "Why can't you give Elsa a balloon?",
    punchline: "Because she'll let it go!",
  },
  {
    setup: "What do you call cheese that isn't yours?",
    punchline: "Nacho cheese!",
  },
  {
    setup: "Why did the bicycle fall over?",
    punchline: "Because it was two-tired!",
  },
  {
    setup: "How does a penguin build its house?",
    punchline: "Igloos it together!",
  },
  {
    setup: "What do you call a sleeping dinosaur?",
    punchline: "A dino-snore!",
  },
];

const ZODIAC_SIGNS = [
  {
    sign: "Aries",
    emoji: "♈",
    dates: "Mar 21 – Apr 19",
    element: "Fire",
    planet: "Mars",
  },
  {
    sign: "Taurus",
    emoji: "♉",
    dates: "Apr 20 – May 20",
    element: "Earth",
    planet: "Venus",
  },
  {
    sign: "Gemini",
    emoji: "♊",
    dates: "May 21 – Jun 20",
    element: "Air",
    planet: "Mercury",
  },
  {
    sign: "Cancer",
    emoji: "♋",
    dates: "Jun 21 – Jul 22",
    element: "Water",
    planet: "Moon",
  },
  {
    sign: "Leo",
    emoji: "♌",
    dates: "Jul 23 – Aug 22",
    element: "Fire",
    planet: "Sun",
  },
  {
    sign: "Virgo",
    emoji: "♍",
    dates: "Aug 23 – Sep 22",
    element: "Earth",
    planet: "Mercury",
  },
  {
    sign: "Libra",
    emoji: "♎",
    dates: "Sep 23 – Oct 22",
    element: "Air",
    planet: "Venus",
  },
  {
    sign: "Scorpio",
    emoji: "♏",
    dates: "Oct 23 – Nov 21",
    element: "Water",
    planet: "Pluto",
  },
  {
    sign: "Sagittarius",
    emoji: "♐",
    dates: "Nov 22 – Dec 21",
    element: "Fire",
    planet: "Jupiter",
  },
  {
    sign: "Capricorn",
    emoji: "♑",
    dates: "Dec 22 – Jan 19",
    element: "Earth",
    planet: "Saturn",
  },
  {
    sign: "Aquarius",
    emoji: "♒",
    dates: "Jan 20 – Feb 18",
    element: "Air",
    planet: "Uranus",
  },
  {
    sign: "Pisces",
    emoji: "♓",
    dates: "Feb 19 – Mar 20",
    element: "Water",
    planet: "Neptune",
  },
];

const HOROSCOPE_MESSAGES: Record<string, string[]> = {
  Aries: [
    "Today, your courage opens unexpected doors. Trust your instincts.",
    "A bold decision today leads to long-term rewards. Charge forward!",
    "Your leadership energy is at its peak. Guide others confidently.",
    "New beginnings spark joy. Embrace the adventure ahead.",
    "Challenges are just opportunities in disguise for you today.",
    "Your fiery spirit inspires everyone around you.",
    "Take that first step — success follows bold action.",
  ],
  Taurus: [
    "Patience pays off today. Good things are coming your way.",
    "Your steady efforts are noticed and rewarded.",
    "Comfort and beauty surround you. Enjoy life's pleasures.",
    "Financial decisions made today will prove wise.",
    "Your reliability makes you someone others depend on.",
    "Nature and fresh air will restore your energy today.",
    "Trust the slow and steady path — it leads to lasting success.",
  ],
  Gemini: [
    "Your wit and charm open social doors today.",
    "Communication is your superpower — use it wisely.",
    "New ideas flow freely. Write them down!",
    "A conversation today leads to an unexpected opportunity.",
    "Your curiosity leads you to fascinating discoveries.",
    "Networking brings positive results today.",
    "Adaptability is your greatest strength right now.",
  ],
  Cancer: [
    "Your intuition is spot-on today. Trust your gut feelings.",
    "Family and home bring comfort and joy today.",
    "Your empathy helps someone who truly needs it.",
    "Creative energy flows beautifully from your emotions.",
    "Protection and nurturing of loved ones feels deeply fulfilling.",
    "A heartfelt conversation brings healing today.",
    "Your sensitivity is a gift — use it to connect deeply.",
  ],
  Leo: [
    "Your natural charisma shines brightly today. Own the spotlight!",
    "Recognition and appreciation come your way today.",
    "Your generosity inspires others to give more.",
    "Creative projects flourish under your passionate touch.",
    "Leadership comes naturally — step up and inspire.",
    "Joy and laughter fill your day with warmth.",
    "Your confidence is contagious — spread it generously.",
  ],
  Virgo: [
    "Your attention to detail saves the day today.",
    "Health and wellness routines bring excellent results.",
    "Analytical thinking solves a longstanding problem.",
    "Your practical approach earns respect and trust.",
    "A small improvement today creates big results tomorrow.",
    "Organization brings clarity and peace of mind.",
    "Your helpful nature makes a meaningful difference today.",
  ],
  Libra: [
    "Balance and harmony guide your decisions today.",
    "Relationships deepen with honest, kind communication.",
    "Your sense of fairness resolves a difficult situation.",
    "Beauty and art inspire your creative mind today.",
    "Partnerships strengthen through mutual respect.",
    "Diplomacy is your gift — use it to create peace.",
    "A balanced decision today brings lasting satisfaction.",
  ],
  Scorpio: [
    "Your determination unlocks what others cannot reach.",
    "Deep insights give you an edge in all situations.",
    "Transformation is at hand — embrace the change.",
    "Your intensity drives a passion project forward.",
    "Hidden truths come to light, clearing the path ahead.",
    "Your resilience is unmatched — you bounce back stronger.",
    "Trust your deep intuition; it never lies to you.",
  ],
  Sagittarius: [
    "Adventure calls — say yes to new experiences today!",
    "Your optimism is contagious and uplifts everyone around.",
    "Knowledge gained today becomes wisdom tomorrow.",
    "Travel or learning brings exciting new perspectives.",
    "Your honesty — though bold — earns deep respect.",
    "Philosophical thoughts lead to personal breakthroughs.",
    "Freedom and exploration feed your soul today.",
  ],
  Capricorn: [
    "Your discipline and hard work pay off beautifully today.",
    "Career goals come into sharp focus — plan strategically.",
    "Responsibility handled well earns lasting respect.",
    "Patient effort today compounds into future success.",
    "Your ambition drives you to achieve the extraordinary.",
    "Structure and planning give you a competitive edge.",
    "Success is the result of consistent, quiet dedication.",
  ],
  Aquarius: [
    "Your innovative ideas spark a revolution today.",
    "Community and friendship bring unexpected joy.",
    "Thinking differently today solves what others cannot.",
    "Your humanitarian heart inspires real change.",
    "Technology and creativity combine beautifully for you.",
    "Originality is your greatest strength — embrace it fully.",
    "Your vision of the future is clearer than ever today.",
  ],
  Pisces: [
    "Your compassion heals someone who needs it most today.",
    "Creative imagination brings your dreams closer to reality.",
    "Spiritual insights deepen your sense of purpose.",
    "Your empathy makes you an incredible listener and guide.",
    "Trust the universe — everything is aligning for you.",
    "Art, music, or poetry lifts your spirits beautifully today.",
    "Your intuitive gifts are especially powerful right now.",
  ],
};

const ASSAM_FACTS = [
  { label: "Capital", value: "Dispur" },
  { label: "State Animal", value: "Indian One-horned Rhino" },
  { label: "State Bird", value: "White-winged Wood Duck" },
  { label: "State Flower", value: "Foxtail Orchid (Kopou Phool)" },
  { label: "Official Language", value: "Assamese" },
  { label: "Population", value: "~3.5 Crore (2023 est.)" },
  { label: "Famous For", value: "Tea, Silk, Bihu, Wildlife" },
  { label: "UNESCO Heritage", value: "Kaziranga & Manas National Parks" },
  { label: "Major River", value: "Brahmaputra" },
  { label: "Largest City", value: "Guwahati" },
];

const BIHU_INFO = [
  {
    name: "Rongali Bihu (Bohag Bihu)",
    month: "April",
    description:
      "The most celebrated Bihu festival marking the Assamese New Year and the start of the agricultural season. It's a time of joy, dance, music, and new beginnings. Young men and women perform the traditional Bihu dance wearing colourful traditional attire.",
    color: "from-amber-500 to-orange-500",
    emoji: "🌸",
  },
  {
    name: "Kongali Bihu (Kati Bihu)",
    month: "October",
    description:
      "A more sombre and spiritual festival observed when the granaries are empty waiting for the harvest. Oil lamps (saki) are lit in paddy fields and tulsi plants as a prayer for a good harvest. It reflects the Assamese farmer's deep connection with nature.",
    color: "from-orange-600 to-red-600",
    emoji: "🪔",
  },
  {
    name: "Bhogali Bihu (Magh Bihu)",
    month: "January",
    description:
      "The harvest festival celebrated after the paddy is stored in granaries. Communities build large bonfires (meji) and temporary community huts (bhelaghar) filled with food. It's a festival of feasting, community bonding, and gratitude for the harvest.",
    color: "from-yellow-500 to-amber-600",
    emoji: "🔥",
  },
];

const HEADLINES = [
  "India launches new digital infrastructure initiative across rural Assam",
  "Kaziranga rhino population reaches record high of 3,000+",
  "Guwahati selected as Smart City for 2026 development plan",
  "Assam tea exports hit all-time high this quarter",
  "India becomes 3rd largest economy — GDP surpasses Japan",
  "New railway line connecting Nalbari to Guwahati approved",
  "ISRO successfully launches 100th satellite from Sriharikota",
  "Digital India initiative reaches 80 crore internet users",
  "Bihu festival to be nominated for UNESCO heritage listing",
  "Assam government launches free broadband for rural schools",
];

const QUIZ_QUESTIONS = [
  {
    question: "What is the capital of Assam?",
    options: ["Guwahati", "Dispur", "Dibrugarh", "Silchar"],
    answer: 1,
  },
  {
    question: "Which river flows through Assam?",
    options: ["Ganga", "Yamuna", "Brahmaputra", "Godavari"],
    answer: 2,
  },
  {
    question: "How many planets are in our Solar System?",
    options: ["7", "8", "9", "10"],
    answer: 1,
  },
  {
    question: "What is the national animal of India?",
    options: ["Lion", "Elephant", "Tiger", "Leopard"],
    answer: 2,
  },
  {
    question: "Who invented the telephone?",
    options: ["Edison", "Tesla", "Bell", "Marconi"],
    answer: 2,
  },
  {
    question: "What is the largest continent?",
    options: ["Africa", "Asia", "Europe", "Australia"],
    answer: 1,
  },
  {
    question: "Kaziranga is famous for which animal?",
    options: ["Tiger", "Elephant", "One-horned Rhino", "Snow Leopard"],
    answer: 2,
  },
  {
    question: "Which festival is Assam most famous for?",
    options: ["Diwali", "Holi", "Bihu", "Durga Puja"],
    answer: 2,
  },
  {
    question: "What is the currency of Japan?",
    options: ["Yuan", "Won", "Yen", "Ringgit"],
    answer: 2,
  },
  {
    question: "How many states are there in India?",
    options: ["28", "29", "30", "27"],
    answer: 0,
  },
];

const YOUTUBE_VIDEOS = [
  { id: "RgKAFK5djSk", title: "Wiz Khalifa — See You Again" },
  { id: "JGwWNGJdvx8", title: "Ed Sheeran — Shape of You" },
  { id: "ktvTqknDobU", title: "Pharrell Williams — Happy" },
  { id: "YQHsXMglC9A", title: "Adele — Hello" },
  { id: "OPf0YbXqDm0", title: "Mark Ronson ft. Bruno Mars — Uptown Funk" },
  { id: "hT_nvWreIhg", title: "OneRepublic — Counting Stars" },
];

const BIHU_VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "Traditional Bihu Songs" },
  { id: "9bZkp7q19f0", title: "Bihu Dance Performance" },
  { id: "60ItHLz5WEA", title: "Assamese Folk Music" },
];

// ── Snake Game ───────────────────────────────────────────────────────────────

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };

const CELL = 20;
const COLS = 20;
const ROWS = 18;

function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    snake: [{ x: 10, y: 9 }] as Point[],
    dir: "RIGHT" as Direction,
    nextDir: "RIGHT" as Direction,
    food: { x: 15, y: 9 } as Point,
    running: false,
    score: 0,
    gameOver: false,
    intervalId: null as ReturnType<typeof setInterval> | null,
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;

    // Background
    ctx.fillStyle = "#0a1628";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, ROWS * CELL);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(COLS * CELL, y * CELL);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = "#f59e0b";
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(
      s.food.x * CELL + CELL / 2,
      s.food.y * CELL + CELL / 2,
      CELL / 2 - 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    s.snake.forEach((seg, i) => {
      const ratio = i / s.snake.length;
      ctx.fillStyle =
        i === 0 ? "#22d3ee" : `rgba(34, 211, 238, ${0.9 - ratio * 0.5})`;
      ctx.shadowColor = i === 0 ? "#22d3ee" : "transparent";
      ctx.shadowBlur = i === 0 ? 8 : 0;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
  }, []);

  const randomFood = useCallback((snake: Point[]): Point => {
    let food: Point;
    do {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
    return food;
  }, []);

  const tick = useCallback(() => {
    const s = stateRef.current;
    if (!s.running) return;
    s.dir = s.nextDir;
    const head = { ...s.snake[0] };
    if (s.dir === "UP") head.y--;
    if (s.dir === "DOWN") head.y++;
    if (s.dir === "LEFT") head.x--;
    if (s.dir === "RIGHT") head.x++;

    if (
      head.x < 0 ||
      head.x >= COLS ||
      head.y < 0 ||
      head.y >= ROWS ||
      s.snake.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
      s.running = false;
      s.gameOver = true;
      if (s.intervalId) clearInterval(s.intervalId);
      setGameOver(true);
      draw();
      return;
    }

    const ate = head.x === s.food.x && head.y === s.food.y;
    s.snake = [head, ...s.snake.slice(0, ate ? undefined : -1)];
    if (ate) {
      s.score++;
      setScore(s.score);
      s.food = randomFood(s.snake);
    }
    draw();
  }, [draw, randomFood]);

  const startGame = useCallback(() => {
    const s = stateRef.current;
    if (s.intervalId) clearInterval(s.intervalId);
    s.snake = [{ x: 10, y: 9 }];
    s.dir = "RIGHT";
    s.nextDir = "RIGHT";
    s.food = randomFood([{ x: 10, y: 9 }]);
    s.running = true;
    s.score = 0;
    s.gameOver = false;
    setScore(0);
    setGameOver(false);
    setStarted(true);
    s.intervalId = setInterval(tick, 130);
    draw();
  }, [tick, draw, randomFood]);

  const pauseGame = useCallback(() => {
    const s = stateRef.current;
    s.running = !s.running;
  }, []);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (!s.running) return;
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };
      const newDir = map[e.key];
      if (!newDir) return;
      const opposites: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      };
      if (opposites[newDir] !== s.dir) {
        e.preventDefault();
        s.nextDir = newDir;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    return () => {
      if (stateRef.current.intervalId)
        clearInterval(stateRef.current.intervalId);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm">
        <span style={{ color: "oklch(0.78 0.18 65)" }}>
          Score: <strong>{score}</strong>
        </span>
        <span style={{ color: "oklch(0.75 0.04 240)" }}>
          Use Arrow Keys / WASD
        </span>
      </div>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="rounded-xl border"
          style={{
            border: "1px solid oklch(0.78 0.18 65 / 0.4)",
            maxWidth: "100%",
          }}
          tabIndex={0}
        />
        {(!started || gameOver) && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
            style={{ background: "oklch(0.10 0.03 250 / 0.85)" }}
          >
            {gameOver && (
              <p
                className="text-2xl font-bold mb-1"
                style={{ color: "oklch(0.65 0.25 27)" }}
              >
                Game Over!
              </p>
            )}
            {gameOver && (
              <p
                className="text-sm mb-4"
                style={{ color: "oklch(0.75 0.04 240)" }}
              >
                Score: {score}
              </p>
            )}
            {!started && !gameOver && (
              <p
                className="text-xl font-bold mb-4"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                🐍 Snake Game
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={startGame}
          className="px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
          data-ocid="snake.primary_button"
        >
          {gameOver || !started ? "Start" : "Restart"}
        </button>
        {started && !gameOver && (
          <button
            type="button"
            onClick={pauseGame}
            className="px-5 py-2 rounded-lg font-semibold text-sm border transition-all hover:opacity-90"
            style={{
              border: "1px solid oklch(0.78 0.18 65)",
              color: "oklch(0.78 0.18 65)",
            }}
            data-ocid="snake.secondary_button"
          >
            Pause / Resume
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tic Tac Toe ──────────────────────────────────────────────────────────────

type TCell = "X" | "O" | null;

const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function checkWinner(board: TCell[]): TCell | "draw" | null {
  for (const [a, b, c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  if (board.every(Boolean)) return "draw";
  return null;
}

function bestMove(board: TCell[]): number {
  const empty = board
    .map((v, i) => (v === null ? i : -1))
    .filter((i) => i !== -1);
  // Try to win
  for (const i of empty) {
    const b = [...board];
    b[i] = "O";
    if (checkWinner(b) === "O") return i;
  }
  // Block player
  for (const i of empty) {
    const b = [...board];
    b[i] = "X";
    if (checkWinner(b) === "X") return i;
  }
  // Prefer center
  if (board[4] === null) return 4;
  // Corners
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length)
    return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

const CELL_KEYS = [
  "tl",
  "tc",
  "tr",
  "ml",
  "mc",
  "mr",
  "bl",
  "bc",
  "br",
] as const;

function TicTacToe() {
  const [board, setBoard] = useState<TCell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [vsComputer, setVsComputer] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const winner = checkWinner(board);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    if (!xIsNext && vsComputer) return;
    const next = [...board];
    next[i] = xIsNext ? "X" : "O";
    const w = checkWinner(next);
    setBoard(next);
    setXIsNext(!xIsNext);
    if (w) {
      setScores((prev) => ({
        ...prev,
        [w === "draw" ? "draw" : w]:
          prev[w === "draw" ? "draw" : (w as "X" | "O")] + 1,
      }));
    }
  };

  useEffect(() => {
    if (vsComputer && !xIsNext && !winner) {
      const t = setTimeout(() => {
        const move = bestMove(board);
        if (move === undefined || move === -1) return;
        const next = [...board];
        next[move] = "O";
        const w = checkWinner(next);
        setBoard(next);
        setXIsNext(true);
        if (w) {
          setScores((prev) => ({
            ...prev,
            [w === "draw" ? "draw" : w]:
              prev[w === "draw" ? "draw" : (w as "X" | "O")] + 1,
          }));
        }
      }, 400);
      return () => clearTimeout(t);
    }
  }, [board, xIsNext, vsComputer, winner]);

  const reset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const status = winner
    ? winner === "draw"
      ? "It's a Draw! 🤝"
      : `${winner} Wins! 🎉`
    : `${xIsNext ? "X" : "O"}'s Turn`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 text-sm">
        {(["X", "O", "draw"] as const).map((k) => (
          <div key={k} className="text-center">
            <div className="text-xs" style={{ color: "oklch(0.60 0.04 240)" }}>
              {k === "draw" ? "Draws" : k}
            </div>
            <div
              className="font-bold text-lg"
              style={{
                color:
                  k === "X"
                    ? "oklch(0.65 0.25 240)"
                    : k === "O"
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.75 0.04 240)",
              }}
            >
              {scores[k]}
            </div>
          </div>
        ))}
      </div>

      <p
        className="text-sm font-semibold"
        style={{
          color: winner ? "oklch(0.78 0.18 65)" : "oklch(0.75 0.04 240)",
        }}
      >
        {status}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <button
            type="button"
            key={CELL_KEYS[i]}
            onClick={() => handleClick(i)}
            className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl font-bold transition-all duration-150 hover:opacity-80"
            style={{
              background: cell
                ? "oklch(0.20 0.06 250)"
                : "oklch(0.16 0.04 250)",
              border: `2px solid ${cell === "X" ? "oklch(0.65 0.25 240 / 0.6)" : cell === "O" ? "oklch(0.78 0.18 65 / 0.6)" : "oklch(0.25 0.05 250)"}`,
              color:
                cell === "X" ? "oklch(0.65 0.25 240)" : "oklch(0.78 0.18 65)",
            }}
            data-ocid={`ttt.item.${i + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
          data-ocid="ttt.primary_button"
        >
          New Game
        </button>
        <button
          type="button"
          onClick={() => {
            setVsComputer(!vsComputer);
            reset();
          }}
          className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:opacity-90"
          style={{
            border: "1px solid oklch(0.78 0.18 65)",
            color: "oklch(0.78 0.18 65)",
          }}
          data-ocid="ttt.toggle"
        >
          {vsComputer ? "vs Computer" : "2 Player"}
        </button>
      </div>
    </div>
  );
}

// ── Quiz Game ────────────────────────────────────────────────────────────────

function QuizGame() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (finished || selected !== null) return;
    if (timeLeft <= 0) {
      handleNext();
      return;
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, finished, selected]);

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === QUIZ_QUESTIONS[current].answer) setScore((p) => p + 1);
  };

  const handleNext = () => {
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrent((p) => p + 1);
      setSelected(null);
      setTimeLeft(15);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setTimeLeft(15);
  };

  const q = QUIZ_QUESTIONS[current];
  const pct = (timeLeft / 15) * 100;

  if (finished) {
    const pctScore = (score / QUIZ_QUESTIONS.length) * 100;
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="text-5xl">
          {pctScore >= 70 ? "🎉" : pctScore >= 40 ? "👏" : "😅"}
        </div>
        <h3
          className="text-xl font-bold"
          style={{ color: "oklch(0.78 0.18 65)" }}
        >
          Quiz Complete!
        </h3>
        <p style={{ color: "oklch(0.75 0.04 240)" }}>
          Your Score:{" "}
          <strong style={{ color: "oklch(0.90 0.05 240)" }}>
            {score} / {QUIZ_QUESTIONS.length}
          </strong>
        </p>
        <p
          className="text-sm"
          style={{
            color:
              pctScore >= 70 ? "oklch(0.75 0.20 145)" : "oklch(0.65 0.20 27)",
          }}
        >
          {pctScore >= 70
            ? "Excellent! 🌟"
            : pctScore >= 40
              ? "Good effort! Keep learning."
              : "Better luck next time!"}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-2 px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
          data-ocid="quiz.primary_button"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: "oklch(0.78 0.18 65)" }}>
          Q {current + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <span
          style={{
            color:
              timeLeft <= 5 ? "oklch(0.65 0.25 27)" : "oklch(0.75 0.04 240)",
          }}
        >
          ⏱ {timeLeft}s
        </span>
        <span style={{ color: "oklch(0.78 0.18 65)" }}>Score: {score}</span>
      </div>

      {/* Timer bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "oklch(0.20 0.04 250)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background:
              timeLeft <= 5 ? "oklch(0.65 0.25 27)" : "oklch(0.78 0.18 65)",
          }}
        />
      </div>

      <p
        className="text-base font-semibold text-center"
        style={{ color: "oklch(0.90 0.05 240)" }}
      >
        {q.question}
      </p>

      <div className="grid grid-cols-1 gap-2">
        {q.options.map((opt, i) => {
          let bg = "oklch(0.16 0.04 250)";
          let border = "oklch(0.25 0.05 250)";
          if (selected !== null) {
            if (i === q.answer) {
              bg = "oklch(0.25 0.12 145)";
              border = "oklch(0.55 0.20 145)";
            } else if (i === selected) {
              bg = "oklch(0.22 0.12 27)";
              border = "oklch(0.55 0.20 27)";
            }
          }
          return (
            <button
              type="button"
              key={opt}
              onClick={() => handleSelect(i)}
              className="px-4 py-3 rounded-xl text-sm text-left font-medium transition-all duration-200 hover:opacity-90"
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                color: "oklch(0.88 0.04 240)",
              }}
              data-ocid={`quiz.item.${i + 1}`}
            >
              <span style={{ color: "oklch(0.78 0.18 65)" }}>
                {String.fromCharCode(65 + i)}.
              </span>{" "}
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          type="button"
          onClick={handleNext}
          className="mx-auto px-6 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
          style={{
            background: "oklch(0.78 0.18 65)",
            color: "oklch(0.12 0.03 250)",
          }}
          data-ocid="quiz.primary_button"
        >
          {current + 1 >= QUIZ_QUESTIONS.length
            ? "See Results"
            : "Next Question →"}
        </button>
      )}
    </div>
  );
}

// ── Music Library ────────────────────────────────────────────────────────────

type MusicCategory =
  | "Bihu"
  | "Folk"
  | "Movie"
  | "Devotional"
  | "Modern"
  | "Zubeen Garg";

interface MusicSong {
  id: string;
  title: string;
  singerName: string;
  movieName?: string;
  category: MusicCategory;
  genre?: string;
  releaseDate?: string;
  platformLink?: string;
  youtubeVideoId?: string;
  lyrics?: string;
  composer?: string;
  lyricist?: string;
  musicDirector?: string;
  label?: string;
  audioFileUrl?: string;
  downloadLink?: string;
  coverImage?: string;
}

const DEFAULT_MUSIC_SONGS: MusicSong[] = [
  // ── BIHU ─────────────────────────────────────────────────────────────────
  {
    id: "b1",
    title: "O Mur Apunar Desh",
    singerName: "Dr. Bhupen Hazarika",
    category: "Bihu",
    genre: "Classical Bihu",
    releaseDate: "1965",
    youtubeVideoId: "P_0pS_JkC2E",
    platformLink: "https://www.youtube.com/watch?v=P_0pS_JkC2E",
    composer: "Dr. Bhupen Hazarika",
    lyricist: "Dr. Bhupen Hazarika",
    label: "Saregama",
    lyrics:
      "O mur apunar desh...\nJokhon aahile bohag...\nRongali biyeli haahi...",
  },
  {
    id: "b2",
    title: "Bihu Bihu",
    singerName: "Zubeen Garg",
    category: "Bihu",
    genre: "Modern Bihu",
    releaseDate: "2005",
    youtubeVideoId: "4SKgQHPElyM",
    platformLink: "https://www.youtube.com/watch?v=4SKgQHPElyM",
    composer: "Zubeen Garg",
    lyricist: "Atul Kumar Bhuyan",
    label: "Assam Music",
    lyrics: "Bihu bihu bihu eti ananda...\nBohag mahor din...",
  },
  {
    id: "b3",
    title: "Tumi Aahibane",
    singerName: "Zubeen Garg",
    category: "Bihu",
    genre: "Modern Bihu",
    releaseDate: "2007",
    youtubeVideoId: "Qn9e6D0U_a4",
    platformLink: "https://www.youtube.com/watch?v=Qn9e6D0U_a4",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
  {
    id: "b4",
    title: "Phul Koure Tuli",
    singerName: "Zubeen Garg",
    category: "Bihu",
    genre: "Bihu Geet",
    releaseDate: "2010",
    youtubeVideoId: "rZfxAFKy8A0",
    platformLink: "https://www.youtube.com/watch?v=rZfxAFKy8A0",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
  {
    id: "b5",
    title: "Rongali Bihu",
    singerName: "Angaraag Papon Mahanta",
    category: "Bihu",
    genre: "Folk Bihu",
    releaseDate: "2012",
    youtubeVideoId: "yRgL0DiG3fE",
    platformLink: "https://www.youtube.com/watch?v=yRgL0DiG3fE",
    composer: "Angaraag Papon Mahanta",
    label: "Saregama",
  },
  {
    id: "b6",
    title: "Nahar Phool",
    singerName: "Tarali Sarma",
    category: "Bihu",
    genre: "Bihu Geet",
    releaseDate: "2008",
    youtubeVideoId: "hW1xK8rB9tV",
    platformLink: "https://www.youtube.com/watch?v=hW1xK8rB9tV",
    label: "Assam Music",
  },
  // ── FOLK ──────────────────────────────────────────────────────────────────
  {
    id: "f1",
    title: "Mur Ghar Suwali",
    singerName: "Khagen Mahanta",
    category: "Folk",
    genre: "Lokgeet",
    releaseDate: "1985",
    youtubeVideoId: "oPvxPFhJ_EA",
    platformLink: "https://www.youtube.com/watch?v=oPvxPFhJ_EA",
    composer: "Khagen Mahanta",
    label: "Saregama",
  },
  {
    id: "f2",
    title: "Husori Geet",
    singerName: "Traditional",
    category: "Folk",
    genre: "Husori",
    releaseDate: "Traditional",
    youtubeVideoId: "9bZkp7q19f0",
    platformLink: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    label: "Folk Heritage",
  },
  {
    id: "f3",
    title: "Bor Khel Khela",
    singerName: "Pratima Pandey Barua",
    category: "Folk",
    genre: "Lokgeet",
    releaseDate: "1990",
    youtubeVideoId: "60ItHLz5WEA",
    platformLink: "https://www.youtube.com/watch?v=60ItHLz5WEA",
    label: "Folk Heritage",
  },
  {
    id: "f4",
    title: "Xindur Khela",
    singerName: "Pratima Pandey Barua",
    category: "Folk",
    genre: "Lokgeet",
    releaseDate: "1992",
    youtubeVideoId: "dQw4w9WgXcQ",
    platformLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    label: "Folk Heritage",
  },
  // ── MOVIE ─────────────────────────────────────────────────────────────────
  {
    id: "mv1",
    title: "Mayabini",
    singerName: "Zubeen Garg",
    movieName: "Yaone",
    category: "Movie",
    genre: "Romantic",
    releaseDate: "2014",
    youtubeVideoId: "ktvTqknDobU",
    platformLink: "https://www.youtube.com/watch?v=ktvTqknDobU",
    composer: "Zubeen Garg",
    lyricist: "Nilim Kumar",
    musicDirector: "Zubeen Garg",
    label: "Assam Talkies",
    lyrics:
      "Mayabini mayabini...\nTumi amar sapunar desh...\nMayabini mayabini...",
  },
  {
    id: "mv2",
    title: "Rongmon",
    singerName: "Zubeen Garg",
    movieName: "Rongmon",
    category: "Movie",
    genre: "Romantic",
    releaseDate: "2012",
    youtubeVideoId: "ktvTqknDobU",
    platformLink: "https://www.youtube.com/watch?v=ktvTqknDobU",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
  {
    id: "mv3",
    title: "Kopou Phool",
    singerName: "Zubeen Garg",
    movieName: "Kopou Phool",
    category: "Movie",
    genre: "Romantic",
    releaseDate: "2011",
    youtubeVideoId: "OPf0YbXqDm0",
    platformLink: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    label: "Assam Music",
  },
  {
    id: "mv4",
    title: "Priya Priya",
    singerName: "Angaraag Papon Mahanta",
    movieName: "Priya Priya",
    category: "Movie",
    genre: "Romantic",
    releaseDate: "2013",
    youtubeVideoId: "JGwWNGJdvx8",
    platformLink: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    label: "Assam Talkies",
  },
  {
    id: "mv5",
    title: "Ratir Xapun",
    singerName: "Neel Akash",
    movieName: "Ratir Xapun",
    category: "Movie",
    genre: "Sad",
    releaseDate: "2016",
    youtubeVideoId: "YQHsXMglC9A",
    platformLink: "https://www.youtube.com/watch?v=YQHsXMglC9A",
    label: "Assam Music",
  },
  {
    id: "mv6",
    title: "Mur Buku Hiya",
    singerName: "Zubeen Garg",
    movieName: "Hiya Diya Niya",
    category: "Movie",
    genre: "Emotional",
    releaseDate: "2006",
    youtubeVideoId: "RgKAFK5djSk",
    platformLink: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
  // ── DEVOTIONAL ────────────────────────────────────────────────────────────
  {
    id: "d1",
    title: "Naam Kirtan",
    singerName: "Traditional",
    category: "Devotional",
    genre: "Naam Kirtan",
    releaseDate: "Traditional",
    youtubeVideoId: "sEnFCsOFtXw",
    platformLink: "https://www.youtube.com/watch?v=sEnFCsOFtXw",
    label: "Folk Heritage",
  },
  {
    id: "d2",
    title: "Borgeet — Srimanta Sankardev",
    singerName: "Traditional",
    category: "Devotional",
    genre: "Borgeet",
    releaseDate: "Traditional",
    youtubeVideoId: "3JZ_D3ELwOQ",
    platformLink: "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    composer: "Srimanta Sankardev",
    label: "Folk Heritage",
  },
  {
    id: "d3",
    title: "Kirtana Ghosha",
    singerName: "Traditional",
    category: "Devotional",
    genre: "Kirtan",
    releaseDate: "Traditional",
    youtubeVideoId: "pRpeEdMmmQ0",
    platformLink: "https://www.youtube.com/watch?v=pRpeEdMmmQ0",
    label: "Folk Heritage",
  },
  {
    id: "d4",
    title: "Bishnu Naam",
    singerName: "Khagen Mahanta",
    category: "Devotional",
    genre: "Bhakti",
    releaseDate: "2000",
    youtubeVideoId: "xo1VInw-SKc",
    platformLink: "https://www.youtube.com/watch?v=xo1VInw-SKc",
    composer: "Khagen Mahanta",
    label: "Saregama",
  },
  // ── MODERN ────────────────────────────────────────────────────────────────
  {
    id: "mod1",
    title: "Mor Minar",
    singerName: "Neel Akash",
    category: "Modern",
    genre: "Pop",
    releaseDate: "2018",
    youtubeVideoId: "8UVNT4wvIGY",
    platformLink: "https://www.youtube.com/watch?v=8UVNT4wvIGY",
    composer: "Neel Akash",
    label: "Assam Music",
  },
  {
    id: "mod2",
    title: "Eri Aai",
    singerName: "Neel Akash",
    category: "Modern",
    genre: "Sad Pop",
    releaseDate: "2019",
    youtubeVideoId: "d-diB65scQU",
    platformLink: "https://www.youtube.com/watch?v=d-diB65scQU",
    label: "Assam Music",
  },
  {
    id: "mod3",
    title: "Tumi Ahibone",
    singerName: "Simanta Shekhar",
    category: "Modern",
    genre: "Pop",
    releaseDate: "2017",
    youtubeVideoId: "09R8_2nJtjg",
    platformLink: "https://www.youtube.com/watch?v=09R8_2nJtjg",
    composer: "Simanta Shekhar",
    label: "Assam Music",
  },
  {
    id: "mod4",
    title: "Jiyon Geet",
    singerName: "Simanta Shekhar",
    category: "Modern",
    genre: "Inspirational",
    releaseDate: "2015",
    youtubeVideoId: "lp-EO5I60KA",
    platformLink: "https://www.youtube.com/watch?v=lp-EO5I60KA",
    label: "Assam Music",
  },
  // ── ZUBEEN GARG SPECIAL ───────────────────────────────────────────────────
  {
    id: "zg1",
    title: "Xewali Phool",
    singerName: "Zubeen Garg",
    category: "Zubeen Garg",
    genre: "Romantic",
    releaseDate: "2004",
    youtubeVideoId: "L_jWHffIx5E",
    platformLink: "https://www.youtube.com/watch?v=L_jWHffIx5E",
    composer: "Zubeen Garg",
    lyricist: "Nilim Kumar",
    label: "Assam Music",
    lyrics: "Xewali phool tumi...\nMor aakaxor tara...",
  },
  {
    id: "zg2",
    title: "Maa",
    singerName: "Zubeen Garg",
    category: "Zubeen Garg",
    genre: "Emotional",
    releaseDate: "2008",
    youtubeVideoId: "K4gb-AlU-m4",
    platformLink: "https://www.youtube.com/watch?v=K4gb-AlU-m4",
    composer: "Zubeen Garg",
    label: "Assam Music",
    lyrics: "Maa tumi aamaar...\nTumi aamaar jibon...",
  },
  {
    id: "zg3",
    title: "Deuta",
    singerName: "Zubeen Garg",
    category: "Zubeen Garg",
    genre: "Emotional",
    releaseDate: "2008",
    youtubeVideoId: "Vt_bMGFoAb8",
    platformLink: "https://www.youtube.com/watch?v=Vt_bMGFoAb8",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
  {
    id: "zg4",
    title: "Amar Sonar Axom",
    singerName: "Zubeen Garg",
    category: "Zubeen Garg",
    genre: "Patriotic",
    releaseDate: "2006",
    youtubeVideoId: "H7jtC8vjXw8",
    platformLink: "https://www.youtube.com/watch?v=H7jtC8vjXw8",
    composer: "Zubeen Garg",
    label: "Assam Music",
    lyrics: "Amar sonar Axom...\nLuit par desh aamaar...",
  },
  {
    id: "zg5",
    title: "Luitor Sadhu",
    singerName: "Zubeen Garg",
    category: "Zubeen Garg",
    genre: "Inspirational",
    releaseDate: "2009",
    youtubeVideoId: "YqeW9_5kURI",
    platformLink: "https://www.youtube.com/watch?v=YqeW9_5kURI",
    composer: "Zubeen Garg",
    label: "Assam Music",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Bihu: "oklch(0.72 0.20 145)",
  Folk: "oklch(0.72 0.18 55)",
  Movie: "oklch(0.65 0.22 280)",
  Devotional: "oklch(0.70 0.18 30)",
  Modern: "oklch(0.65 0.20 200)",
  "Zubeen Garg": "oklch(0.78 0.18 65)",
};

type BrowseTab = "category" | "singer" | "movie";

function SongCard({
  song,
  idx,
}: {
  song: MusicSong;
  idx: number;
}) {
  const catColor = CATEGORY_COLORS[song.category] ?? "oklch(0.78 0.18 65)";

  // Cover image: admin URL > YouTube thumbnail > fallback
  const coverImageSrc = song.coverImage
    ? song.coverImage
    : song.youtubeVideoId
      ? `https://img.youtube.com/vi/${song.youtubeVideoId}/hqdefault.jpg`
      : null;

  const openSongPage = () => {
    const base = `${window.location.origin}${window.location.pathname}`;
    const cat = encodeURIComponent(song.category);
    window.open(`${base}?cat=${cat}`, "_blank");
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
      style={{
        background: "oklch(0.14 0.04 250)",
        border: "1px solid oklch(0.22 0.05 250)",
        boxShadow: "0 2px 8px oklch(0.08 0.04 250 / 0.6)",
      }}
      data-ocid={`entertainment.music.item.${idx + 1}`}
    >
      {/* Cover Image */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "180px" }}
      >
        {coverImageSrc ? (
          <img
            src={coverImageSrc}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const parent = (e.target as HTMLImageElement).parentElement;
              if (parent) {
                parent.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:${catColor}10;font-size:3rem;">🎵</div>`;
              }
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: `${catColor}10` }}
          >
            🎵
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, oklch(0.14 0.04 250) 0%, oklch(0.14 0.04 250 / 0.3) 60%, transparent 100%)",
          }}
        />
        {/* Category badge on image */}
        <div className="absolute top-2 left-2">
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: `${catColor}cc`,
              color: "oklch(0.10 0.03 250)",
            }}
          >
            {song.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <p
          className="font-bold text-sm truncate"
          style={{ color: "oklch(0.78 0.18 65)" }}
        >
          {song.title}
        </p>
        <p
          className="text-xs mt-0.5 truncate"
          style={{ color: "oklch(0.65 0.05 240)" }}
        >
          {song.singerName}
        </p>
        {song.movieName && (
          <p
            className="text-xs italic mt-0.5 truncate"
            style={{ color: "oklch(0.52 0.06 280)" }}
          >
            🎬 {song.movieName}
          </p>
        )}
        {song.releaseDate && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "oklch(0.45 0.04 240)" }}
          >
            {song.releaseDate}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            type="button"
            onClick={openSongPage}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "oklch(0.78 0.18 65)",
              color: "oklch(0.10 0.03 250)",
              minWidth: "70px",
            }}
            data-ocid="entertainment.music.button"
          >
            ▶ Play
          </button>
          <button
            type="button"
            onClick={openSongPage}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95"
            style={{
              background: "transparent",
              color: "oklch(0.78 0.18 65)",
              border: "1.5px solid oklch(0.78 0.18 65)",
              minWidth: "80px",
            }}
            data-ocid="entertainment.music.button"
          >
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}

function MusicLibrary() {
  const savedData = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("entertainment_admin_data") || "{}",
      );
    } catch {
      return {};
    }
  })();
  const songs: MusicSong[] =
    (savedData.musicSongs as MusicSong[] | undefined) ?? DEFAULT_MUSIC_SONGS;

  const [browseTab, setBrowseTab] = useState<BrowseTab>("category");
  const [search, setSearch] = useState("");

  // All unique categories
  const ALL_CATEGORIES: MusicCategory[] = [
    "Bihu",
    "Folk",
    "Movie",
    "Devotional",
    "Modern",
    "Zubeen Garg",
  ];
  const CATEGORY_EMOJIS: Record<MusicCategory, string> = {
    Bihu: "🌸",
    Folk: "🪘",
    Movie: "🎬",
    Devotional: "🙏",
    Modern: "🎸",
    "Zubeen Garg": "⭐",
  };

  // All unique artists A-Z
  const allArtists = [...new Set(songs.map((s) => s.singerName))].sort((a, b) =>
    a.localeCompare(b),
  );
  // All unique movies
  const allMovies = [
    ...new Set(songs.filter((s) => s.movieName).map((s) => s.movieName!)),
  ].sort((a, b) => a.localeCompare(b));

  const base = `${window.location.origin}${window.location.pathname}`;

  const openCategory = (cat: MusicCategory) => {
    window.open(`${base}?cat=${encodeURIComponent(cat)}`, "_blank");
  };
  const openSinger = (singer: string) => {
    window.open(`${base}?singer=${encodeURIComponent(singer)}`, "_blank");
  };
  const openMovie = (movie: string) => {
    window.open(`${base}?movie=${encodeURIComponent(movie)}`, "_blank");
  };

  const tabBtn = (tab: BrowseTab, label: string) => (
    <button
      key={tab}
      type="button"
      onClick={() => {
        setBrowseTab(tab);
        setSearch("");
      }}
      className="px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
      style={{
        background:
          browseTab === tab ? "oklch(0.78 0.18 65)" : "oklch(0.16 0.05 250)",
        color:
          browseTab === tab ? "oklch(0.10 0.03 250)" : "oklch(0.75 0.04 240)",
        border: `1.5px solid ${browseTab === tab ? "oklch(0.78 0.18 65)" : "oklch(0.28 0.06 250)"}`,
      }}
      data-ocid={`entertainment.music.${tab}.tab`}
    >
      {label}
    </button>
  );

  // Preview songs for the selected browse tab (first 6)
  const previewSongs =
    browseTab === "category"
      ? songs.slice(0, 6)
      : browseTab === "singer"
        ? songs.slice(0, 6)
        : songs.filter((s) => !!s.movieName).slice(0, 6);

  const filteredArtists = allArtists.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredMovies = allMovies.filter((m) =>
    m.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      {/* Browse tab switcher */}
      <div className="flex gap-2 flex-wrap">
        {tabBtn("category", "By Category")}
        {tabBtn("singer", "By Singer")}
        {tabBtn("movie", "By Movie")}
      </div>

      {/* Search bar (for singer/movie tabs) */}
      {browseTab !== "category" && (
        <input
          type="text"
          placeholder={
            browseTab === "singer" ? "Search singer..." : "Search movie..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: "oklch(0.14 0.04 250)",
            border: "1px solid oklch(0.25 0.06 250)",
            color: "oklch(0.90 0.02 240)",
          }}
          data-ocid="entertainment.music.search_input"
        />
      )}

      {/* ── CATEGORY TAB ── */}
      {browseTab === "category" && (
        <div className="space-y-5">
          {/* Category cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const catSongs = songs.filter((s) => s.category === cat);
              const catColor = CATEGORY_COLORS[cat] ?? "oklch(0.78 0.18 65)";
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => openCategory(cat)}
                  className="relative rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    background: `${catColor}12`,
                    border: `1.5px solid ${catColor}40`,
                  }}
                  data-ocid="entertainment.music.tab"
                >
                  <div className="text-2xl mb-1">{CATEGORY_EMOJIS[cat]}</div>
                  <p className="text-sm font-bold" style={{ color: catColor }}>
                    {cat}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.04 240)" }}
                  >
                    {catSongs.length} songs
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.50 0.06 65)" }}
                  >
                    Click to open ↗
                  </p>
                </button>
              );
            })}
          </div>

          {/* Preview songs */}
          <div>
            <p
              className="text-xs font-semibold mb-3"
              style={{ color: "oklch(0.60 0.05 240)" }}
            >
              Recent Songs — Click a category card to see all songs in a new tab
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewSongs.map((song, idx) => (
                <SongCard key={song.id} song={song} idx={idx} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SINGER TAB ── */}
      {browseTab === "singer" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredArtists.length === 0 ? (
              <div
                className="col-span-2 text-center py-10 rounded-2xl"
                style={{
                  background: "oklch(0.14 0.04 250)",
                  color: "oklch(0.55 0.04 240)",
                }}
                data-ocid="entertainment.music.empty_state"
              >
                No singers found.
              </div>
            ) : (
              filteredArtists.map((artist) => {
                const artistSongCount = songs.filter(
                  (s) => s.singerName === artist,
                ).length;
                const initial = artist[0]?.toUpperCase() ?? "?";
                return (
                  <button
                    key={artist}
                    type="button"
                    onClick={() => openSinger(artist)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "oklch(0.14 0.04 250)",
                      border: "1px solid oklch(0.22 0.05 250)",
                    }}
                    data-ocid="entertainment.music.button"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{
                        background: "oklch(0.78 0.18 65 / 0.15)",
                        border: "1px solid oklch(0.78 0.18 65 / 0.4)",
                        color: "oklch(0.78 0.18 65)",
                      }}
                    >
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "oklch(0.90 0.03 240)" }}
                      >
                        {artist}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.04 240)" }}
                      >
                        {artistSongCount} song{artistSongCount !== 1 ? "s" : ""}{" "}
                        · Opens in new tab ↗
                      </p>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.50 0.04 240)" }}
                    >
                      ›
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ── MOVIE TAB ── */}
      {browseTab === "movie" && (
        <div className="space-y-4">
          {filteredMovies.length === 0 ? (
            <div
              className="text-center py-10 rounded-2xl"
              style={{
                background: "oklch(0.14 0.04 250)",
                color: "oklch(0.55 0.04 240)",
              }}
              data-ocid="entertainment.music.empty_state"
            >
              No movie songs available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredMovies.map((movie) => {
                const movSongs = songs.filter((s) => s.movieName === movie);
                return (
                  <button
                    key={movie}
                    type="button"
                    onClick={() => openMovie(movie)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: "oklch(0.14 0.04 250)",
                      border: "1px solid oklch(0.65 0.22 280 / 0.25)",
                    }}
                    data-ocid="entertainment.music.button"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                      style={{
                        background: "oklch(0.65 0.22 280 / 0.15)",
                        border: "1px solid oklch(0.65 0.22 280 / 0.35)",
                      }}
                    >
                      🎬
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: "oklch(0.90 0.03 240)" }}
                      >
                        {movie}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.55 0.04 240)" }}
                      >
                        {movSongs.length} song{movSongs.length !== 1 ? "s" : ""}{" "}
                        · Opens in new tab ↗
                      </p>
                    </div>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.50 0.04 240)" }}
                    >
                      ›
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  emoji,
  children,
}: { title: string; emoji: string; children: React.ReactNode }) {
  const { ref, inView } = useInView(0.1);
  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{emoji}</span>
        <h2
          className="text-xl md:text-2xl font-bold tracking-wide"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.78 0.18 65), oklch(0.90 0.12 80))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.78 0.18 65 / 0.25)" }}
        />
      </div>
      {children}
    </section>
  );
}

// ── Main EntertainmentPage ────────────────────────────────────────────────────

export function EntertainmentPage({ navigate }: Props) {
  // Load admin-customized content from localStorage (with fallbacks to hardcoded defaults)
  const _savedEntData = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("entertainment_admin_data") || "{}",
      );
    } catch {
      return {};
    }
  })();
  const ACTIVE_HEADLINES =
    (_savedEntData.newsHeadlines as string[] | undefined) ?? HEADLINES;
  const ACTIVE_YOUTUBE =
    (_savedEntData.youtubeVideos as
      | { id: string; title: string }[]
      | undefined) ?? YOUTUBE_VIDEOS;
  const ACTIVE_BIHU =
    (_savedEntData.bihuVideos as { id: string; title: string }[] | undefined) ??
    BIHU_VIDEOS;
  const ACTIVE_FACTS =
    (_savedEntData.funFacts as string[] | undefined) ?? FUN_FACTS;
  const ACTIVE_JOKES =
    (_savedEntData.jokes as
      | { setup: string; punchline: string }[]
      | undefined) ?? JOKES;

  // Facts & Jokes state
  const day = new Date().getDate();
  const weekday = new Date().getDay();
  const [factIdx, setFactIdx] = useState((day * 3) % ACTIVE_FACTS.length);
  const [jokeIdx, setJokeIdx] = useState((day * 2) % ACTIVE_JOKES.length);
  const [jokeRevealed, setJokeRevealed] = useState(false);

  // Horoscope state
  const [selectedSign, setSelectedSign] = useState<string | null>(null);

  // Active game tab
  const [gameTab, setGameTab] = useState<"snake" | "tictactoe" | "quiz">(
    "snake",
  );

  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.03 250)" }}
    >
      {/* Hero Banner */}
      <div
        ref={heroRef}
        className="relative overflow-hidden py-14 px-6 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.05 250) 0%, oklch(0.16 0.06 270) 50%, oklch(0.12 0.04 250) 100%)",
          borderBottom: "1px solid oklch(0.78 0.18 65 / 0.25)",
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.78 0.18 65 / 0.08)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{ background: "oklch(0.65 0.25 290 / 0.08)" }}
        />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-4xl mb-3">🎮 🎬 🎵 🎯</div>
          <h1
            className="text-3xl md:text-5xl font-bold mb-3 tracking-tight"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.78 0.18 65), oklch(0.90 0.12 85), oklch(0.78 0.18 65))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Entertainment Hub
          </h1>
          <p
            className="text-base md:text-lg mb-6"
            style={{ color: "oklch(0.70 0.06 240)" }}
          >
            Games · Music Library · Horoscope · Fun Facts · Bihu & Assam Culture
          </p>
          <button
            type="button"
            onClick={() => navigate("home")}
            className="text-sm px-4 py-2 rounded-full border transition-all hover:opacity-80"
            style={{
              border: "1px solid oklch(0.78 0.18 65 / 0.5)",
              color: "oklch(0.78 0.18 65)",
            }}
            data-ocid="entertainment.link"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 space-y-16">
        {/* ── Section 1: Mini Games ── */}
        <Section title="Mini Games" emoji="🎮">
          {/* Tab switcher */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {(["snake", "tictactoe", "quiz"] as const).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setGameTab(tab)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                style={{
                  background:
                    gameTab === tab
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.18 0.05 250)",
                  color:
                    gameTab === tab
                      ? "oklch(0.12 0.03 250)"
                      : "oklch(0.75 0.04 240)",
                  border: `1.5px solid ${gameTab === tab ? "oklch(0.78 0.18 65)" : "oklch(0.30 0.05 250)"}`,
                }}
                data-ocid={`entertainment.${tab}.tab`}
              >
                {tab === "snake"
                  ? "🐍 Snake"
                  : tab === "tictactoe"
                    ? "❌ Tic Tac Toe"
                    : "🧠 Quiz"}
              </button>
            ))}
          </div>

          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "oklch(0.14 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            {gameTab === "snake" && <SnakeGame />}
            {gameTab === "tictactoe" && <TicTacToe />}
            {gameTab === "quiz" && <QuizGame />}
          </div>
        </Section>

        {/* ── Section 2: YouTube Videos ── */}
        <Section title="Popular Music Videos" emoji="🎵">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACTIVE_YOUTUBE.map((v) => (
              <div
                key={v.id}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid oklch(0.25 0.06 250)" }}
              >
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div
                  className="px-3 py-2 text-xs font-medium truncate"
                  style={{
                    background: "oklch(0.14 0.04 250)",
                    color: "oklch(0.75 0.04 240)",
                  }}
                >
                  {v.title}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 2.5: Music Library ── */}
        <Section title="Music Library" emoji="🎵">
          <MusicLibrary />
        </Section>

        {/* ── Section 3: Fun Facts & Jokes ── */}
        <Section title="Fun Facts & Jokes" emoji="💡">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fun Facts */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.14 0.04 250)",
                border: "1px solid oklch(0.78 0.18 65 / 0.2)",
              }}
            >
              <h3
                className="font-bold mb-3 flex items-center gap-2"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                <span>💡</span> Did You Know?
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "oklch(0.80 0.04 240)" }}
              >
                {ACTIVE_FACTS[factIdx % ACTIVE_FACTS.length]}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  Fact {(factIdx % ACTIVE_FACTS.length) + 1} /{" "}
                  {ACTIVE_FACTS.length}
                </span>
                <button
                  type="button"
                  onClick={() => setFactIdx((p) => p + 1)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                  style={{
                    background: "oklch(0.78 0.18 65 / 0.15)",
                    color: "oklch(0.78 0.18 65)",
                    border: "1px solid oklch(0.78 0.18 65 / 0.3)",
                  }}
                  data-ocid="facts.button"
                >
                  Next Fact →
                </button>
              </div>
            </div>

            {/* Jokes */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "oklch(0.14 0.04 250)",
                border: "1px solid oklch(0.65 0.20 290 / 0.3)",
              }}
            >
              <h3
                className="font-bold mb-3 flex items-center gap-2"
                style={{ color: "oklch(0.72 0.20 290)" }}
              >
                <span>😄</span> Daily Joke
              </h3>
              <p
                className="text-sm mb-2"
                style={{ color: "oklch(0.80 0.04 240)" }}
              >
                {ACTIVE_JOKES[jokeIdx % ACTIVE_JOKES.length].setup}
              </p>
              {jokeRevealed ? (
                <p
                  className="text-sm font-semibold mb-4"
                  style={{ color: "oklch(0.78 0.18 65)" }}
                >
                  👉 {ACTIVE_JOKES[jokeIdx % ACTIVE_JOKES.length].punchline}
                </p>
              ) : (
                <button
                  type="button"
                  onClick={() => setJokeRevealed(true)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium mb-4 transition-all hover:opacity-80"
                  style={{
                    background: "oklch(0.65 0.20 290 / 0.15)",
                    color: "oklch(0.72 0.20 290)",
                    border: "1px solid oklch(0.65 0.20 290 / 0.3)",
                  }}
                  data-ocid="jokes.button"
                >
                  Reveal Punchline 😂
                </button>
              )}
              {jokeRevealed && (
                <button
                  type="button"
                  onClick={() => {
                    setJokeIdx((p) => p + 1);
                    setJokeRevealed(false);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
                  style={{
                    background: "oklch(0.65 0.20 290 / 0.15)",
                    color: "oklch(0.72 0.20 290)",
                    border: "1px solid oklch(0.65 0.20 290 / 0.3)",
                  }}
                  data-ocid="jokes.secondary_button"
                >
                  Next Joke →
                </button>
              )}
            </div>
          </div>
        </Section>

        {/* ── Section 4: Daily Horoscope ── */}
        <Section title="Daily Horoscope" emoji="⭐">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-6">
            {ZODIAC_SIGNS.map((z) => (
              <button
                type="button"
                key={z.sign}
                onClick={() =>
                  setSelectedSign(selectedSign === z.sign ? null : z.sign)
                }
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 hover:scale-105"
                style={{
                  background:
                    selectedSign === z.sign
                      ? "oklch(0.78 0.18 65 / 0.15)"
                      : "oklch(0.14 0.04 250)",
                  border: `1.5px solid ${selectedSign === z.sign ? "oklch(0.78 0.18 65)" : "oklch(0.25 0.05 250)"}`,
                }}
                data-ocid={`horoscope.${z.sign.toLowerCase()}.button`}
              >
                <span className="text-xl">{z.emoji}</span>
                <span
                  className="text-xs font-medium"
                  style={{
                    color:
                      selectedSign === z.sign
                        ? "oklch(0.78 0.18 65)"
                        : "oklch(0.65 0.04 240)",
                  }}
                >
                  {z.sign.slice(0, 3)}
                </span>
              </button>
            ))}
          </div>

          {selectedSign &&
            (() => {
              const z = ZODIAC_SIGNS.find((s) => s.sign === selectedSign)!;
              const messages = HOROSCOPE_MESSAGES[selectedSign];
              const msg = messages[weekday % messages.length];
              return (
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.14 0.06 250), oklch(0.16 0.04 260))",
                    border: "1px solid oklch(0.78 0.18 65 / 0.3)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl">{z.emoji}</span>
                    <div>
                      <h3
                        className="text-xl font-bold"
                        style={{ color: "oklch(0.78 0.18 65)" }}
                      >
                        {z.sign}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "oklch(0.65 0.04 240)" }}
                      >
                        {z.dates}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-4 text-xs text-center">
                      <div>
                        <div style={{ color: "oklch(0.55 0.04 240)" }}>
                          Element
                        </div>
                        <div
                          className="font-semibold"
                          style={{ color: "oklch(0.80 0.12 80)" }}
                        >
                          {z.element}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "oklch(0.55 0.04 240)" }}>
                          Planet
                        </div>
                        <div
                          className="font-semibold"
                          style={{ color: "oklch(0.80 0.12 80)" }}
                        >
                          {z.planet}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.10 0.03 250 / 0.6)" }}
                  >
                    <p
                      className="text-sm leading-relaxed font-medium"
                      style={{ color: "oklch(0.85 0.05 240)" }}
                    >
                      ✨ {msg}
                    </p>
                  </div>
                </div>
              );
            })()}

          {!selectedSign && (
            <p
              className="text-center text-sm"
              style={{ color: "oklch(0.55 0.04 240)" }}
              data-ocid="horoscope.empty_state"
            >
              Select your zodiac sign above to see today's horoscope
            </p>
          )}
        </Section>

        {/* ── Section 5: News Ticker ── */}
        <Section title="Latest Headlines" emoji="📰">
          <div
            className="rounded-xl py-3 px-4 overflow-hidden relative"
            style={{
              background: "oklch(0.14 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: "oklch(0.65 0.25 27)", color: "white" }}
              >
                LIVE
              </span>
              <span
                className="text-xs"
                style={{ color: "oklch(0.65 0.04 240)" }}
              >
                Breaking News
              </span>
            </div>
            <div
              className="overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
              }}
            >
              <div
                className="flex gap-12 whitespace-nowrap news-ticker"
                style={{ color: "oklch(0.85 0.04 240)", fontSize: "0.875rem" }}
              >
                {[
                  ...ACTIVE_HEADLINES.map((h, j) => ({ h, k: `a-${j}` })),
                  ...ACTIVE_HEADLINES.map((h, j) => ({ h, k: `b-${j}` })),
                ].map(({ h, k }) => (
                  <span key={k} className="flex-shrink-0">
                    <span style={{ color: "oklch(0.78 0.18 65)" }}>● </span>
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <style>{`
            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .news-ticker {
              animation: ticker 40s linear infinite;
            }
            .news-ticker:hover {
              animation-play-state: paused;
            }
          `}</style>
        </Section>

        {/* ── Section 6: Assam & Bihu Content ── */}
        <Section title="Assam & Bihu Culture" emoji="🌿">
          {/* Bihu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {BIHU_INFO.map((b) => (
              <div
                key={b.name}
                className="rounded-2xl p-5"
                style={{
                  background: "oklch(0.14 0.04 250)",
                  border: "1px solid oklch(0.25 0.06 250)",
                }}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 bg-gradient-to-br ${b.color}`}
                >
                  {b.emoji}
                </div>
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: "oklch(0.78 0.18 65)" }}
                >
                  {b.name}
                </h3>
                <p
                  className="text-xs mb-2"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  📅 {b.month}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "oklch(0.72 0.04 240)" }}
                >
                  {b.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bihu Videos */}
          <h3
            className="font-bold mb-3 flex items-center gap-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            🎶 Bihu Songs & Cultural Videos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {ACTIVE_BIHU.map((v) => (
              <div
                key={v.id}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid oklch(0.25 0.06 250)" }}
              >
                <div className="relative" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div
                  className="px-3 py-2 text-xs font-medium truncate"
                  style={{
                    background: "oklch(0.14 0.04 250)",
                    color: "oklch(0.75 0.04 240)",
                  }}
                >
                  {v.title}
                </div>
              </div>
            ))}
          </div>

          {/* Assam at a Glance */}
          <h3
            className="font-bold mb-3 flex items-center gap-2"
            style={{ color: "oklch(0.78 0.18 65)" }}
          >
            🏔️ Assam at a Glance
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {ASSAM_FACTS.map((f) => (
              <div
                key={f.label}
                className="rounded-xl p-4 text-center"
                style={{
                  background: "oklch(0.14 0.04 250)",
                  border: "1px solid oklch(0.25 0.06 250)",
                }}
              >
                <p
                  className="text-xs mb-1"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  {f.label}
                </p>
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: "oklch(0.85 0.05 240)" }}
                >
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Footer */}
      <footer
        className="mt-12 py-8 px-6 text-center text-xs"
        style={{
          background: "oklch(0.10 0.03 250)",
          borderTop: "1px solid oklch(0.20 0.04 250)",
          color: "oklch(0.55 0.04 240)",
        }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "oklch(0.78 0.18 65)" }}
        >
          caffeine.ai
        </a>
      </footer>
    </main>
  );
}
