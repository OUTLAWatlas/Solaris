/* ============================================================
   365 DAYS OF US: all content lives here.
   Photos go in assets/photos/ (file names below). Song: assets/audio/song.mp3
   Paragraph formats:  "text"  |  ["big","text"]  |  ["pull","text"]  |  **bold** works inline
   A missing photo shows a placeholder naming the file it wants.
   ============================================================ */
export default {
  herName: "Ishika",
  startDate: "2025-11-12T00:05:00+05:30",     // she said yes (live counter)
  unlockAt:  "2026-11-12T00:00:00+05:30",     // page stays locked until this moment. Add ?preview to the URL to bypass.
  passcode:  "",                              // optional, e.g. "koala". Light deterrent only, not real security.
  song: "assets/audio/song.mp3",
  bpm: 72,                                    // used for the beat-pulse on iPhone (set to your song's tempo)

  intro: {
    appName: "RenderFlow 2.0",
    tagline: "Now it actually renders. 365 days, one scene at a time.",
    renderLines: [
      "Importing 365 days of footage…",
      "Colour-grading the walks back from college…",
      "Syncing the banter track…",
      "Removing 0 awkward moments (kept all of them)…",
      "Almost done…"
    ],
    doneLine: "Render complete.",
    lockedLine: "Your render is scheduled. It will be ready in",
    button: "Press play"
  },

  /* ============================================================
     THE REVIEW QUIZ (opens after she taps the renewal button)
     Edit freely. kinds: rate (0-10 slider) | choice | renew | text
     {n} in a line is replaced by her rating. low = shown if rating <= 5, high = if >= 8.
     ============================================================ */
  quiz: {
    email: "patil.krishna5410@gmail.com",   // where her answers are sent
    whatsapp: "",                            // optional fallback, digits with country code e.g. "919XXXXXXXXX"; empty = she picks the chat
    title: "Boyfriend Performance Review",
    tag: "Annual review · Confidential",
    intro: "Your subscription has renewed, which means it's time for the annual review. Please answer honestly. (Your answers go straight to HR. HR is me.)",
    startButton: "Begin review",
    submitButton: "Submit review",
    loading: ["Counting eye-rolls…", "Converting ratings into guilt…", "Forwarding to HR (me)…", "Preparing your verdict…"],
    questions: [
      { id: "rage", kind: "rate", q: "Rate my ragebaiting skills.", lo: "amateur", hi: "professional menace",
        low: "{n}/10 for ragebaiting?? 😭 Do you know how much dedication that takes? I've trained for a whole year.",
        high: "{n}/10 for ragebaiting. Finally, someone recognises talent 🥸" },
      { id: "photo", kind: "rate", q: "Rate my photography skills.", lo: "blurry crimes", hi: "National Geographic",
        low: "haww.. you don't like my photos 😭😭🤧🥲🥺 {n}/10?? I tried so many angles while you were busy being gorgeous.",
        high: "{n}/10 for my photos 🥹 the artist is finally understood." },
      { id: "disguise", kind: "rate", q: "Rate my 🥸 disguise.", lo: "everyone knows", hi: "undercover legend",
        low: "{n}/10 for the 🥸?? The moustache has feelings, you know.",
        high: "{n}/10 for the disguise. Nobody suspects a thing 🕵️" },
      { id: "style", kind: "rate", q: "Rate my fashion sense.", lo: "whatever was clean", hi: "runway ready",
        low: "{n}/10 for my fashion sense?? 🥲 I color-coordinated that outfit for you.",
        high: "{n}/10 for fashion. Finally, a stylist who understands me 😎" },
      { id: "hugs", kind: "rate", q: "Rate my hugs.", lo: "wet noodle", hi: "premium grade",
        low: "{n}/10 for hugs?? 🥺 I'm filing for a recount and one compensation hug.",
        high: "{n}/10 for hugs. Unlimited supply, as promised 🫂" },
      { id: "sulk", kind: "rate", q: "Rate my sulking skills (when I'm \"not angry\").", lo: "obviously fine", hi: "Oscar-worthy",
        low: "{n}/10 for sulking?? I put real effort into that silence 😤",
        high: "{n}/10 for sulking. I was not angry. (I was a little angry.)" },
      { id: "five", kind: "rate", q: "How accurate is my \"just 5 minutes\"?", lo: "always 2 hours", hi: "to the second",
        low: "{n}/10 on \"just 5 minutes\"… fair. I regret nothing ⏳",
        high: "{n}/10 accuracy?? Liar. But thank you 🥲" },
      { id: "jokes", kind: "rate", q: "Rate my jokes.", lo: "dead silence", hi: "stand-up special",
        low: "{n}/10 for my jokes 😭 I saw you laugh once. Once is enough for the record.",
        high: "{n}/10 for jokes. The comedy special is being scheduled 🎤" },
      { id: "renderflow", kind: "rate", q: "Rate RenderFlow 1.0, the confession website. (Be honest. It's the reason you're here.)", lo: "buggy mess", hi: "life-changing",
        low: "{n}/10 for RenderFlow 1.0?? That website literally got me a girlfriend. Respect the product 😤",
        high: "{n}/10 for RenderFlow 1.0. Best deploy of my life 🚀" },
      { id: "eyeroll", kind: "choice", q: "Eye-rolls I deserve per day:",
        options: ["47 (current rate)", "100, I'm just warming up", "Uncountable"],
        lines: ["47 eye-rolls a day. The average holds ✅", "100?! You're only warming up and I'm already scared 🙄", "Uncountable. Noted. I'm requesting medical insurance 🥲"] },
      { id: "renew", kind: "renew", q: "Would you like to renew your subscription?", yes: "Renew ❤️", no: "Cancel",
        teases: ["Nope 🥸", "Too slow!", "Cancel is on a break", "Not today", "Nice try, koala 🐨"],
        caught: "Error 404: the cancellation department is permanently closed 🥲",
        answer: "Renewed (cancel button could not be caught)",
        line: "Renewal confirmed ✅ No refunds, as per the terms and conditions." },
      { id: "overall", kind: "rate", q: "Overall boyfriend rating.", lo: "return to seller", hi: "keeper",
        low: "{n}/10 overall?? 💔 I'm going to need an appeal form and a hug.",
        high: "{n}/10 overall. Keeper status: locked in 🔒" },
      { id: "complaint", kind: "text", q: "File one complaint against me. (It will be ignored.)", placeholder: "Type your complaint here…",
        line: "Complaint filed: “{t}”. Status: ignored, framed, and hung on the wall 🖼️" },
      { id: "more", kind: "text", q: "One thing I should do more of.", placeholder: "Be specific…",
        line: "Noted: “{t}”. Adding it to my calendar immediately 📅" }
    ],
    verdicts: [
      { max: 4.5, title: "Verdict: devastating 💔", sub: "An appeal has been filed. Hugs may reverse the decision." },
      { max: 7.5, title: "Verdict: acceptable… for now 🥸", sub: "Probation extended. Performance will be monitored (with snacks)." },
      { max: 11, title: "Verdict: certified keeper 👑", sub: "Subscription locked in for life. Terms remain unreasonable." }
    ],
    noGuilt: "Suspiciously good scores 🥸 What do you want?",
    sent: "Review delivered to Krishna ✅",
    sentSub: "He is reading it right now. Possibly crying.",
    failed: "Couldn't reach HR automatically 🥺",
    failedBtn: "Send it to Krishna on WhatsApp",
    back: "Back to the story"
  },

  sections: [
    /* ---------------- OPENING ---------------- */
    {
      type: "hero",
      title: "365 Days of Us ❤️",
      sub: "A story I never knew I was going to write.",
      epigraph: "Some stories begin with a meeting. Ours began long before either of us had the courage to admit what was happening.",
      bg: ""
    },

    /* ---------------- PROLOGUE ---------------- */
    {
      type: "editorial", mood: "night",
      kicker: "Prologue", title: "Before you, there was you",
      paras: [
        "It's funny how someone can slowly become such an important part of your life without you even realising when it happened.",
        "We were both part of the same college committee. We had our own lives, our own responsibilities, events to organise, deadlines to meet and approximately a million other things to worry about.",
        "And then there was you.",
        "My first impression of you? Playful. Easygoing. Rude. Full of attitude. Adamant.",
        "Basically, a walking combination of qualities that should probably have been a warning sign.",
        "You had this way of being yourself, unapologetically. You could be sweet one moment and ridiculously stubborn the next. And somehow, that combination made you interesting.",
        "What I didn't know back then was that the girl I was still figuring out would eventually become the person whose smile I'd look forward to seeing, whose rants I'd listen to, and whose presence I'd miss more than I'd probably admit.",
        ["big", "Funny how life works."]
      ]
    },

    /* ---------------- CHAPTER 01: photo + text ---------------- */
    {
      type: "chapter", mood: "dusk",
      kicker: "Chapter 01", title: "The Almost-Us",
      photos: [{ src: "assets/photos/c1-01.jpg", cap: "same committee, same hoodies" }],
      paras: [
        "There are moments you don't realise are important until you look back at them.",
        "One such moment was that night at my senior's house.",
        "We were there for work, and I'd managed to mess something up a little. I'd said something while you were on a call with your dad, and things weren't exactly ideal.",
        "You were already quite scared, and despite everything, you still came and hugged me.",
        "Not because everything was suddenly okay. Not because I'd done something right. But because you needed to calm yourself down, and somehow, I was the person you chose to lean on.",
        "I remember how that made me feel.",
        "There was something incredibly special about knowing that even when you were scared, you found a little comfort in being around me.",
        "We weren't dating then. We hadn't put a label on anything. We were just two people who were slowly becoming something to each other.",
        "But I think a part of me remembers that hug differently now.",
        ["pull", "Because sometimes, the most meaningful moments in a relationship happen before the relationship even begins."]
      ]
    },

    /* ---------------- CHAPTER 02: interactive timeline ---------------- */
    {
      type: "timeline", mood: "night",
      kicker: "Chapter 02", title: "11:55 PM. The Project.",
      intro: [
        ["big", "12 November 2025."],
        "Three days after an event we'd just finished organising on 9 November. An event that also happened to be my birthday.",
        "We were both in our respective hostel rooms. It was almost midnight."
      ],
      startLabel: "Rewind to that night",
      phone: { contact: "Koala 🐨", sent: "Want to check out a project I made?" },   // replace with your exact words
      phones: ["sent", "sent", "sent", "sent", "read", "ring", "call", "call"],     // phone screen for each step
      steps: [
        { time: "11:55 PM", text: "I sent you a message asking whether you'd like to check out a project I'd made.", big: true },
        { time: "The project", text: "Now, technically, it was a project. A website. But let's not pretend this was some ordinary development assignment. There was no client, no requirement document, no sprint planning, no deployment pipeline." },
        { time: "The brief", text: "There was just one person I wanted to confess to. And I'd decided to do it through a website." },
        { time: "The stack", text: "Because apparently, writing a normal confession wasn't enough. I had to involve my engineering skills too." },
        { time: "", text: "You opened it. You read it." },
        { time: "", text: "And then you called me.", big: true },
        { time: "", text: "You said yes. ❤️", big: true, fx: true },
        { time: "", text: "And we both cried a little." }
      ],
      after: [
        "Not because anything was wrong, but because there was so much that had been left unsaid for so long. We ended up blaming each other for waiting an entire year.",
        ["big", "A WHOLE YEAR."],
        "Imagine spending that much time liking someone, waiting, wondering, overthinking, and then finding out that the feeling wasn't one-sided after all.",
        "That night, something changed.",
        "The girl who had once been just another person in my college life became my girlfriend.",
        "And a project I'd made at 11:55 PM became one of the most important things I've ever built.",
        "No exaggeration.",
        ["pull", "If someone asks me which of my projects has had the highest emotional impact, I think we both know the answer."]
      ]
    },

    /* ---------------- CHAPTER 03: photo gallery (Blue Tokai) ---------------- */
    {
      type: "gallery", mood: "ember",
      kicker: "Chapter 03", title: "Our First Date. Blue Tokai.",
      before: [
        "Every relationship has a first date.",
        "Ours was at Blue Tokai.",
        "And honestly, the food and drinks could have been better. Let's just establish that right now.",
        "But I don't think either of us went there for a Michelin-star experience."
      ],
      photos: [],
      after: [
        "It was our first proper date. Just us, finally getting to spend time together in a way that was different from everything we'd known before.",
        "There is something quite special about doing something for the first time with someone you really like.",
        "The nervousness, the conversations, the little moments, the feeling of finally being able to call someone yours.",
        "I don't remember that date because everything was perfect.",
        ["big", "I remember it because it was ours."],
        "And if I could go back and experience it again, I'd probably still choose the same place.",
        "Maybe order something different, though."
      ]
    },

    /* ---------------- CHAPTER 04: memory gallery (nightout + Garba) ---------------- */
    {
      type: "carousel", mood: "rose",
      kicker: "Chapter 04", title: "The Nights That Became Memories",
      intro: ["Some of my favourite memories with you aren't necessarily the most perfect ones."],
      blocks: [
        {
          title: "The nightout",
          paras: [
            "Take our nightout, for example.",
            "I was angry with you about something. We weren't exactly having the most romantic evening, and things could have gone quite differently.",
            "But we talked. We sorted things out on the scooty.",
            "And by the time morning arrived, we were back to being all lovey-dovey.",
            "It's funny how quickly the atmosphere can change when two people actually make an effort to understand each other.",
            "I think that night taught me something about us.",
            ["pull", "We don't need every moment to be perfect. We just need to keep finding our way back to each other."]
          ],
          photos: []
        },
        {
          title: "Garba night",
          paras: [
            "And then there was the Garba night.",
            ["big", "You looked like an actual DEVI."],
            "I'm not even exaggerating.",
            "There were a lot of your friends around, so naturally, I didn't get to have you entirely to myself throughout the night. But for a good part of it, you were with me, and that was enough to make the night special.",
            "Although I do have one major complaint against myself.",
            "I did not click enough badass pictures of you.",
            "In my defence, you were looking so ridiculously beautiful that I kept getting distracted admiring you instead of concentrating on the camera.",
            "And secondly, let's be honest. Had those pictures turned out exceptionally well, you'd have probably posted them.",
            "And I am not particularly interested in the rest of the world getting to admire that ethereal roop of my devi.",
            "A little selfish? Perhaps.",
            "But I stand by it."
          ],
          photos: [
            { src: "assets/photos/c4-garba-01.jpg", cap: "my devi" },
            { src: "assets/photos/c4-garba-02.jpg", cap: "" },
            { src: "assets/photos/c4-garba-03.jpg", cap: "" },
            { src: "assets/photos/c4-garba-04.jpg", cap: "" }
          ]
        }
      ]
    },

    /* ---------------- CHAPTER 05: split-screen (distance) ---------------- */
    {
      type: "split",
      kicker: "Chapter 05", title: "The Distance Between Us",
      left: {
        label: "The distance",
        paras: [
          "If there's one thing I wish were different about our relationship, it's the distance.",
          "Not necessarily the physical distance itself, but everything that comes with it.",
          "Neither of our parents really knows about us. And that makes things considerably harder whenever we're back at our respective homes.",
          "Texting becomes difficult. Calling becomes difficult. Finding time for each other becomes difficult.",
          "Sometimes, even the simplest things that other couples probably take for granted require planning, patience and a little bit of luck for us.",
          "But the toughest stretch was when I went to Africa to meet my parents.",
          "I got caught one day.",
          "And let's just say things became pretty hectic after that.",
          "The period during and after that wasn't easy on either of us. Meeting became difficult. Texting became difficult. Going on dates felt like an achievement in itself.",
          "There were times when all we wanted was to spend a little time together, and circumstances simply wouldn't allow it.",
          "I won't romanticise that phase. It was frustrating, exhausting and sometimes genuinely upsetting."
        ]
      },
      right: {
        label: "The little windows",
        paras: [
          "But I think it made me realise how much the seemingly ordinary things matter.",
          ["big", "A conversation without worrying about who's around."],
          ["big", "A date without constantly checking the time."],
          ["big", "A hug without having to think about when the next one will happen."],
          "I hope we eventually get to a point where loving each other doesn't require so much coordination and secrecy.",
          "Until then, we'll keep finding our little windows of time.",
          ["pull", "Because even when the circumstances aren't particularly kind to us, you're still someone I want in my life."]
        ]
      }
    },

    /* ---------------- CHAPTER 06: polaroid gallery (little things) ---------------- */
    {
      type: "polaroids", mood: "dusk",
      kicker: "Chapter 06", title: "The Little Things That Are Everything",
      before: [
        "If someone asked me what I love most about you, I genuinely wouldn't know where to begin.",
        ["big", "It's your smile."],
        ["big", "Your laugh."],
        "The way you look at me when you're ranting about something.",
        "And I swear, that particular expression deserves its own photograph.",
        "It's the way you get adamant about the smallest, most insignificant things.",
        "Not the things where that stubbornness is actually bad for you. I'm talking about the cute, completely unnecessary insistence on things that really don't matter.",
        "It's the pure happiness on your face when your favourite food is placed in front of you.",
        "There's something about watching someone be genuinely happy over something so simple that makes you happy too.",
        "And then, of course, there's your nickname.",
        ["big", "KOALA. 🐨"],
        "Because you're adorable, and because apparently your primary life objective is to get as much beauty sleep as humanly possible.",
        "Meanwhile, you have decided that I look like this:",
        ["emoji", "🥸"],
        "I don't know what I did to deserve this level of honour.",
        "But I'll let it slide.",
        "I suppose every koala needs someone who looks like a suspiciously disguised gentleman."
      ],
      photos: [
        { src: "assets/photos/c6-01.jpg", cap: "full of attitude" },
        { src: "assets/photos/c6-02.jpg", cap: "" },
        { src: "assets/photos/c6-03.jpg", cap: "that smile" },
        { src: "assets/photos/c6-04.jpg", cap: "" }
      ],
      hint: "Tap a polaroid.",
      after: [
        ["pull", "And somewhere between all these little things, you've become my favourite collection of ordinary moments."]
      ]
    },

    /* ---------------- CHAPTER 07: gift reveal (jerseys) ---------------- */
    {
      type: "gift", mood: "ember",
      kicker: "Chapter 07", title: "A Very Special Delivery",
      before: [
        "This one deserves a separate chapter.",
        "Our recent date.",
        "The one where you decided to combine my Boyfriend's Day gift and my birthday gift into one delivery.",
        "And what did you get me?"
      ],
      boxLabel: "Tap to unwrap",
      reveal: "TWO JERSEYS.",
      photos: [],
      after: [
        ["big", "Of my FAVOURITE TEAM."],
        "You have absolutely no idea how long I'd wanted those.",
        "I was genuinely on the verge of crying.",
        "Not even because they were jerseys, although that alone was enough to make me ridiculously happy.",
        "It was the fact that you remembered something I wanted so badly and actually went ahead and got it for me.",
        "I think that's one of the things I appreciate most about you.",
        ["pull", "You make me feel seen in the smallest ways."],
        "You remember the things I like. You notice the things that make me happy. And sometimes, you turn something I've been wanting for ages into a surprise I never saw coming.",
        "I don't think I'll ever be able to explain how happy that made me.",
        "So, thank you.",
        "For the jerseys, obviously.",
        "But more importantly, for paying attention to the little things that make me, me."
      ]
    },

    /* ---------------- CHAPTER 08: the letter ---------------- */
    {
      type: "letter", mood: "rose",
      kicker: "Chapter 08", title: "One Year of You and Me",
      openLabel: "Tap to open",
      paras: [
        ["big", "365 days."],
        "That's a lot of time.",
        "A lot of conversations, memories, laughter, arguments, apologies, hugs, dates, missed calls, stolen moments and things that probably wouldn't make sense to anyone except us.",
        "We've had our good days and our difficult ones.",
        "We've seen different versions of each other. We've learnt things about each other that we couldn't possibly have known at the beginning.",
        "And I know we still have a lot to learn.",
        "I don't think being in a relationship means knowing everything about the other person. I think it means being willing to keep discovering them.",
        "I want to keep discovering you.",
        "I want to know about the things that excite you, the things that scare you, the things you dream about and even the most random thoughts that cross your mind at 2 AM.",
        "I want to celebrate your achievements, be there when things don't go your way, listen to your rants, annoy you occasionally and give you approximately 47 reasons to roll your eyes at me every day.",
        "I want more first dates, more nightouts, more Garba nights, more photographs, more hugs and more memories that we'll look back at years from now.",
        "And most importantly, I want us to keep growing.",
        "Not just as a couple, but as two individuals who genuinely want the best for each other."
      ]
    },

    /* ---------------- EPILOGUE: closing screen ---------------- */
    {
      type: "finale", mood: "night",
      kicker: "Epilogue", title: "The Next 365",
      paras: [
        "I don't know exactly what the next year holds for us.",
        "I don't know how many dates we'll go on, how many arguments we'll have, how many times we'll end up laughing at something completely stupid, or how many new memories we'll make.",
        "I don't have a perfectly written plan for everything.",
        "But then again, I didn't have one when I sent you that message at 11:55 PM either.",
        "And look where that got us.",
        "I hope we get to explore more places together. Try new food, travel, take ridiculous pictures, experience things we've never experienced before and make the kind of memories that stay with us forever.",
        "I hope we get more time together. More freedom. More ordinary days where being together doesn't have to be an elaborate plan.",
        "I hope you never stop being that playful, easygoing, slightly rude, attitude-driven, adamant girl I first got to know.",
        "And I hope I never stop looking at you with the same admiration I had that Garba night.",
        "There's a lot I could say about this year. But if there's one thing I want you to take away from all of this, it's this:",
        ["big", "I'm genuinely glad it was you."],
        "Out of all the possibilities, all the uncertainties, all the waiting and all the what-ifs, it was you who ended up on the other side of that confession.",
        "And if I had to go back to that night, knowing everything that would follow, I'd still send that message.",
        "At 11:55 PM.",
        "I'd still send you that project.",
        "I'd still wait for your call.",
        ["big", "And I'd still choose you."],
        "Happy first anniversary, my Koala. ❤️",
        "Here's to 365 days down, and hopefully a lifetime of stories left to write."
      ],
      ps: {
        appName: "RenderFlow 2.0",
        heading: "Subscription notice",
        text: "Your one-year free trial has expired. Your subscription has automatically renewed. No cancellations, no refunds, unlimited boyfriend nonsense. Terms and conditions are entirely unreasonable.",
        button: "Accept terms (no choice)",
        after: "Love,\nYour 🥸"
      }
    }
  ]
};
