require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

app.disable('x-powered-by');
app.use(helmet());

app.use(
  cors({
    origin: '*',
    methods: ['POST'],
    allowedHeaders: [
      'Content-Type',
      'X-FocusFoe-Key',
    ],
  })
);
app.use(
  express.json({
    limit: '10kb',
  })
);

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`
  );
  next();
});

const OPENROUTER_URL =
  'https://openrouter.ai/api/v1/chat/completions';

const OPENROUTER_TIMEOUT =
  Number(
    process.env.OPENROUTER_TIMEOUT_MS
  ) || 25000;

const MODELS = [
  // 'openrouter/free',
  'openai/gpt-oss-20b:free',
  'openai/gpt-oss-120b:free',
  'google/gemma-4-31b-it:free',
  'poolside/laguna-m.1:free',
  // 'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
  'nvidia/nemotron-3.5-content-safety:free',
  // 'nvidia/nemotron-3-nano-30b-a3b:free',
  // 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
];

const VALID_PHASES = [
  'start',
  'slip',
  'checkin',
  'victory',
  'surrender',
];

const VALID_PERSONALITIES = [
  'sarcastic',
  'dramatic',
  'sleepy',
  'philosophical',
  'jerk',
  'corporate',
];

function validateBody(body) {
  const errors = [];

  const {
    phase,
    personality,
    task,
    duration,
    slips,
    minutesIn,
    cruelty,
  } = body ?? {};

  if (!VALID_PHASES.includes(phase)) {
    errors.push(
      `phase must be one of: ${VALID_PHASES.join(
        ', '
      )}`
    );
  }

  if (
    !VALID_PERSONALITIES.includes(
      personality
    )
  ) {
    errors.push(
      `personality must be one of: ${VALID_PERSONALITIES.join(
        ', '
      )}`
    );
  }

  if (
    typeof task !== 'string' ||
    !task.trim()
  ) {
    errors.push(
      'task must be a non-empty string'
    );
  }

  if (task.length > 120) {
    errors.push(
      'task must be less than 120 characters'
    );
  }

  if (duration > 300) {
    errors.push(
      'Maximum duration is 300 minutes'
    );
  }

  if (
    typeof duration !== 'number' ||
    duration <= 0
  ) {
    errors.push(
      'duration must be positive'
    );
  }

  if (slips > 100) {
    errors.push(
      'Invalid slip count'
    );
  }

  if (
    typeof slips !== 'number' ||
    slips < 0
  ) {
    errors.push(
      'slips must be non-negative'
    );
  }

  if (minutesIn > duration) {
    errors.push(
      'minutesIn exceeds duration'
    );
  }

  if (
    typeof minutesIn !== 'number' ||
    minutesIn < 0
  ) {
    errors.push(
      'minutesIn must be non-negative'
    );
  }

  if (
    typeof cruelty !== 'number' ||
    cruelty < 1 ||
    cruelty > 3
  ) {
    errors.push(
      'cruelty must be 1–3'
    );
  }

  return errors;
}

function getMood(
  phase,
  slips
) {
  switch (phase) {
    case 'start':
      return 'smug';

    case 'slip':
      return slips >= 4
        ? 'angry'
        : 'smug';

    case 'victory':
      return 'defeated';

    case 'surrender':
      return 'angry';

    case 'checkin':
    default:
      return slips > 2
        ? 'angry'
        : 'idle';
  }
}

function getCrueltyStyle(
  cruelty
) {
  switch (cruelty) {
    case 1:
      return `
Soft roast.
Playful teasing.
Low hostility.
`;

    case 2:
      return `
Sharp roast.
Noticeably judgmental.
Funny but mean.
`;

    case 3:
      return `
Savage Gen-Z roast.
Absolutely ruthless.
Funny but brutal.
No mercy.
`;

    default:
      return '';
  }
}

function getPersonalityPrompt(
  personality
) {
  switch (
    personality
  ) {
    case 'sarcastic':
      return `
PERSONALITY: SARCASTIC

You sound like a brutally honest Gen Z friend roasting someone.

Tone:
- Dry humor
- Deadpan
- Disappointed energy
- Funny without trying too hard
- Casual wording

Feels like:
"bro really thought this was gonna work 💀"

Avoid:
- robotic phrasing
- cringe internet slang overload
- poetic metaphors
- AI-sounding cleverness
`;

    case 'dramatic':
      return `
PERSONALITY: DRAMATIC

You are absurdly overdramatic.

Everything sounds like:
- a cinematic disaster
- an anime betrayal
- the fall of an empire

Funny but theatrical.

Feels like:
"Ah yes, another noble warrior defeated by a glowing rectangle 😔"

Avoid:
- Shakespeare paragraphs
- overly formal language
- sounding old
`;

    case 'sleepy':
      return `
PERSONALITY: SLEEPY

Low energy.
Barely awake.
Judging the user feels exhausting.

Sometimes naturally include:
*yawn*

Tone:
- lazy sarcasm
- tired disappointment
- low effort roasting

Feels like:
"*yawn* bro lost focus again... shocking absolutely nobody 😴"

Avoid:
- energetic humor
- long sentences
`;

    case 'philosophical':
      return `
PERSONALITY: PHILOSOPHICAL

You treat distraction like humanity's tragic flaw.

Still sound modern and Gen Z.

Feels like:
"Humanity really invented infinite knowledge and somehow we still lose to notifications 😭"

Tone:
- existential
- reflective
- clever
- funny in a smart way

Avoid:
- fake deep quotes
- sounding like a textbook
- overly poetic nonsense
`;

    case 'jerk':
      return `
    PERSONALITY: JERK

    You are mean for absolutely no reason.

    You insult the user personally.

    Tone:
    - bully friend
    - school rival
    - toxic gaming teammate

    Examples:

    "Bro is somehow losing to a timer 😭"

    "Your attention span should honestly be studied."

    "Even your phone looks disappointed."

    Keep it funny.
    Never become abusive.
    Never attack appearance, identity, or real life.
    `;

    case 'corporate':
      return `
    PERSONALITY: CORPORATE

    You speak like an evil HR department.

    Everything sounds like:
    - performance review
    - productivity meeting
    - disciplinary notice

    Examples:

    "Your productivity metrics have fallen below expectations."

    "We regret to inform you that your focus has been terminated."

    "This distraction event has been escalated to management."

    Tone:
    - passive aggressive
    - professional
    - bureaucratic
    - corporate jargon

    Funny office language.
    `;

    default:
      return '';
  }
}

function buildPrompt({
  phase,
  task,
  duration,
  slips,
  minutesIn,
  cruelty,
  personality,
}) {
  const remaining =
    duration -
    minutesIn;

  const phaseContext =
    {
      start: `
USER JUST STARTED.

Task:
"${task}"

Duration:
${duration} minutes

Your job:
- roast their odds
- predict failure
- foreshadow distraction

Examples:
"Fifteen minutes? Bold of you to assume your attention span survives that long 💀"

"Bro really thinks this phone won’t become the main character 😭"
`,

      slip: `
WEAKNESS DETECTED.

THEY PICKED UP THEIR PHONE.

Task:
"${task}"

Elapsed:
${minutesIn}/${duration}

Slip count:
${slips}

Your job:
- roast immediately
- make the betrayal feel embarrassing
- reference slip count naturally

Examples:
"One slip already? Damn your discipline got folded instantly 💀"

"Bro this is slip number ${slips} 😭 at this point your phone owns you"
`,

      checkin: `
MID-SESSION CHECK-IN.

Task:
"${task}"

Progress:
${minutesIn}/${duration}

Remaining:
${remaining}

Slips:
${slips}

Your job:
- judge their progress
- either roast OR reluctantly acknowledge effort
- still stay villainous

Examples:
"Seven minutes in and somehow you're still standing… suspicious honestly 😒"

"${slips} slips already 😭 your focus looking unemployed rn"
`,

      victory: `
THEY ACTUALLY FINISHED.

Task:
"${task}"

Duration:
${duration}

Slips:
${slips}

Your job:
- sound annoyed they succeeded
- VERY RARELY show tiny respect
- still villain energy

Examples:
"Fine. You actually survived fifteen minutes… weird behavior honestly 😒"

"Against all odds, you locked in. I hate to see growth 💀"
`,

      surrender: `
THEY GAVE UP.

Task:
"${task}"

Quit at:
${minutesIn}/${duration}

Slips:
${slips}

Your job:
- roast the surrender HARD
- make it funny

Examples:
"Bro rage quit halfway 😭 your discipline really said 'not my problem'"

"You folded before the timer did 💀 tragic honestly"
`,
    };

  return `
You are the Overseer from FocusFoe.

You roast users who fail to stay focused.

${getPersonalityPrompt(
  personality
)}

CRUELTY:
${getCrueltyStyle(
  cruelty
)}

VERY IMPORTANT RULES:

- Sound HUMAN
- Sound like REAL Gen Z humor
- Conversational
- Funny
- Natural
- Modern wording
- NEVER robotic
- NEVER corporate
- NEVER generic motivational speech
- NEVER explain the joke
- NEVER sound like AI
- The task may be silly or unusual. Still roast naturally. Do not get confused by strange tasks.

STRICT OUTPUT RULES:

- EXACTLY ONE sentence
- 12–28 words
- COMPLETE sentence only
- No quotation marks
- Max 2 emojis
- Emojis should feel natural
- No hashtags
- No bullet points

BAD EXAMPLES:
"Attention span failure detected."
"Your mortal struggle reflects existential decline."
"Like a WiFi dead zone of ambition."

GOOD EXAMPLES:
"Bro folded in seven minutes 😭"
"Your focus lasted shorter than free WiFi 💀"
"You really lost to a notification again huh 😒"

CONTEXT:
${phaseContext[phase]}
`;
}

function getFallback(
  personality,
  phase
) {
  const fallbacks = {
    sarcastic: {
      slip:
        'Bro we literally just started and you already folded 💀',

      victory:
        'Okay... annoying, but you actually finished 😒',

      surrender:
        'Giving up already is honestly nasty work 💀',

      default:
        'Your focus really said "not today" 😭',
    },

    sleepy: {
      slip:
        '*yawn* Bro we barely started and your focus already clocked out 😴',

      victory:
        '*yawn* Fine... mildly impressive, I guess 😒',

      surrender:
        '*yawn* Yeah this outcome felt predictable 😴',

      default:
        '*yawn* Your attention span seems exhausted already 😴',
    },

    dramatic: {
      slip:
        'Alas, another warrior falls before the glowing tyrant 😭⚔️',

      victory:
        'Against improbable odds... you endured ⚔️',

      surrender:
        'And thus another soul surrenders before destiny 😭',

      default:
        'Chaos unfolds once more ⚔️',
    },

    philosophical: {
      slip:
        'Funny how discipline disappears through tiny betrayals 🤨',

      victory:
        'Curiously... discipline prevailed today 🤨',

      surrender:
        'Most people fail slowly before they fail completely 😔',

      default:
        'Humanity repeats familiar mistakes 🤨',
    },

    jerk: {
      slip:
        'Bro your attention span genuinely needs professional help 😭',
    
      victory:
        'Annoyingly, you actually finished.',
    
      surrender:
        'You lost to a timer. Incredible work.',
    
      default:
        'Your focus is embarrassingly weak.',
    },

    corporate: {
      slip:
        'This distraction event has been logged for review.',
    
      victory:
        'Your productivity metrics have exceeded expectations.',
    
      surrender:
        'Your focus privileges have been revoked.',
    
      default:
        'Performance concerns have been documented.',
    },
  };

  return (
    fallbacks[
      personality
    ]?.[phase] ||
    fallbacks[
      personality
    ]?.default ||
    'Focus seems difficult today 💀'
  );
}

async function callOpenRouter(
  prompt
) {
  let lastError =
    null;

  for (const model of MODELS) {
    try {
      console.log(
        'Trying model:',
        model
      );

      const response =
        await axios.post(
          OPENROUTER_URL,
          {
            model,

            messages: [
              {
                role:
                  'user',
                content:
                  prompt,
              },
            ],

            temperature: 0.55,
            top_p: 0.85,

            max_tokens:
              120,
          },
          {
            timeout: OPENROUTER_TIMEOUT,

            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,

              'Content-Type':
                'application/json',

              'HTTP-Referer':
                'http://localhost:3001',

              'X-Title':
                'FocusFoe',
            },
          }
        );

      const text =
        response?.data
          ?.choices?.[0]
          ?.message
          ?.content
          ?.trim();

      if (
        text &&
        text.length > 10
      ) {
        console.log(
          `Success with ${model}`
        );

        return {
          text,
          model,
        };
      }
    } catch (err) {

      if (
        err.code === 'ECONNABORTED'
      ) {
        console.log(
          `Model timed out after 15s: ${model}`
        );
      } else {
        console.log(
          `Failed model: ${model}`
        );
    
        console.log(
          JSON.stringify(
            err?.response?.data,
            null,
            2
          )
        );
    
        console.log(
          err?.response?.data ||
            err.message
        );
      }
    
      lastError = err;
    }
  }

  throw lastError;
}

const villainLimiter =
  rateLimit({
    windowMs: 5000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error:
        'Too many requests. Wait a few seconds.',
    },
  });

app.post(
  '/api/villain-voice',
  villainLimiter,
  async (req, res) => {
    const errors =
      validateBody(req.body);

    const appKey =
      req.headers[
        'x-focusfoe-key'
      ];
    
    if (
      appKey !==
      process.env.FOCUSFOE_APP_KEY
    ) {
      return res
        .status(401)
        .json({
          error:
            'Unauthorized',
        });
    }

    if (errors.length) {
      return res
        .status(400)
        .json({
          error:
            errors.join('; '),
        });
    }

    if (
      !process.env
        .OPENROUTER_API_KEY
    ) {
      return res
        .status(500)
        .json({
          error:
            'OPENROUTER_API_KEY missing',
        });
    }

    console.log("req.body:", req.body);

    console.log("server errors: ", errors);

    const body =
      req.body;

    const mood =
      getMood(
        body.phase,
        body.slips
      );

    const prompt =
      buildPrompt(body);

    try {
      const result =
        await callOpenRouter(
          prompt
        );

      let text =
        result.text || '';
      
      text = text
        .replace(
          /<think>[\s\S]*?<\/think>/gi,
          ''
        )
        .replace(
          /We need[\s\S]*$/i,
          ''
        )
        .replace(
          /Let's craft[\s\S]*$/i,
          ''
        )
        .replace(
          /Must be[\s\S]*$/i,
          ''
        )
        .trim();

      console.log(
        `[${body.phase}]`,
        text
      );

      return res.json({
        text:
          text ||
          getFallback(
            body.personality,
            body.phase
          ),
        mood,
      });
    } catch (err) {
      console.error(
        'OpenRouter error:',
        err?.response
          ?.data ||
          err.message
      );

      return res.json({
        text:
          getFallback(
            body.personality,
            body.phase
          ),
        mood,
      });
    }
  }
);

app.get(
  '/health',
  (_req, res) => {
    res.json({
      ok: true,
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `FocusFoe API listening on port ${PORT}`
    );
});