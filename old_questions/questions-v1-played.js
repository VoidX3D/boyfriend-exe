/* =============================================================================
 *  BOYFRIEND.EXE  —  data/questions.js
 * -----------------------------------------------------------------------------
 *  THE 15 CANON QUESTIONS (final quiz) + 3 PHANTOM (no-answer) RAGEBAIT
 *  QUESTIONS + 5 BONUS QUESTIONS (reference only, not in the main flow).
 *
 *  Canon answer key (boyfriend-supplied): C D D C B D D D C D D D D D D  (Q1-15)
 *  Bonus Q16-20 are all D. The quiz keys entirely off the `correct: true`
 *  flag per real question.
 *
 *  Option shape: { id, text, correct, feedback, reaction? }
 *    - correct  : is THIS the canon answer? (exactly one true per real question)
 *    - feedback : (legacy) short wrong line; `reaction` below is preferred.
 *    - reaction : { title, body } shown when she picks THIS specific option.
 *                 Lets the game call out WHY a particular wrong answer is wrong.
 *
 *  Real question:  { id, phase, category, question, hint, options[], correctFeedback }
 *  Phantom question:{ injectAfter, question, options[], phantom:true, reveal }
 * ========================================================================== */

const QUESTIONS = [
  /* ----------------------------------------------------------------- Q1 */
  {
    id: 1, phase: "cute", category: "IDENTITY 🐈",
    question: "If your boyfriend were a cat, what kind of cat would he actually be?",
    hint: "Think about how he moves through the world. Or doesn't.",
    options: [
      { id: "a", text: "Orange cat running on one brain cell and pure confidence", correct: false,
        reaction: { title: "NOT QUITE.", body: "Pure confidence, zero brain cells. Adorable. He has at least one brain cell and it is angry." } },
      { id: "b", text: "Black cat that sits silently judging everyone", correct: false,
        reaction: { title: "PLAUSIBLE.", body: "He does judge. But he also hacks the router. Keep looking." } },
      { id: "c", text: "Cat that somehow got Wi-Fi admin access and immediately started causing problems", correct: true, feedback: "" },
      { id: "d", text: "Chaotic little cat that demands attention and commits crimes recreationally", correct: false,
        reaction: { title: "CLOSE.", body: "That's the vibe, but option C is the actual canon. He admin'd the Wi-Fi." } }
    ],
    correctFeedback: "Correct. Okay, you actually know him."
  },

  /* ----------------------------------------------------------------- Q2 */
  {
    id: 2, phase: "cute", category: "ROMANCE ❤️",
    question: "What would your boyfriend genuinely prefer for a date?",
    hint: "Does he like 'plans' or does he like 'vibes'?",
    options: [
      { id: "a", text: "Fancy restaurant + romantic atmosphere", correct: false,
        reaction: { title: "WRONG.", body: "He would emotionally flee from the candles. There are too many expectations." } },
      { id: "b", text: "Go somewhere random with no real plan", correct: false,
        reaction: { title: "CUTE.", body: "You thought he liked chaos. He likes chaos HE builds. There is a difference." } },
      { id: "c", text: "Stay somewhere comfortable and talk for hours", correct: false,
        reaction: { title: "SWEET.", body: "Almost. But option D is what he actually does. He cannot leave a date alone." } },
      { id: "d", text: "Turn the date into some completely unnecessary adventure/project", correct: true, feedback: "" }
    ],
    correctFeedback: "Mhm. Noted. The lore deepens."
  },

  /* ----------------------------------------------------------------- Q3 */
  {
    id: 3, phase: "cute", category: "IDEAS 💀",
    question: "Your boyfriend suddenly gets an idea. What happens next?",
    hint: "Scale of 1 to 'we are now building something at 2am'.",
    options: [
      { id: "a", text: "I write it down and forget about it", correct: false,
        reaction: { title: "NO.", body: "You genuinely thought he would write the idea down and forget it? This man has never encountered an idea he couldn't unnecessarily turn into a project." } },
      { id: "b", text: "I think about it for a while", correct: false,
        reaction: { title: "ADORABLE.", body: "You thought he was going to think about it first. That's optimistic." } },
      { id: "c", text: "I immediately start planning/building it", correct: false,
        reaction: { title: "CLOSE.", body: "You understand the beginning of the problem. You have not yet witnessed the 47 additional steps." } },
      { id: "d", text: "I accidentally create a 47-step project that consumes my entire existence", correct: true, feedback: "" }
    ],
    correctFeedback: "Correct. The idea is never just an idea."
  },

  /* ----------------------------------------------------------------- Q4 */
  {
    id: 4, phase: "okay", category: "SUPERPOWER 🦸",
    question: "If your boyfriend could have one completely useless superpower, which would he actually want?",
    hint: "What is his most boyfriend-shaped useless skill?",
    options: [
      { id: "a", text: "Always know where my phone is", correct: false,
        reaction: { title: "TOO USEFUL.", body: "Rejected. He would never pick something practical." } },
      { id: "b", text: "Instantly find Wi-Fi passwords", correct: false,
        reaction: { title: "PLAUSIBLE.", body: "Tempting. Still not the canon answer." } },
      { id: "c", text: "Understand/fix any technology I touch", correct: true, feedback: "" },
      { id: "d", text: "Summon food whenever I want", correct: false,
        reaction: { title: "BEST OPTION.", body: "Honestly the best option and still wrong. He would pick the tech one." } }
    ],
    correctFeedback: "CORRECT. Of course that one."
  },

  /* ----------------------------------------------------------------- Q5 */
  {
    id: 5, phase: "okay", category: "ARGUMENT 😭",
    question: "What is your boyfriend actually like during an argument?",
    hint: "Be honest. We both know the answer.",
    options: [
      { id: "a", text: "Calmly explain my side", correct: false,
        reaction: { title: "WRONG.", body: "In what universe does he calmly explain. He is loading a monologue." } },
      { id: "b", text: "Get quiet and think", correct: true, feedback: "" },
      { id: "c", text: "Start explaining my reasoning in increasingly unnecessary detail", correct: false,
        reaction: { title: "WRONG.", body: "That is what he does to OTHER people, not what he does internally. He goes quiet first." } },
      { id: "d", text: "Somehow turn the argument into a 40-minute presentation with supporting evidence", correct: false,
        reaction: { title: "WRONG.", body: "You have mistaken 'quietly processing the situation' for 'defending a thesis before the United Nations.' Understandable. Still wrong." } }
    ],
    correctFeedback: "CORRECT. The chaos has temporarily stopped. He is thinking. This is somehow more concerning."
  },

  /* ----------------------------------------------------------------- Q6 */
  {
    id: 6, phase: "okay", category: "CRISIS 🧟",
    question: "The world ends tomorrow. What's your boyfriend's first move?",
    hint: "Does he find you, or does he find a 'system'?",
    options: [
      { id: "a", text: "Find Anuradha", correct: false,
        reaction: { title: "SWEET.", body: "You believe he'd find you first. He'd find the system first. He loves you, but he LOVES a good survival architecture." } },
      { id: "b", text: "Find food and water", correct: false,
        reaction: { title: "WRONG.", body: "Priorities: questionable. He is already drawing a diagram." } },
      { id: "c", text: "Find somewhere safe", correct: false,
        reaction: { title: "WRONG.", body: "Safe is boring. He is building." } },
      { id: "d", text: "Start designing an unnecessarily sophisticated survival system", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. You're starting to understand the lore."
  },

  /* ----------------------------------------------------------------- Q7 */
  {
    id: 7, phase: "wtf", category: "HABITS 📱",
    question: "Your boyfriend's phone says 1%. What does he do?",
    hint: "Does 1% mean anything to him?",
    options: [
      { id: "a", text: "Immediately charge it", correct: false,
        reaction: { title: "LIAR.", body: "He does not. He keeps going." } },
      { id: "b", text: "Start looking for a charger", correct: false,
        reaction: { title: "WRONG.", body: "Only after it's already dead." } },
      { id: "c", text: "Accept that my phone is dying", correct: false,
        reaction: { title: "WRONG.", body: "He is not that zen." } },
      { id: "d", text: "Continue using it because that 1% still has a job to do", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. 1% is a state of mind."
  },

  /* ----------------------------------------------------------------- Q8 */
  {
    id: 8, phase: "wtf", category: "ANIMAL 🦝",
    question: "If your boyfriend couldn't be human anymore, what animal would fit him best?",
    hint: "Nocturnal? Hoards things? Lives behind a screen?",
    options: [
      { id: "a", text: "Cat", correct: false, reaction: { title: "WRONG.", body: "Too mainstream for him." } },
      { id: "b", text: "Fox", correct: false, reaction: { title: "WRONG.", body: "He wishes he was this cool." } },
      { id: "c", text: "Raccoon", correct: false, reaction: { title: "CLOSE.", body: "Trash-panda energy, yes. But option D is the actual canon." } },
      { id: "d", text: "Some unidentified creature scientists discover living next to a computer", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. Still undocumented. Still behind the monitor."
  },

  /* ----------------------------------------------------------------- Q9 */
  {
    id: 9, phase: "wtf", category: "NAVIGATION 🗺️",
    question: "You and Anuradha are completely lost. What does your boyfriend actually say?",
    hint: "Does 'I know where we are' ever end well?",
    options: [
      { id: "a", text: "Let's check the map.", correct: false, reaction: { title: "WRONG.", body: "He does not check the map." } },
      { id: "b", text: "Let's ask someone.", correct: false, reaction: { title: "WRONG.", body: "Never. Pride first." } },
      { id: "c", text: "I know where we are.", correct: true, feedback: "" },
      { id: "d", text: "Don't worry, I have a plan.", correct: false,
        reaction: { title: "WRONG.", body: "There was, in fact, no plan. Option C is the canon. He knows where he is and lies about the rest." } }
    ],
    correctFeedback: "CORRECT. There was, in fact, no plan. He just knows."
  },

  /* ----------------------------------------------------------------- Q10 */
  {
    id: 10, phase: "glitch", category: "MONEY 💸",
    question: "Your boyfriend suddenly receives $1,000. What is most likely to happen?",
    hint: "Money in, project out.",
    options: [
      { id: "a", text: "Save most/all of it", correct: false, reaction: { title: "WRONG.", body: "Responsible. Incorrect." } },
      { id: "b", text: "Buy something you've wanted", correct: false, reaction: { title: "WRONG.", body: "Too normal for him." } },
      { id: "c", text: "Spend it on something ridiculously unnecessary but interesting", correct: false,
        reaction: { title: "CLOSE.", body: "Getting warmer. But watch option D." } },
      { id: "d", text: "Somehow turn it into a project", correct: true, feedback: "" }
    ],
    correctFeedback: "WAIT. YOU ACTUALLY KNEW THAT?"
  },

  /* ----------------------------------------------------------------- Q11 */
  {
    id: 11, phase: "glitch", category: "TIME ⏰",
    question: "Your boyfriend says: 'I'll be done in five minutes.' What does that ACTUALLY mean?",
    hint: "Five minutes. Does it ever mean five minutes.",
    options: [
      { id: "a", text: "Five actual minutes", correct: false, reaction: { title: "ADORABLE.", body: "No." } },
      { id: "b", text: "Around ten minutes", correct: false, reaction: { title: "GENEROUS.", body: "Still no." } },
      { id: "c", text: "Probably 30-60 minutes", correct: false, reaction: { title: "WARM.", body: "Warmer. But not the canon." } },
      { id: "d", text: "Time has lost meaning. I will return when the quest is complete.", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. Time is a construct he refuses to obey."
  },

  /* ----------------------------------------------------------------- Q12 */
  {
    id: 12, phase: "glitch", category: "TECH 💻",
    question: "If your boyfriend were a computer, what would his biggest problem be?",
    hint: "Too many tabs? Installs junk? Overheats from thinking?",
    options: [
      { id: "a", text: "Low storage", correct: false, reaction: { title: "WRONG.", body: "He'd just buy more." } },
      { id: "b", text: "Overheating", correct: false, reaction: { title: "WRONG.", body: "Only when bored." } },
      { id: "c", text: "Too many processes running simultaneously", correct: false, reaction: { title: "CLOSE.", body: "Close, but option D is the full truth." } },
      { id: "d", text: "37 tabs open, 14 unfinished projects, 9 ideas running in the background, and absolutely no intention of closing anything", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. 47 background tasks. None of them finished."
  },

  /* ----------------------------------------------------------------- Q13 */
  {
    id: 13, phase: "stop", category: "CONFIDENCE 🚨",
    question: "Your boyfriend says: 'Don't worry, I know what I'm doing.' What is usually happening?",
    hint: "Back up the files. Always back up the files.",
    options: [
      { id: "a", text: "I genuinely know what I'm doing", correct: false, reaction: { title: "WRONG.", body: "Absolutely not." } },
      { id: "b", text: "I'm mostly confident", correct: false, reaction: { title: "WRONG.", body: "He'll say 'nothing'. He is lying." } },
      { id: "c", text: "I have absolutely no idea but I'm figuring it out", correct: false, reaction: { title: "WRONG.", body: "Slightly is not enough." } },
      { id: "d", text: "I have made a terrible decision and everyone should probably leave the room", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. You've learned. The system is proud. The system is lying."
  },

  /* ----------------------------------------------------------------- Q14 */
  {
    id: 14, phase: "stop", category: "PERSONA ☢️",
    question: "Which version of your boyfriend should society fear most?",
    hint: "2am + a new idea = danger.",
    options: [
      { id: "a", text: "Hungry me", correct: false, reaction: { title: "WRONG.", body: "Manageable with snacks." } },
      { id: "b", text: "Sleep-deprived me", correct: false, reaction: { title: "WRONG.", body: "Concerning, but survivable." } },
      { id: "c", text: "Bored me", correct: false, reaction: { title: "WRONG.", body: "Bored me builds things. Fear. But not the canon." } },
      { id: "d", text: "Me at 2 AM after getting a new project idea", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. This is getting suspicious."
  },

  /* ----------------------------------------------------------------- Q15 — FINAL BOSS */
  {
    id: 15, phase: "boss", category: "TRUE SELF 💀",
    question: "After everything you've learned, which description is actually your boyfriend?",
    hint: "Be honest. The quiz already knows.",
    points: 100, isFinal: true,
    options: [
      { id: "a", text: "A relatively normal guy with normal hobbies and reasonable decision-making", correct: false,
        reaction: { title: "WRONG.", body: "We both know this is a lie." } },
      { id: "b", text: "A nerd who gets unnecessarily invested in whatever he's currently interested in", correct: false,
        reaction: { title: "WRONG.", body: "True. But not the WHOLE truth." } },
      { id: "c", text: "A chaotic programmer powered by curiosity, Wi-Fi, random ideas, and questionable decisions", correct: false,
        reaction: { title: "WRONG.", body: "True. But option D is the actual canon. He is hiding." } },
      { id: "d", text: "A mysterious entity pretending to be a normal boyfriend while secretly running 47 unfinished projects in the background", correct: true, feedback: "" }
    ],
    correctFeedback: "CORRECT. ... She knows too much."
  }
];

/* =============================================================================
 *  PHANTOM QUESTIONS — no correct answer. Pure ragebait. Injected after the
 *  given real-question id. Picking ANY option is "wrong"; the engine then
 *  reveals there was never a correct answer, and moves on.
 * ========================================================================== */
const PHANTOM_QUESTIONS = [
  {
    id: "P1", phase: "wtf", category: "BONUS (NOT REALLY) ☢️",
    injectAfter: 7,
    question: "BONUS QUESTION. What is your boyfriend's secret middle name that he has never told you?",
    options: [
      { id: "a", text: "You don't know it. Obviously." },
      { id: "b", text: "He doesn't have one. Obviously." },
      { id: "c", text: "It's classified. Obviously." },
      { id: "d", text: "Why are you answering a question with no correct option" }
    ],
    reveal: "THIS QUESTION HAS NO CORRECT ANSWER. There is no secret middle name. There never was. You just lost 25 points for trusting the bonus round. Classic."
  },
  {
    id: "P2", phase: "glitch", category: "TRICK (DEFINITELY) 💀",
    injectAfter: 11,
    question: "Quickfire. Which of these has your boyfriend NEVER, not even once, said out loud?",
    options: [
      { id: "a", text: "I have an idea." },
      { id: "b", text: "Don't worry, I have a plan." },
      { id: "c", text: "I'll be done in five minutes." },
      { id: "d", text: "This will only take a second." }
    ],
    reveal: "WRONG. He has said all of those. He has said all of those MANY times. The trick was that there was no trick and also no correct answer. Your confidence was the real test. You failed it."
  },
  {
    id: "P3", phase: "stop", category: "THE IMPOSSIBLE ONE 👁️",
    injectAfter: 13,
    question: "FINAL IMPOSSIBLE QUESTION. Pick the option that is 100% true. (One of them is. Probably.)",
    options: [
      { id: "a", text: "This one." },
      { id: "b", text: "Definitely not this one." },
      { id: "c", text: "The previous one." },
      { id: "d", text: "None of these, the quiz is lying to you" }
    ],
    reveal: "You picked D. D says the quiz is lying. The quiz was, in fact, lying. But D is also wrong, because there is no correct answer, because THIS QUESTION WAS NOT REAL. You are now arguing with a webpage. The webpage is winning."
  }
];

/* =============================================================================
 *  BONUS CANON QUESTIONS (Q16-20) — reference only, not played in the main
 *  flow. Kept here so the boyfriend lore is complete. All canon answer = D.
 * ========================================================================== */
const BONUS_QUESTIONS = [
  { id: 16, category: "BORED 🥱", question: "When your boyfriend is bored, what does he do?",
    options: [
      { id: "a", text: "Watch something", correct: false },
      { id: "b", text: "Scroll endlessly", correct: false },
      { id: "c", text: "Start a random project", correct: false },
      { id: "d", text: "Invent a completely unnecessary problem so I can solve it", correct: true }
    ] },
  { id: 17, category: "CURIOSITY 🧠", question: "When your boyfriend discovers something interesting, what happens?",
    options: [
      { id: "a", text: "Think 'that's cool'", correct: false },
      { id: "b", text: "Look it up", correct: false },
      { id: "c", text: "Research it for hours", correct: false },
      { id: "d", text: "Accidentally become an expert and start planning a project around it", correct: true }
    ] },
  { id: 18, category: "PROJECTS 📂", question: "What's your boyfriend's relationship with unfinished projects?",
    options: [
      { id: "a", text: "I finish everything", correct: false },
      { id: "b", text: "I have a few unfinished things", correct: false },
      { id: "c", text: "I have several unfinished things", correct: false },
      { id: "d", text: "My unfinished projects have formed their own civilization", correct: true }
    ] },
  { id: 19, category: "SLEEP 😴", question: "What's your boyfriend's natural sleep schedule?",
    options: [
      { id: "a", text: "Responsible", correct: false },
      { id: "b", text: "Mostly responsible", correct: false },
      { id: "c", text: "Questionable", correct: false },
      { id: "d", text: "What is a sleep schedule?", correct: true }
    ] },
  { id: 20, category: "TALKING 💻", question: "Someone asks your boyfriend what he's working on.",
    options: [
      { id: "a", text: "Nothing much.", correct: false },
      { id: "b", text: "Explain the current project", correct: false },
      { id: "c", text: "Give them a surprisingly detailed explanation", correct: false },
      { id: "d", text: "45 minutes later they're still trapped in the presentation", correct: true }
    ] }
];

if (typeof window !== "undefined") {
  window.QUESTIONS = QUESTIONS;
  window.PHANTOM_QUESTIONS = PHANTOM_QUESTIONS;
  window.BONUS_QUESTIONS = BONUS_QUESTIONS;
}
