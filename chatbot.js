/* ============================================================
   SSCRS — help assistant (placeholder implementation)
   المساعد — نسخة مبدئية

   This is a self-contained, offline stand-in for a real assistant.
   It matches a question against a small keyword-scored knowledge
   base built from the content already on this page. There is no
   network call and no model behind it.

   REPLACING IT LATER
   ------------------
   Everything below the UI is reached through one function. To plug
   in a real backend or model, call:

       SSCRS_CHAT.setResponder(async function (text, lang) {
         const r = await fetch("/api/chat", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ message: text, lang: lang })
         });
         return (await r.json()).reply;          // a string
       });

   The responder may return a string or a promise for one. The UI,
   typing indicator, language handling and safety notice all keep
   working unchanged.

   IMPORTANT: never put an API key in this file. It ships to every
   visitor. Calls to a paid model must go through a small server
   endpoint that holds the key.
   ============================================================ */

(function () {
  "use strict";

  /* --- Knowledge base --------------------------------------- */
  var KB = [
    {
      id: "membership",
      k: { en: ["member", "join", "membership", "apply", "subscribe", "fee", "category"],
           ar: ["عضوية", "انضمام", "انضم", "اشتراك", "تقديم", "رسوم", "فئة", "عضو"] },
      a: {
        en: "There are four membership categories: Active (for physicians), Associate (for trainees), Supporting (for companies) and Honorary (by board nomination). Each includes access to the annual forum, educational resources and the member network. You can see the full comparison in the Membership section, or write to info@sscrs.org to apply.",
        ar: "تضم الجمعية أربع فئات للعضوية: عضو عامل (للأطباء)، وعضو منتسب (للمتدربين)، وعضو داعم (للشركات)، وعضو فخري (بترشيح من مجلس الإدارة). وتشمل كل فئة حضور الملتقى السنوي والموارد التعليمية وشبكة الأعضاء. يمكنك مراجعة قسم العضوية، أو المراسلة على info@sscrs.org للتقديم."
      }
    },
    {
      id: "forum",
      k: { en: ["annual forum", "forum", "conference", "event", "meeting",
                "register", "registration", "2026"],
           ar: ["الملتقى السنوي", "ملتقى", "مؤتمر", "فعالية", "تسجيل", "٢٠٢٦"] },
      a: {
        en: "The SSCRS Annual Forum 2026 takes place in Riyadh on 15–17 April 2026, and registration is open. It features keynote lectures, live surgery demonstrations and professional workshops. Details are in the News section.",
        ar: "يُقام الملتقى السنوي للجمعية ٢٠٢٦ في الرياض خلال ١٥–١٧ أبريل ٢٠٢٦، والتسجيل مفتوح الآن. ويتضمن محاضرات رئيسية وعروضًا جراحية مباشرة وورش عمل مهنية. التفاصيل في قسم الأخبار."
      }
    },
    {
      id: "about",
      /* Deliberately no bare "society" / "الجمعية" here: those words
         appear in nearly every question and would outscore the specific
         keyword of whichever intent was actually meant. */
      k: { en: ["about the society", "who we are", "what is sscrs", "tell me about",
                "founded", "established", "history", "background", "sscrs"],
           ar: ["عن الجمعية", "من نحن", "ما هي الجمعية", "نبذة", "تأسست",
                "تاريخ", "نشأة", "تعريف"] },
      a: {
        en: "The Saudi Society of Colon & Rectal Surgery was established in 2009 (1430H) by decree of the Saudi Commission for Health Specialties. It organises scientific work, strengthens professional fellowship, and raises public awareness of colorectal health across the Kingdom.",
        ar: "تأسست الجمعية السعودية لجراحة القولون والمستقيم عام ٢٠٠٩م (١٤٣٠هـ) بقرار من الهيئة السعودية للتخصصات الصحية. وتعنى بتنظيم العمل العلمي، وتعزيز الزمالة المهنية، ورفع الوعي المجتمعي بصحة القولون والمستقيم في أنحاء المملكة."
      }
    },
    {
      id: "vision",
      k: { en: ["vision", "mission", "goal", "objective", "aim", "strategy"],
           ar: ["رؤية", "رؤيت", "رسالة", "رسالت", "هدف",
                "أهداف", "استراتيجية"] },
      a: {
        en: "Our vision is to be the trusted national reference for colorectal surgical excellence in Saudi Arabia. Our mission is to support surgical education, promote public awareness, facilitate research exchange and foster professional collaboration. The Vision section lists our five commitments in full.",
        ar: "رؤيتنا أن نكون المرجع الوطني الموثوق للتميز في جراحة القولون والمستقيم في المملكة. ورسالتنا دعم التعليم الجراحي، وتعزيز الوعي المجتمعي، وتيسير تبادل البحوث، وتنمية التعاون المهني. وتجد التزاماتنا الخمسة كاملة في قسم الرؤية."
      }
    },
    {
      id: "board",
      k: { en: ["board", "leadership", "president", "chair", "committee", "who runs"],
           ar: ["مجلس", "إدارة", "رئيس", "قيادة", "أعضاء المجلس"] },
      a: {
        en: "The society is guided by a board of distinguished surgeons and healthcare leaders from across the Kingdom, including a President, Vice President, Secretary General and Treasurer. You can see them in the Board section.",
        ar: "تقود الجمعية نخبة من الجراحين وقادة القطاع الصحي من مختلف مناطق المملكة، ويضم المجلس رئيسًا ونائبًا للرئيس وأمينًا عامًا ومشرفًا ماليًا. يمكنك الاطلاع عليهم في قسم مجلس الإدارة."
      }
    },
    {
      id: "contact",
      k: { en: ["contact", "email", "phone", "reach", "address", "locat"],
           ar: ["تواصل", "اتصال", "بريد", "هاتف", "عنوان", "مقر"] },
      a: {
        en: "You can reach the society at info@sscrs.org. We are based in Riyadh, Kingdom of Saudi Arabia.",
        ar: "يمكنك التواصل مع الجمعية عبر info@sscrs.org. ومقرنا في الرياض، المملكة العربية السعودية."
      }
    },
    {
      id: "screening",
      k: { en: ["screening", "guideline", "guidelines", "colonoscopy", "prevention", "early detection"],
           ar: ["فحص", "الفحص المبكر", "أدلة", "إرشادات", "منظار", "وقاية"] },
      a: {
        en: "SSCRS has published updated national colorectal cancer screening guidelines in partnership with the Saudi Ministry of Health — see the News section. For guidance about your own screening, please speak with your physician.",
        ar: "أصدرت الجمعية أدلة وطنية محدثة للفحص المبكر لسرطان القولون والمستقيم بالشراكة مع وزارة الصحة — انظر قسم الأخبار. أما بشأن الفحص الخاص بك، فيرجى مراجعة طبيبك."
      }
    },
    {
      id: "training",
      k: { en: ["training", "fellowship", "cme", "workshop", "course", "education", "trainee"],
           ar: ["تدريب", "زمالة", "ورشة", "دورة", "تعليم", "متدرب"] },
      a: {
        en: "The society runs continuing medical education, workshops and an advanced laparoscopic fellowship programme; applications for the 2026 cycle are open. Associate membership is designed for trainees and includes mentorship and training resources.",
        ar: "تقدم الجمعية برامج التعليم الطبي المستمر وورش العمل وبرنامج زمالة الجراحة بالمنظار المتقدمة، وقد فُتح باب التقديم لدورة ٢٠٢٦. وفئة العضو المنتسب مخصصة للمتدربين وتشمل الإرشاد المهني والموارد التدريبية."
      }
    },
    {
      id: "partners",
      k: { en: ["partner", "sponsor", "sponsorship", "collaborate", "company", "exhibit"],
           ar: ["شريك", "شركاء", "رعاية", "رعاي", "ترعي", "يرعي", "راعي",
                "تعاون", "شركة", "شرك", "عرض"] },
      a: {
        en: "We work with the Ministry of Health, the Saudi Commission for Health Specialties and King Faisal Specialist Hospital & Research Centre, among others. Companies can join as Supporting Members, which includes forum exhibition space and sponsorship access — write to info@sscrs.org.",
        ar: "نتعاون مع وزارة الصحة والهيئة السعودية للتخصصات الصحية ومستشفى الملك فيصل التخصصي ومركز الأبحاث وغيرها. ويمكن للشركات الانضمام كأعضاء داعمين، بما يشمل مساحة عرض في الملتقى وفرص الرعاية — راسلنا على info@sscrs.org."
      }
    },
    {
      id: "gallery",
      k: { en: ["photo", "photos", "gallery", "picture", "image", "media"],
           ar: ["صور", "صورة", "معرض", "وسائط"] },
      a: {
        en: "The Gallery section has photographs from our annual forum, training workshops and public awareness work. You can filter by category and open any image full screen.",
        ar: "يضم قسم المعرض صورًا من الملتقى السنوي وورش التدريب وأعمال التوعية المجتمعية. ويمكنك التصفية حسب التصنيف وفتح أي صورة بملء الشاشة."
      }
    },
    {
      id: "news",
      k: { en: ["news", "update", "announcement", "latest", "campaign", "awareness month"],
           ar: ["أخبار", "جديد", "إعلان", "مستجدات", "حملة", "شهر التوعية"] },
      a: {
        en: "The News section carries our latest announcements — forum registration, the updated screening guidelines, fellowship applications, and the Colorectal Cancer Awareness Month campaign.",
        ar: "يتضمن قسم الأخبار آخر إعلاناتنا — التسجيل في الملتقى، وأدلة الفحص المحدثة، والتقديم على الزمالة، وحملة شهر التوعية بسرطان القولون والمستقيم."
      }
    }
  ];

  /* --- Clinical-question guard ------------------------------
     This is a surgical society's website. The assistant must not
     be mistaken for a clinician, so anything that reads like a
     personal medical question gets a referral instead of an
     answer, whatever else it matched.
     -------------------------------------------------------- */
  var CLINICAL = {
    en: ["symptom", "symptoms", "pain", "bleeding", "blood", "diagnos", "treat", "treatment",
         "surgery for me", "should i", "do i have", "my results", "biopsy", "tumour", "tumor",
         "medication", "medicine", "dose", "prescribe", "hurts", "sick", "stool", "constipation",
         "diarrhea", "diarrhoea", "haemorrhoid", "hemorrhoid", "fissure", "fistula", "polyp"],
    ar: ["أعراض", "عرض", "ألم", "وجع", "نزيف", "دم", "تشخيص", "علاج", "أتعالج", "هل لدي",
         "نتيجتي", "خزعة", "ورم", "دواء", "جرعة", "براز", "إمساك", "إسهال", "بواسير",
         "شرخ", "ناسور", "زائدة", "سليلة"]
  };

  var COPY = {
    greeting: {
      en: "Hello — I can answer questions about the Saudi Society of Colon & Rectal Surgery: membership, the annual forum, training, partnerships and how to reach us. What would you like to know?",
      ar: "مرحبًا — يمكنني الإجابة عن أسئلتك حول الجمعية السعودية لجراحة القولون والمستقيم: العضوية، والملتقى السنوي، والتدريب، والشراكات، وطرق التواصل. كيف أستطيع مساعدتك؟"
    },
    clinical: {
      en: "I can't help with medical or personal health questions, and nothing here is medical advice. Please speak with a qualified colorectal surgeon or your own physician — and if this is urgent, seek medical care now. I'm happy to help with anything about the society itself.",
      ar: "لا أستطيع الإجابة عن الأسئلة الطبية أو المتعلقة بصحتك الشخصية، ولا شيء هنا يُعد استشارة طبية. يرجى مراجعة جراح مختص بالقولون والمستقيم أو طبيبك الخاص — وإذا كانت حالتك عاجلة فاطلب الرعاية الطبية فورًا. ويسعدني مساعدتك في أي أمر يخص الجمعية."
    },
    fallback: {
      en: "I don't have an answer for that yet. I can help with membership, the annual forum, training and fellowships, partnerships, the board, the gallery, or how to contact us. For anything else, info@sscrs.org will reach the society directly.",
      ar: "ليس لدي إجابة عن ذلك بعد. يمكنني المساعدة في العضوية، والملتقى السنوي، والتدريب والزمالات، والشراكات، ومجلس الإدارة، والمعرض، وطرق التواصل. ولأي استفسار آخر، يصلك فريق الجمعية عبر info@sscrs.org."
    },
    thanks: {
      en: "Happy to help. Anything else about the society?",
      ar: "سعدت بمساعدتك. هل من استفسار آخر عن الجمعية؟"
    }
  };

  var CHIPS = [
    { id: "membership", en: "How do I join?",        ar: "كيف أنضم؟" },
    { id: "forum",      en: "Annual Forum 2026",     ar: "الملتقى السنوي ٢٠٢٦" },
    { id: "training",   en: "Training & fellowship", ar: "التدريب والزمالة" },
    { id: "contact",    en: "Contact the society",   ar: "التواصل مع الجمعية" }
  ];

  function norm(s) {
    return (s || "").toLowerCase()
      .replace(/[ً-ْ]/g, "")            // strip Arabic diacritics
      .replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه");
  }

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /* Plain substring matching does not survive Arabic morphology.
     ألم ("pain") normalises to الم, which is the opening of الملتقى
     ("the forum"); and "هل لدي" ("do I have") sits inside "هل لديكم"
     ("do you have"), which means the opposite. So Arabic terms are
     matched at word boundaries, allowing the usual attached prefixes
     and suffixes, and phrases are matched whole. */
  // \u0600-\u06FF includes Arabic punctuation (؟ U+061F, ، U+060C);
  // treating those as letters broke the boundary check on any question
  // ending in ؟. Letters and digits only.
  var LETTER = "\u0621-\u064A\u0660-\u0669a-z0-9";
  var AR_PREFIX = "(?:وال|فال|بال|كال|ال|و|ف|ب|ل|ك)?";
  // Arabic stacks suffixes (شرك + ت + نا = شركتنا), so allow up to two.
  var AR_SUFFIX = "(?:ها|هم|هن|كم|كن|نا|ات|ين|ون|ه|ي|ك|ت){0,2}";

  function hasTerm(text, term) {
    var t = norm(text), k = norm(term);
    if (!k) return false;
    var isArabic = /[\u0600-\u06FF]/.test(k);

    if (k.indexOf(" ") !== -1) {
      // Multi-word phrase: require a clean boundary at both ends.
      return new RegExp("(^|[^" + LETTER + "])" + esc(k) + "($|[^" + LETTER + "])").test(t);
    }
    if (isArabic) {
      return new RegExp("(^|[^" + LETTER + "])" + AR_PREFIX + esc(k) + AR_SUFFIX +
                        "($|[^" + LETTER + "])").test(t);
    }
    // Latin: anchor the start of the word, let it inflect at the end
    // so "member" still matches "members" and "membership".
    return new RegExp("(^|[^a-z0-9])" + esc(k)).test(t);
  }

  function looksClinical(text, lang) {
    var list = (CLINICAL[lang] || CLINICAL.en).concat(lang === "ar" ? [] : []);
    for (var i = 0; i < list.length; i++) {
      if (hasTerm(text, list[i])) return true;
    }
    return false;
  }

  /* The default responder: keyword scoring over the KB. */
  function localResponder(text, lang) {
    var t = norm(text);
    if (!t) return COPY.fallback[lang];
    if (looksClinical(text, lang)) return COPY.clinical[lang];
    if (/(thank|thanks|شكرا|شكرًا)/.test(t)) return COPY.thanks[lang];
    if (/^(hi|hello|hey|salam|مرحبا|السلام|اهلا)\b/.test(t)) return COPY.greeting[lang];

    var best = null, bestScore = 0;
    KB.forEach(function (entry) {
      var score = 0;
      ["en", "ar"].forEach(function (l) {
        (entry.k[l] || []).forEach(function (kw) {
          if (hasTerm(text, kw)) score += norm(kw).length;
        });
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });
    return best && bestScore >= 3 ? best.a[lang] : COPY.fallback[lang];
  }

  var responder = localResponder;

  /* --- UI ---------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var fab = document.querySelector("[data-chat-open]");
    var panel = document.querySelector("[data-chat-panel]");
    if (!fab || !panel) return;

    var log = panel.querySelector("[data-chat-log]");
    var chips = panel.querySelector("[data-chat-chips]");
    var form = panel.querySelector("[data-chat-form]");
    var input = panel.querySelector("[data-chat-input]");
    var closeBtn = panel.querySelector("[data-chat-close]");
    var root = document.documentElement;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var started = false;

    function lang() { return root.lang === "ar" ? "ar" : "en"; }

    function bubble(who, text) {
      var row = document.createElement("div");
      row.className = "chat-msg chat-" + who;
      var b = document.createElement("div");
      b.className = "chat-bubble";
      b.textContent = text;
      row.appendChild(b);
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }

    function typing() {
      var row = document.createElement("div");
      row.className = "chat-msg chat-bot chat-typing";
      row.innerHTML = '<div class="chat-bubble"><span></span><span></span><span></span></div>';
      log.appendChild(row);
      log.scrollTop = log.scrollHeight;
      return row;
    }

    function renderChips() {
      chips.innerHTML = "";
      CHIPS.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "chat-chip";
        b.textContent = c[lang()];
        b.addEventListener("click", function () { send(c[lang()]); });
        chips.appendChild(b);
      });
    }

    function send(text) {
      text = (text || "").trim();
      if (!text) return;
      bubble("user", text);
      input.value = "";
      chips.hidden = true;

      var t = typing();
      var l = lang();
      Promise.resolve()
        .then(function () { return responder(text, l); })
        .then(function (reply) {
          var finish = function () {
            t.remove();
            bubble("bot", reply || COPY.fallback[l]);
          };
          reduce ? finish() : setTimeout(finish, 420);
        })
        .catch(function () {
          t.remove();
          bubble("bot", COPY.fallback[l]);
        });
    }

    function start() {
      if (started) return;
      started = true;
      bubble("bot", COPY.greeting[lang()]);
      renderChips();
      chips.hidden = false;
    }

    function open() {
      panel.hidden = false;
      void panel.offsetWidth;                    // flush layout so the transition runs
      panel.classList.add("is-open");
      fab.classList.add("is-active");
      fab.setAttribute("aria-expanded", "true");
      start();
      input.focus();
    }
    function close() {
      panel.classList.remove("is-open");
      fab.classList.remove("is-active");
      fab.setAttribute("aria-expanded", "false");
      setTimeout(function () { panel.hidden = true; }, reduce ? 0 : 240);
      fab.focus();
    }

    fab.addEventListener("click", function () {
      panel.hidden ? open() : close();
    });
    closeBtn.addEventListener("click", close);
    form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) close();
    });

    // Re-label the quick replies when the page language changes, and
    // greet again in the new language if nothing has been asked yet.
    document.addEventListener("sscrs:languagechange", function () {
      if (!started) return;
      if (!chips.hidden) {
        log.innerHTML = "";
        bubble("bot", COPY.greeting[lang()]);
      }
      renderChips();
    });

    /* Public hook — see the note at the top of this file. */
    window.SSCRS_CHAT = {
      open: open,
      close: close,
      ask: send,
      setResponder: function (fn) {
        if (typeof fn === "function") responder = fn;
      },
      knowledgeBase: KB
    };
  });
})();
