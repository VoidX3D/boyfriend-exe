/* =============================================================================
 *  BOYFRIEND.EXE  —  data/content.js
 * -----------------------------------------------------------------------------
 *  ALL the unhinged / ragebait copy lives here so it can be copy-pasted or
 *  regenerated (e.g. from ChatGPT) without touching the engine.
 *
 *  NO EMOJIS. SVG only. Equal-length answer options are handled in engine.js
 *  by padding, not here.
 *
 *  Sections:
 *    wrongScreens     – flat pool (fallback for wrong answers)
 *    correctScreens   – flat pool (fallback for correct answers)
 *    wrongReactions   – typed wrong-answer reactions (the reaction engine)
 *    correctReactions – typed correct-answer reactions
 *    timing           – fast / slow answer reactions
 *    wrongStreak      – triggered on consecutive wrong answers
 *    plotTwists       – mid-quiz full-screen interludes
 *    conspiracy       – "you picked D too much" gag lines
 *    systemMessages   – fake loading-screen status lines
 *    fakeErrors       – fake crash screens
 *    finalWarnings    – pre-boss warnings
 *    boyfriendResponses – end-screen "what he thinks" by score tier
 *    achievements     – secret achievement defs
 * ========================================================================== */
window.CONTENT = {

  /* ---- flat wrong pool (still used as a fallback) -------------------- */
  wrongScreens: [
    { title: "WOW. REALLY?", body: "That was your answer. You looked at all four options, considered the consequences, and still chose that one. Fascinating." },
    { title: "BOYFRIEND LORE: DENIED", body: "Incorrect. Somewhere, your boyfriend just felt a disturbance in the force and has no idea why." },
    { title: "CONNECTION TO BOYFRIEND LOST", body: "Error: 0xBF. The connection was stable until you selected that answer. He has now sighed remotely." },
    { title: "CONGRATULATIONS", body: "You have successfully earned absolutely nothing. Please enjoy your complimentary loss of dignity." },
    { title: "404: CORRECTNESS NOT FOUND", body: "The answer you were looking for does not exist at this location. Neither does your correctness." },
    { title: "SYSTEM OVERHEATING", body: "Rage levels rising. Fans spinning. The quiz is beginning to question its life choices." },
    { title: "FATAL EXCEPTION", body: "boyfriend_lore.exe has stopped responding. Cause: an absolutely criminal misunderstanding of your boyfriend." },
    { title: "JUDGEMENT PENDING", body: "The Council has reviewed your answer. The Council consists of one boyfriend. The Council says no." },
    { title: "WRONG NUMBER", body: "You selected an option. The option selected you back. Unfortunately, it has requested a restraining order." },
    { title: "ERROR 418", body: "I'm a teapot. Even I know that was the wrong answer. Please reassess your situation." },
    { title: "ARE YOU ACTUALLY SERIOUS?", body: "Because the quiz is serious. The answer is wrong. Your confidence, however, remains disturbingly intact." },
    { title: "REALITY CHECK FAILED", body: "Reality has been checked. Reality has rejected your answer. Reality would like you to try again." },
    { title: "ABSOLUTELY NOT", body: "The quiz reviewed your answer. It reviewed it again. It stared at the screen for several seconds. No." },
    { title: "YOU CANNOT BE SERIOUS", body: "That answer has been rejected by the quiz, the boyfriend, basic reasoning, and at least three people who weren't even involved." },
    { title: "READ THE ROOM", body: "Or the question. Either would have worked. Somehow, neither happened." },
    { title: "HONESTLY...", body: "We expected better. We expected worse. Somehow you found a secret third option: profoundly irritating." },
    { title: "LORE VIOLATION", body: "You have violated Section 7, Paragraph 3 of the Boyfriend Lore Constitution. Your defense has been denied." },
    { title: "EMOTIONAL DAMAGE", body: "That answer has caused 14% emotional damage to the quiz. The remaining 86% is being processed." },
    { title: "INCREDIBLE", body: "Not in a good way. But still. That takes talent." },
    { title: "THE BOYFRIEND HAS BEEN NOTIFIED", body: "He has received the results. He has seen your answer. He is currently deciding whether to laugh or be concerned." },
    { title: "WRONG.", body: "No elaborate explanation. No technical error. No conspiracy. Just wrong." },
    { title: "KNOWLEDGE GAP DETECTED", body: "A significant gap has been detected between you and the information you were supposed to know." },
    { title: "THIS IS GETTING CONCERNING", body: "One wrong answer is funny. Several wrong answers are statistically interesting. Please do not make this a dataset." },
    { title: "CRITICAL LORE FAILURE", body: "Your boyfriend's character file has been opened. Your answer has been highlighted in red." },
    { title: "NOPE.EXE", body: "The system has encountered an answer so incorrect that it has decided to simply say nope." }
  ],

  /* ---- flat correct pool (fallback) ---------------------------------- */
  correctScreens: [
    { title: "CORRECT", body: "Okay. You actually know this man. That is simultaneously impressive and slightly concerning." },
    { title: "LORE ACQUIRED", body: "Correct. Another piece of forbidden boyfriend knowledge has been unlocked." },
    { title: "SHE REMEMBERS", body: "He will be mildly alarmed to discover that you remembered this." },
    { title: "ACCURATE", body: "Somehow, against all odds, you have correctly predicted the behavior of your boyfriend." },
    { title: "CORRECT", body: "Do not become arrogant. You still have many opportunities to embarrass yourself." },
    { title: "THE SIMULATION IS CONFUSED", body: "The system expected chaos. Instead, you provided a correct answer. Unexpected." },
    { title: "NOTED", body: "Filed under: things you apparently know about your boyfriend." },
    { title: "CORRECT", body: "He might deny this. The evidence says otherwise." },
    { title: "BOYFRIEND LORE +100", body: "Knowledge increased. Ego increased. We recommend humility for the next question." },
    { title: "SUSPICIOUS", body: "That was correct. Too correct. We may need to investigate how you knew that." },
    { title: "IMPRESSIVE", body: "You remembered that. The boyfriend has lost one small piece of his mysteriousness." },
    { title: "THE COUNCIL APPROVES", body: "The Council has reviewed your answer. The Council consists of one boyfriend. The Council says you cooked." }
  ],

  /* ---- TYPED WRONG REACTIONS ----------------------------------------- */
  wrongReactions: {
    roast: [
      { title: "ROAST", body: "You had four options. Four. And somehow you found the wrong one." },
      { title: "ROAST", body: "Your confidence is admirable. Your accuracy is not." },
      { title: "ROAST", body: "That answer had absolutely no business being selected." },
      { title: "ROAST", body: "You didn't misunderstand the question. You misunderstood the assignment." },
      { title: "ROAST", body: "The boyfriend would like to speak to the manager of your decisions." }
    ],
    fakeError: [
      { title: "ERROR CODE: BF-001", body: "<pre>BOYFRIEND_MODEL DISAGREEMENT\n\nExpected:   ████████████\nReceived:   ????????????\nConfidence: 0.3%</pre>Attempting to recover... recovery unsuccessful. Try again." },
      { title: "ERROR CODE: BF-007", body: "<pre>ANSWER_REJECTED\n\nReason:     not even close\nTraceback: your brain, line 1\nStatus:     denied</pre>The quiz has logged this. It will remember." },
      { title: "TECHNICAL FAILURE", body: "<pre>parsing answer...\nparsing answer...\nparsing answer...\nFAILED</pre>The parser gave up. So did we, briefly." }
    ],
    boyfriendReaction: [
      { title: "BOYFRIEND REACTION DETECTED", body: "\"...bro.\"" },
      { title: "SINCERE HAS ENTERED THE CHAT", body: "Sincere: \"How.\"<br><br><i>Sincere has left the chat.</i>" },
      { title: "HE SAW THAT", body: "\"I'm not even mad. I'm just disappointed.\"<br><br><i>He is, in fact, mad.</i>" }
    ],
    dramatic: [
      { title: "THIS CHANGES EVERYTHING.", body: "We need to talk.<br><br>Actually never mind.<br><br>You were just wrong." },
      { title: "DRAMATIC PAUSE", body: "The music swells. The screen darkens. The moment passes.<br><br>You are still wrong." },
      { title: "A TRAGEDY IN ONE ANSWER", body: "Act I: you selected.<br>Act II: you were wrong.<br>Act III: we move on." }
    ],
    absurd: [
      { title: "MINISTRY NOTIFIED", body: "The Ministry of Boyfriend Affairs has been contacted. They have reviewed your answer. They are disappointed." },
      { title: "INTERGALACTIC REVIEW", body: "Your answer has been forwarded to the Intergalactic Council of Partners. Verdict: inconclusive, but rude." },
      { title: "LOCAL WILDLIFE ALERT", body: "A nearby cat has been informed of your answer. The cat judges you. The cat is correct." }
    ],
    conspiracy: [
      { title: "WAIT.", body: "Why did you choose that?<br><br>Did you know something we don't?<br><br>Is there a second boyfriend?<br><br><b>INVESTIGATION INITIATED.</b>" },
      { title: "PATTERN DETECTED", body: "Your wrong answers form a shape. We have circled it. We do not like the shape." },
      { title: "CLASSIFIED", body: "This wrong answer has been filed under 'things he will bring up later.'" }
    ],
    punishment: [
      { title: "PENALTY", body: "<pre>PENALTY\n━━━━━━━━━━━━\n-25 XP\n-10 DIGNITY\n-4 BOYFRIEND LORE\n+17 CONFUSION</pre>" },
      { title: "YOUR PUNISHMENT", body: "You have to look at the question again.<br><br>Horrifying, we know." },
      { title: "SENTENCE PASSED", body: "The court sentences you to one (1) more question. Do better." }
    ],
    fourthWall: [
      { title: "HELLO. YOU.", body: "You know you're being graded, right? The button is not decorative. The answer choices were literally sitting there." },
      { title: "FOURTH WALL BREACH", body: "We can see you. You can see us. Yet you still clicked the wrong one. Bold." },
      { title: "DIRECT ADDRESS", body: "Between you and me: that was a choice. You made it. We are discussing it." }
    ],
    fakeTechnical: [
      { title: "BUFFER OVERFLOW", body: "<pre>boyfriend_lore buffer overflow\nwriting wrong answer...\noverwriting self esteem...\n Done.</pre>" },
      { title: "TIMEOUT", body: "The boyfriend took too long to respond.<br><br>He eventually said: \"what.\"" },
      { title: "NULL POINTER", body: "NullPointerException at your_confidence. The boyfriend caught it. He is not amused." }
    ],
    short: [
      { title: "NAH.", body: "Just nah." },
      { title: "BRUH.", body: "Bruh." },
      { title: "HUH?", body: "Explain. You cannot." },
      { title: "YIKES.", body: "Yikes." }
    ]
  },

  /* ---- TYPED CORRECT REACTIONS --------------------------------------- */
  correctReactions: {
    praise: [
      { title: "CORRECT.", body: "Okay, you're actually good at this." },
      { title: "WELL DONE", body: "That was correct and we are begrudgingly impressed." },
      { title: "RESPECT.", body: "You knew that. The boyfriend feels seen. He is uncomfortable about it." }
    ],
    suspicious: [
      { title: "CORRECT.", body: "...<br><br>How did you know that?" },
      { title: "SUSPICIOUSLY ACCURATE", body: "That was the right answer. We are now watching you more closely." },
      { title: "TOO EASY FOR YOU", body: "You answered like you've heard him say this out loud. Concerning. (Good.)" }
    ],
    lore: [
      { title: "BOYFRIEND LORE UNLOCKED", body: "<pre>LORE UNLOCKED\n████████████░░ 87%\n\nNEW INFO:\nshe apparently pays attention.</pre>" },
      { title: "LORE +1", body: "A new entry has been added to the forbidden archive. He does not know it exists." },
      { title: "CLASSIFIED: KNOWN", body: "Filed under 'things she should not know but does.'" }
    ],
    boyfriendReaction: [
      { title: "SINCERE REACTION", body: "\"Okay, fair.\"<br><br><i>He reluctantly grants you +100 XP.</i>" },
      { title: "HE NODDED", body: "The boyfriend nodded. This is the closest he comes to a compliment." },
      { title: "APPROVAL", body: "\"...alright, that's fair.\"<br><br>He has added it to the list of things you're allowed to be right about." }
    ],
    streak: [
      { title: "THREE IN A ROW.", body: "Okayyyyy. The streak begins." },
      { title: "FIVE.", body: "Somebody studied the boyfriend." },
      { title: "TEN?!", body: "This is becoming uncomfortable." },
      { title: "PERFECT RUN", body: "You know this man better than he knows himself." }
    ],
    dramatic: [
      { title: "A RARITY OCCURS", body: "The quiz expected chaos. The quiz received correctness. The quiz is unsettled." },
      { title: "HISTORY IS MADE", body: "A correct answer has been logged. Future generations will study this moment." }
    ],
    wholesome: [
      { title: "HE WOULD SMILE", body: "If he saw this answer, he would smile. Then deny it. We saw the smile." },
      { title: "WARM FUZZY (REDACTED)", body: "A wholesome moment was detected and immediately classified as 'too soft for this quiz.'" }
    ],
    fourthWall: [
      { title: "WE FELT THAT", body: "You answered correctly and we, the quiz, felt a small pride. We will deny this later." },
      { title: "MUTUAL RESPECT", body: "You knew it. We knew you knew it. For once, everyone is correct." }
    ]
  },

  /* ---- timing reactions (based on answer speed) --------------------- */
  timing: {
    fast: [
      { title: "THAT WAS FAST.", body: "Either you know him extremely well...<br><br>...or you guessed with terrifying confidence." }
    ],
    slow: [
      { title: "STILL THINKING?", body: "The boyfriend has aged approximately six months waiting for this answer." },
      { title: "ARE YOU ALIVE?", body: "The quiz is still here. Take your time. Unfortunately." }
    ]
  },

  /* ---- wrong-streak reactions ---------------------------------------- */
  wrongStreak: [
    { title: "WRONG STREAK: 3", body: "Three. At this point we're no longer testing knowledge. We're testing determination." },
    { title: "WRONG STREAK: 5", body: "You could have stopped. You chose violence." },
    { title: "WRONG STREAK: 7", body: "Seven wrong in a row. The boyfriend has been notified. He is concerned for you. He is also concerned FOR you." }
  ],

  /* ---- mid-quiz plot twists ------------------------------------------ */
  plotTwists: {
    5:  { title: "PLOT TWIST // 01", body: "This quiz was written by your boyfriend at an unreasonable hour after saying, 'I'll just make one quick thing.' It was not one quick thing." },
    9:  { title: "PLOT TWIST // 02", body: "The boyfriend has allegedly been reading your answers. This is unconfirmed. He is also allegedly laughing. The investigation continues." },
    12: { title: "PLOT TWIST // 03", body: "The quiz has stopped pretending to be objective. It knows who you are. It knows who he is. It has opinions now." },
    14: { title: "FINAL PLOT TWIST", body: "You thought you were taking a quiz about your boyfriend. Unfortunately, the quiz has been profiling your relationship this entire time." }
  },

  /* ---- conspiracy gag (picked D too much) --------------------------- */
  conspiracy: [
    "WAIT.",
    "Hold on.",
    "Why have you selected D three times in a row?",
    "This is statistically suspicious.",
    "Is this strategy?",
    "Did you actually figure out the pattern?",
    "Or do you simply know your boyfriend disturbingly well?",
    "Because we're starting to think you know too much."
  ],

  /* ---- fake loading-screen status lines ----------------------------- */
  systemMessages: [
    "ANALYZING BOYFRIEND LORE...",
    "CROSS-REFERENCING RELATIONSHIP DATA...",
    "CONSULTING ABSOLUTELY NOBODY...",
    "QUESTIONABLE DECISION DETECTED.",
    "CALCULATING EMOTIONAL DAMAGE...",
    "VERIFYING BOYFRIEND BEHAVIOR...",
    "ERROR: BOYFRIEND TOO COMPLICATED.",
    "RETRYING...",
    "STILL TOO COMPLICATED.",
    "CONTINUING ANYWAY."
  ],

  /* ---- fake crash screens ------------------------------------------- */
  fakeErrors: [
    { title: "ERROR: BOYFRIEND TOO COMPLEX", body: "The available processing power is insufficient to fully explain this man." },
    { title: "MEMORY LEAK DETECTED", body: "The quiz has accidentally remembered every embarrassing thing you have ever done." },
    { title: "DATABASE CORRUPTED", body: "Fortunately, the important information survived. Unfortunately, the memes did too." },
    { title: "REALITY.EXE HAS STOPPED RESPONDING", body: "Please wait while reality attempts to restart." },
    { title: "RELATIONSHIP SERVER UNSTABLE", body: "Too much boyfriend lore detected in a single session." }
  ],

  /* ---- pre-boss warnings -------------------------------------------- */
  finalWarnings: [
    "THE QUIZ IS NO LONGER RESPONSIBLE FOR ITS ACTIONS.",
    "YOU HAVE REACHED THE DANGEROUS PART.",
    "THERE IS NO TURNING BACK.",
    "BOYFRIEND LORE LEVEL: CRITICAL.",
    "FINAL QUESTION APPROACHING.",
    "GOOD LUCK. YOU'RE GOING TO NEED IT."
  ],

  /* ---- end-screen "what the boyfriend thinks" by tier --------------- */
  boyfriendResponses: {
    low:    "He has reviewed your results. His response: \"We need to talk.\"",
    medium: "He has reviewed your results. His response: \"Okay, I'll accept this.\"",
    high:   "He has reviewed your results. His response: \"How the hell did you know that?\"",
    perfect:"He has reviewed your results. His response: \"I don't like how well you know me.\""
  },

  /* ---- escalation lines (the more she gets wrong, the unhingeder) --- */
  escalation: [
    "This is the part where the quiz stops being polite.",
    "You have officially used up the nice version of this quiz.",
    "The boyfriend has been notified. He is concerned. For you.",
    "We are taking notes. The notes are about your bad decisions.",
    "At this point the questions are personal. You made them personal.",
    "The lore is fine. You are the problem. (affectionate.) (mostly.)",
    "Keep going. The quiz believes in you. The quiz is worried.",
    "This is no longer a quiz. This is an intervention."
  ],

  /* ---- random chaos events (the quiz messes with her unprompted) ----- */
  chaosEvents: [
    { title: "SYSTEM NOTICE", body: "Your boyfriend has been notified of this answer.<br><br>He has no idea why. Neither do we.", btn: "DISMISS" },
    { title: "NEW MESSAGE", body: "boyfriend is typing...<br><br>\"why are you taking a quiz about me at 2am\"", btn: "DISMISS" },
    { title: "UNEXPECTED UPDATE", body: "Boyfriend Lore v3.1 is installing.<br><br>Please do not close the tab. (you can't.)", btn: "DISMISS" },
    { title: "REMINDER", body: "He knows you're doing this.<br><br>He has always known.", btn: "DISMISS" },
    { title: "DOWNLOAD COMPLETE", body: "0 files downloaded.<br><br>It was a trick. It is always a trick.", btn: "DISMISS" },
    { title: "YOUR PHONE VIBRATED", body: "(it didn't.)<br><br>But the boyfriend felt it spiritually.", btn: "DISMISS" },
    { title: "A CAT WALKED ACROSS THE KEYBOARD", body: "The answer may have changed.<br><br>(it didn't. the cat is just judging you.)", btn: "DISMISS" },
    { title: "CONNECTION UNSTABLE", body: "Blame the boyfriend.<br><br>He is the connection. He is unstable.", btn: "DISMISS" },
    { title: "FORTUNE", body: "You will get this question wrong.<br><br>Or right. We don't know either. We're a webpage.", btn: "DISMISS" },
    { title: "POPUP BLOCKED", body: "A popup tried to appear offering free boyfriend lore.<br><br>We declined it on your behalf. You're welcome.", btn: "DISMISS" },
    { title: "ACHIEVEMENT UNLOCKED", body: "\"SURVIVED ANOTHER SECOND OF THIS QUIZ\"<br><br>It is not a real achievement. Or is it.", btn: "DISMISS" },
    { title: "CALIBRATING SUSPICION", body: "Suspicion levels: rising.<br><br>The quiz is calibrating how much it trusts your answers. Verdict: not enough.", btn: "DISMISS" }
  ],

  /* ---- fake push notifications from the boyfriend (toast style) ------ */
  pushEvents: [
    "boyfriend: \"why is there a quiz about me\"",
    "boyfriend: \"i saw that answer. concerning.\"",
    "boyfriend: \"2am again?\"",
    "boyfriend: \"you're overthinking question 9.\"",
    "boyfriend: \"stop refreshing the page.\"",
    "boyfriend: \"who taught you about the 47 projects\"",
    "boyfriend: \"the cat agrees with me, by the way.\""
  ],

  /* ---- secret achievements ------------------------------------------ */
  achievements: [
    { id: "cat_detective", name: "CAT DETECTIVE",   desc: "Got the cat question correct." },
    { id: "lore_master",   name: "LORE MASTER",     desc: "5 correct answers in a row." },
    { id: "chaos_agent",   name: "CHAOS AGENT",     desc: "3 wrong answers in a row." },
    { id: "rage_machine",  name: "RAGE MACHINE",    desc: "Reached 100 rage." },
    { id: "survived",      name: "SURVIVED",       desc: "Finished all 15 questions." },
    { id: "perfect",       name: "PERFECT KNOWLEDGE", desc: "15/15." },
    { id: "no_hint",       name: "SHE ACTUALLY LISTENS", desc: "Finished without using a hint." }
  ]
};
