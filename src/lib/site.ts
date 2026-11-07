import type { L10n, Locale } from "./i18n";

export type Category = "ads" | "explainer" | "social" | "ai-video";
export const CATEGORIES: Category[] = ["ads", "explainer", "social", "ai-video"];

export interface Project {
  id: string;
  slug: string;
  order: number;
  title: L10n;
  caption: L10n;
  categories: Category[];
  client?: string;
  year?: number;
  cover?: string;
  previewVideo?: string;
  logo?: string; // shown centered on the card, over bgVideo
  bgVideo?: string; // muted, looping, blurred card background
  bgClip?: [number, number]; // loop only this part of bgVideo, in seconds
  bgBlur?: number; // px, default 35 (≈ Figma layer blur 70)
  logoWidth?: number; // % of card width, default 65
  layers?: { bg: string; fg: string }; // parallax cover: fg (cutout) zooms in, bg zooms out on hover
  modal?: "showcase"; // case window layout: wide video left, info right
  framed?: boolean; // showcase: video sits inside a grey frame instead of filling the panel
  story?: boolean; // showcase: show task + solution texts
  stills?: string[]; // showcase: stillframe gallery under the video
  clips?: { src: string; w: number; h: number }[]; // showcase: several muted videos side by side instead of one
  tools?: string[];
  video?: { provider: "vimeo" | "youtube" | "file"; src: string; aspect: "16:9" | "9:16" | "1:1" | "4:5" };
  task: L10n;
  solution: L10n;
  result: L10n;
  metrics?: { value: string; label: L10n }[];
}

export interface Testimonial {
  id: string;
  author: string;
  country: string;
  flag: string;
  avatar?: string;
  text: string;
}

const same = (s: string): L10n => ({ ru: s, kz: s, en: s });
const ph = (ru: string, kz: string, en: string): L10n => ({ ru, kz, en });

/** All editable site settings live here. */
export const settings = {
  showreel: { preview: "/showreel.mp4", poster: "", full: "/showreel.mp4" as string }, // full: .mp4 file or YouTube/Vimeo embed URL
  stats: {
    videos: "500+",
    years: "5",
    ctr: ph("+ много %", "+ көп %", "+ a lot %"), // PLACEHOLDER — replace with a real number, e.g. "+38%"
  },
  contacts: { telegram: "zhanzhal", email: "zhantemir.zhalgas@gmail.com", instagram: "zhanthedesigner" },
  fiverrUrl: "https://www.fiverr.com/",
  tallyUrl: "", // e.g. https://tally.so/r/XXXXXX — empty shows the placeholder panel
};

const caption = ph("AI-рекламная кампания", "AI-жарнамалық науқан", "AI ad campaign");
const task = ph(
  "Описание задачи клиента появится здесь.",
  "Клиент міндетінің сипаттамасы осында болады.",
  "The client's brief will appear here.",
);
const solution = ph(
  "Как мы решили задачу: идея, стиль, анимация.",
  "Міндетті қалай шештік: идея, стиль, анимация.",
  "How we solved it: idea, style, animation.",
);
const result = ph("Результат и цифры кампании.", "Науқан нәтижесі мен көрсеткіштері.", "The outcome and campaign numbers.");

const cats: Category[][] = [
  ["ai-video", "ads"],
  ["ai-video", "ads"],
  ["ai-video", "explainer"],
  ["ai-video", "social"],
  ["ai-video"],
  ["ai-video", "social"],
];

// Real projects, by position — override the placeholder fields above.
const real: Partial<Project>[] = [
  {
    slug: "discord",
    title: same("Discord"),
    caption: ph("Motion Design Концепт", "Motion Design концепт", "Motion design concept"),
    categories: ["ads"],
    logo: "/projects/discord-logo.png",
    bgVideo: "/projects/discord.mp4",
    bgClip: [8, 13],
    modal: "showcase",
    framed: true,
    video: { provider: "file", src: "/projects/discord.mp4", aspect: "16:9" },
    tools: ["After Effects", "Figma", "Adobe Illustrator"],
  },
  {
    slug: "1fit",
    title: same("1Fit"),
    caption: ph(
      "Motion Design концепт для рекламы в лифте",
      "Лифттегі жарнамаға арналған Motion Design концепт",
      "Motion design concept for elevator ads",
    ),
    categories: ["ads"],
    logo: "/projects/1fit-logo.png",
    logoWidth: 70,
    bgVideo: "/projects/blue-gradient-loop.mp4",
    bgBlur: 12,
    modal: "showcase",
    video: { provider: "file", src: "/projects/1fit.mp4", aspect: "16:9" },
    tools: ["After Effects", "Figma"],
    story: true,
    task: ph(
      "Создать короткий рекламный ролик для экранов в лифтах, который за несколько секунд покажет разнообразие направлений в приложении 1fit. Главная мысль: в 1fit каждый найдёт занятие по душе, будь то единоборства, растяжка или силовые тренировки.",
      "Лифттердегі экрандарға арналған қысқа жарнамалық ролик жасау: бірнеше секундта 1fit қосымшасындағы бағыттардың әралуандығын көрсету. Басты ой: 1fit-те әркім өзіне ұнайтын жаттығуды табады — жекпе-жек, созылу немесе күш жаттығулары.",
      "Make a short ad for elevator screens that shows the variety of activities in the 1fit app in a few seconds. The key message: everyone finds something they love in 1fit, whether it's martial arts, stretching or strength training.",
    ),
    solution: ph(
      "Рамка в стиле карточек приложения проходит через весь ролик, а внутри сменяются живые кадры тренировок: единоборства (25 залов), стретчинг и пилатес (76 залов), тренажёрный зал (102 зала). 15 секунд и без звука, поэтому ролик считывается с одного взгляда, как и нужно для лифта.",
      "Қосымша карточкалары стиліндегі рамка бүкіл роликтен өтеді, ал ішінде жаттығулардың тірі кадрлары ауысады: жекпе-жек (25 зал), стретчинг пен пилатес (76 зал), тренажер залы (102 зал). 15 секунд, дыбыссыз — ролик бір қарағаннан түсінікті, лифтке дәл осы керек.",
      "A frame styled like the app's cards runs through the whole video while live workout shots change inside it: martial arts (25 gyms), stretching and pilates (76), gym (102). 15 seconds with no sound, so it reads at a glance, just as an elevator ad should.",
    ),
    stills: ["/projects/1fit-still-1.jpg", "/projects/1fit-still-2.jpg", "/projects/1fit-still-3.jpg", "/projects/1fit-still-4.jpg"],
  },
  {
    slug: "stevie-emerson",
    title: same("Stevie Emerson"),
    caption: ph(
      "Монтаж курсов англоязычного ютубера миллионника",
      "Миллионер ағылшын тілді ютубердің курстарын монтаждау",
      "Course editing for an English-speaking YouTuber with 1M+ subscribers",
    ),
    categories: ["explainer"],
    layers: { bg: "/projects/stevie-bg.png", fg: "/projects/stevie-person.png" },
    modal: "showcase",
    video: { provider: "file", src: "/projects/stevie.mp4", aspect: "16:9" },
    tools: ["After Effects", "Figma", "Photoshop"],
    story: true,
    task: ph(
      "Смонтировать обучающие ролики для курсов англоязычного ютубера-миллионника. Talking head легко становится скучным, а зрителю нужно удерживать внимание и усваивать материал без потери темпа.",
      "Ағылшын тілді миллионер-ютубердің курстарына арналған оқу роликтерін монтаждау. Talking head оңай іш пыстырады, ал көрерменге назарын ұстап, материалды қарқынын жоғалтпай меңгеруі керек.",
      "Edit the training videos for a million-subscriber English-speaking YouTuber's courses. A talking head gets boring fast, and viewers need to stay focused and absorb the material without losing pace.",
    ),
    solution: ph(
      "Динамичный монтаж в ритме речи: смена планов, акценты на ключевых мыслях, графика и текст, которые раскрывают сказанное прямо в кадре. Каждый блок курса собран так, чтобы смотреться как живое видео с канала, а не как запись лекции.",
      "Сөйлеу ырғағындағы серпінді монтаж: кадр ауысуы, негізгі ойларға екпін, айтылғанды кадрдың өзінде ашатын графика мен мәтін. Курстың әр блогы дәріс жазбасы емес, арнадағы жанды видео сияқты көрінетіндей жиналған.",
      "Dynamic editing in the rhythm of speech: shot changes, emphasis on key ideas, graphics and text that unpack what's being said right in the frame. Every course block is cut to feel like a live video from the channel, not a recorded lecture.",
    ),
    stills: ["/projects/stevie-still-1.gif", "/projects/stevie-still-2.gif", "/projects/stevie-still-3.gif", "/projects/stevie-still-4.gif"],
  },
  {
    slug: "kaspi",
    title: same("Kaspi"),
    caption: ph("Motion Design Концепт", "Motion Design концепт", "Motion design concept"),
    categories: ["ads"],
    logo: "/projects/kaspi-logo.png",
    logoWidth: 38,
    bgVideo: "/projects/red-gradient-loop.mp4",
    bgBlur: 12,
    modal: "showcase",
    clips: [
      { src: "/projects/kaspi-vertical.mp4", w: 1080, h: 1920 },
      { src: "/projects/kaspi-horizontal.mp4", w: 1350, h: 1080 },
    ],
    tools: ["After Effects", "Figma", "Midjourney", "Photoshop"],
    story: true,
    task: ph(
      "Показать, что Kaspi у каждого свой: одно приложение закрывает совершенно разные потребности разных людей.\nКонцепт-ролик на тему «что, если бы у Kaspi появилось своё такси». Нужно было обыграть ожидание, которое давно живёт среди пользователей.",
      "Kaspi әркімде өзінше екенін көрсету: бір қосымша әр түрлі адамдардың мүлдем әр түрлі қажеттіліктерін жабады.\n«Kaspi-дің өз таксиі болса ше» тақырыбындағы концепт-ролик. Пайдаланушылар арасында көптен бері жүрген күтуді ойнату керек болды.",
      "Show that everyone has their own Kaspi: one app covers completely different needs of different people.\nA concept video on “what if Kaspi had its own taxi”, playing on an expectation users have had for a long time.",
    ),
    solution: ph(
      "В центре кадра стоит персональная карточка вида («Kaspi Аружан»), а вокруг появляются её покупки: отель, билеты в Анталью, кроссовки, продукты. Затем карточка переворачивается и показывает другого человека.\nЭкран постепенно заполняется комментариями пользователей: «Когда уже будет такси от Kaspi?», «Kaspi, ждём такси!».",
      "Кадр ортасында жеке карточка тұр («Аружанның Kaspi-і»), ал айналасында оның сатып алғандары пайда болады: қонақүй, Анталияға билеттер, кроссовкалар, азық-түлік. Содан кейін карточка аударылып, басқа адамды көрсетеді.\nЭкран бірте-бірте пайдаланушылардың пікірлеріне толады: «Kaspi-дің таксиі қашан болады?», «Kaspi, такси күтеміз!».",
      "A personal card (“Aruzhan's Kaspi”) sits in the center while her purchases appear around it: a hotel, tickets to Antalya, sneakers, groceries. Then the card flips to show another person.\nThe screen gradually fills with user comments: “When is Kaspi getting a taxi?”, “Kaspi, we're waiting for the taxi!”.",
    ),
    stills: ["/projects/kaspi-still-1.jpg", "/projects/kaspi-still-2.jpg", "/projects/kaspi-still-3.jpg", "/projects/kaspi-still-4.jpg"],
  },
  {
    slug: "finelo",
    title: same("Finelo"),
    caption: ph("Motion Design Концепт", "Motion Design концепт", "Motion design concept"),
    categories: ["ads"],
    logo: "/projects/finelo-logo.png",
    logoWidth: 50,
    bgVideo: "/projects/violet-gradient-loop.mp4",
    bgBlur: 12,
    modal: "showcase",
    video: { provider: "file", src: "/projects/finelo.mp4", aspect: "16:9" },
    tools: ["After Effects", "Figma", "Photoshop", "ChatGPT"],
    story: true,
    task: ph(
      "Показать функционал приложения Finelo и объяснить, зачем оно нужно пользователю, быстро, понятно и без перегруза деталями.",
      "Finelo қосымшасының мүмкіндіктерін көрсетіп, оның пайдаланушыға не үшін керек екенін тез, түсінікті және артық егжей-тегжейсіз түсіндіру.",
      "Show what the Finelo app does and explain why users need it: quickly, clearly and without overloading them with details.",
    ),
    solution: ph(
      "Перед продакшеном провёл анализ рынка и роликов конкурентов: как они подают продукт, что цепляет аудиторию и где их слабые места. На основе этого собрал ролик, где каждая функция приложения показана через реальную потребность пользователя: сначала проблема, потом экран приложения, который её решает.",
      "Продакшн алдында нарық пен бәсекелестердің роликтеріне талдау жасадым: олар өнімді қалай ұсынады, аудиторияны не қызықтырады және әлсіз тұстары қайда. Соның негізінде қосымшаның әр функциясы пайдаланушының нақты қажеттілігі арқылы көрсетілетін ролик жинадым: алдымен мәселе, содан кейін оны шешетін қосымша экраны.",
      "Before production I analyzed the market and competitors' videos: how they present the product, what hooks the audience and where they fall short. Based on that, I built a video where every feature is shown through a real user need: first the problem, then the app screen that solves it.",
    ),
    stills: ["/projects/finelo-still-1.gif", "/projects/finelo-still-2.gif", "/projects/finelo-still-3.gif", "/projects/finelo-still-4.gif"],
  },
  {
    slug: "zhiyn",
    title: same("ZHIYN"),
    caption: ph("AI-анимационный сериал", "AI-анимациялық сериал", "AI animated series"),
    categories: ["ai-video"],
    cover: "/projects/zhiyn-cover.jpg",
    modal: "showcase",
    video: { provider: "file", src: "/projects/zhiyn-teaser.mp4", aspect: "16:9" },
    tools: ["After Effects", "Figma", "DaVinci Resolve", "Midjourney", "Seedance 2.5"],
    story: true,
    task: ph(
      "Создать концепт анимационного сериала ZHIYN и показать, каким мог бы быть отечественный казахстанский мультсериал: с собственным миром, характером и визуальным языком.",
      "ZHIYN анимациялық сериалының концептін жасап, отандық қазақстандық мультсериал қандай болуы мүмкін екенін көрсету: өз әлемі, мінезі және визуалды тілімен.",
      "Create a concept for the ZHIYN animated series and show what a homegrown Kazakh cartoon could look like: with its own world, character and visual language.",
    ),
    solution: ph(
      "Весь пайплайн собран на нейросетях, от персонажей и мира до анимации сцен. Финальный вид ролик получил на постпродакшене в DaVinci Resolve: цветокоррекция и плёночное зерно добавили кинематографичность и убрали ощущение «чистой» AI-картинки.",
      "Бүкіл пайплайн нейрожелілерде жиналған: кейіпкерлер мен әлемнен бастап сахналар анимациясына дейін. Соңғы көрінісін ролик DaVinci Resolve-тағы постпродакшнда алды: түс түзету мен пленка дәні кинематографиялық сипат беріп, «таза» AI-сурет сезімін жойды.",
      "The whole pipeline runs on neural networks, from characters and world to scene animation. The video got its final look in post-production in DaVinci Resolve: color grading and film grain added a cinematic feel and removed the “clean” AI-image look.",
    ),
    stills: ["/projects/zhiyn-still-1.mp4", "/projects/zhiyn-still-2.mp4", "/projects/zhiyn-still-3.mp4", "/projects/zhiyn-still-4.mp4"],
  },
];

export const projects: Project[] = cats.map((c, i) => ({
  id: `p${i + 1}`,
  slug: `project-${i + 1}`,
  order: i,
  title: ph(`Project ${i + 1}`, `Project ${i + 1}`, `Project ${i + 1}`),
  caption,
  categories: c,
  year: 2026,
  task,
  solution,
  result,
  metrics: [{ value: "+38%", label: same("CTR") }],
  ...real[i],
}));

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    author: "briansikoff",
    country: "United States",
    flag: "🇺🇸",
    text: "I can not thank Zhan enough for all the hard work he did in making my video come to life. The communication with him was steller, he replied day or night, the time difference didn't matter.\n\nI had several people within my organization who each had two cents to add. Zhan took all the suggestions my people made and didn't even flinch. He took the challenge and ran with it.",
  },
  { id: "t2", author: "johnnyx8215", country: "United States", flag: "🇺🇸", text: "Did a awesome Job!" },
  { id: "t3", author: "rshouser", country: "United States", flag: "🇺🇸", text: "good work!" },
  {
    id: "t4",
    author: "Andrew",
    country: "Russia",
    flag: "🇷🇺",
    text: "Жантемир, спасибо за помощь в создании интерфейса для нашей компьютерной игры. Мы не забудем твой усердный труд!",
  },
];

export const services: { cat: Category; title: L10n; desc: L10n; tags: string[] }[] = [
  {
    cat: "ads",
    title: ph("Рекламные ролики", "Жарнамалық роликтер", "Ad videos"),
    desc: ph(
      "Performance-креативы для таргета и digital.",
      "Таргет пен digital үшін performance-креативтер.",
      "Performance creatives for paid social and digital.",
    ),
    tags: ["9:16", "1:1", "16:9"],
  },
  {
    cat: "explainer",
    title: ph("Explainer-видео", "Explainer-бейнелер", "Explainer videos"),
    desc: ph(
      "Объясняю продукт за 30–90 секунд.",
      "Өнімді 30–90 секундта түсіндіремін.",
      "Your product explained in 30–90 seconds.",
    ),
    tags: ["16:9", "30–90s"],
  },
  {
    cat: "social",
    title: ph("Анимация для соцсетей", "Әлеуметтік желілерге анимация", "Social-media animation"),
    desc: ph("Reels, Shorts, TikTok, сторис.", "Reels, Shorts, TikTok, сторис.", "Reels, Shorts, TikTok, stories."),
    tags: ["9:16", "4:5"],
  },
  {
    cat: "ai-video",
    title: ph("AI-видео продакшн", "AI-видео продакшн", "AI video production"),
    desc: ph(
      "Когда нужно быстро и много: десятки вариаций под тесты.",
      "Тез әрі көп керек болса: тесттерге ондаған нұсқа.",
      "Fast and at volume: dozens of variations for testing.",
    ),
    tags: ["9:16", "1:1", "A/B"],
  },
];

export const faq: { q: L10n; a: L10n }[] = [
  {
    q: ph("Сколько стоит ролик?", "Ролик қанша тұрады?", "How much does a video cost?"),
    a: ph(
      "Цена зависит от длительности, сложности анимации и сроков. Напишите задачу — назову точную стоимость.",
      "Баға ұзақтығына, анимация күрделілігіне және мерзімге байланысты. Міндетті жазыңыз — нақты бағасын айтамын.",
      "It depends on length, animation complexity and deadline. Send me the brief and I'll quote an exact price.",
    ),
  },
  {
    q: ph("Какие сроки?", "Мерзімі қандай?", "What are the timelines?"),
    a: ph(
      "Короткий ролик для соцсетей — от 3 дней, explainer — 1–3 недели.",
      "Әлеуметтік желіге қысқа ролик — 3 күннен, explainer — 1–3 апта.",
      "A short social video takes from 3 days, an explainer 1–3 weeks.",
    ),
  },
  {
    q: ph("Что нужно от меня для старта?", "Бастау үшін менен не керек?", "What do you need from me to start?"),
    a: ph(
      "Бриф, логотип, брендбук и ссылки на референсы.",
      "Бриф, логотип, брендбук және референс сілтемелері.",
      "A brief, your logo, brand guidelines and reference links.",
    ),
  },
  {
    q: ph("Сколько правок входит?", "Қанша түзету кіреді?", "How many revisions are included?"),
    a: ph(
      "Обычно две итерации правок на каждом этапе.",
      "Әдетте әр кезеңде екі түзету кезеңі.",
      "Usually two rounds of revisions at each stage.",
    ),
  },
  {
    q: ph("В каких форматах сдаёте файлы?", "Файлдарды қандай форматта тапсырасыз?", "Which formats do you deliver?"),
    a: ph(
      "9:16, 1:1, 16:9 — исходники по запросу.",
      "9:16, 1:1, 16:9 — бастапқы файлдар сұраныс бойынша.",
      "9:16, 1:1, 16:9 — source files on request.",
    ),
  },
  {
    q: ph("Работаете с иностранными клиентами?", "Шетелдік клиенттермен жұмыс істейсіз бе?", "Do you work with international clients?"),
    a: ph(
      "Да, через Fiverr или напрямую.",
      "Иә, Fiverr арқылы немесе тікелей.",
      "Yes — via Fiverr or directly.",
    ),
  },
];

export const loc = (v: L10n, l: Locale) => v[l];
