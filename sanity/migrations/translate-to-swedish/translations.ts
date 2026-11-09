export type SvTranslation = {
  _type: "profile" | "project" | "workExperience" | "education";
  // Plain Swedish sibling fields, e.g. { heroBioSv: "...", languagesSv: ["Svenska"] }.
  fields?: Record<string, string | string[]>;
  // Portable Text as [blockIndex][spanIndex], mirroring the English blocks.
  blocks?: { descriptionSv?: string[][]; bodySv?: string[][] };
  // Fields on keyed array members, e.g. communityWork[_key].assignmentSv.
  members?: {
    array: "communityWork" | "metrics";
    _key: string;
    fields: Record<string, string>;
  }[];
};

// Swedish translations of the published Sanity content, reviewed in the PR before
// the migration runs. Keyed by published document _id; drafts resolve to the
// same entry. Fields whose Swedish text equals the English (client names,
// "Linksson") are left out on purpose: the site falls back to English for them.
export const translations: Record<string, SvTranslation> = {
  // profile: Profile Information
  "01f48608-dbe9-4f5a-8977-fd244432319b": {
    _type: "profile",
    fields: {
      heroBioSv: "Jag heter Daniel och bygger hemsidor, webshoppar och systemen bakom för småföretag och butiker som saknar tiden eller kunskapen att göra det själva.",
      availabilityStatusSv: "Öppen för nya uppdrag",
      locationSv: "Göteborg, Sverige",
      languagesSv: ["Svenska", "Engelska", "Spanska"],
      personalitySkillsSv: ["Lugn", "Nyfiken", "Strukturerad", "Lagspelare", "Driven"],
    },
    blocks: {
      descriptionSv: [
        [
          "Hej",
          "! 👋 Jag är en driven utvecklare som jobbar AI-native och gärna dyker djupt i hela stacken. Med en sund blandning av nyfikenhet och ordningssinne har jag blivit en erfaren fullstackutvecklare som trivs med allt från små projekt till riktigt stora lösningar.",
        ],
        [
          "Jag har alltid varit en lagspelare och tror på styrkan i olika perspektiv. Jag har lång erfarenhet av att samarbeta i tvärfunktionella team och leverera mjukvara av hög kvalitet.",
        ],
        [
          "Jag gillar utmaningar och trivs med att ta mig an ny teknik. Varje dag ger nya chanser att lära och växa – och få saker slår känslan av att reda ut ett komplext problem eller lära mig något nytt.",
        ],
        [
          "Även om jag är driven i jobbet glömmer jag aldrig att jobbet bara är en del av livet. Jag är lugn under press, har en positiv inställning och ett ödmjukt sätt som gör vardagen trivsam och balanserad.",
        ],
        [
          "Hör av dig, så ser vi hur jag kan hjälpa dig att lösa dina tekniska problem! 🚀",
        ],
      ],
    },
    members: [
      {
        array: "communityWork",
        _key: "e7534276dff9",
        fields: {
          assignmentSv: "Aktiv styrelseledamot för en .NET-utbildning",
        },
      },
    ],
  },
  // project: The smart productivity list app
  "f2e63ae9-9e68-480d-b329-2bbfb9d30aed": {
    _type: "project",
    fields: {
      titleSv: "Den smarta produktivitetsappen",
      kindSv: "Webb, iOS, Android",
    },
    blocks: {
      bodySv: [
        [
          "Jag bygger just nu en smart produktivitetsapp där du enkelt organiserar vardagens sysslor, träningspass, att göra-listor, rutiner och mycket mer.",
        ],
        [""],
        ["Håll utkik, mer information kommer!"],
      ],
    },
  },
  // project: Linksson
  "4669e83e-2f5e-473e-93fe-7141400c66f8": {
    _type: "project",
    fields: {
      kindSv: "Webb",
    },
    blocks: {
      bodySv: [
        ["Designade och utvecklade en webbplats åt kunden."],
      ],
    },
  },
  // project: Monkey Solutions
  "4d374017-41dd-431d-a638-f33a177513e0": {
    _type: "project",
    fields: {
      kindSv: "Webb",
    },
    blocks: {
      bodySv: [
        [
          "Designade och utvecklade en personlig portfoliosajt med Next.js, TypeScript och Sanity CMS som visar min yrkeserfarenhet, mina tekniska kunskaper och sidoprojekt. Sajten är optimerad för prestanda, tillgänglighet och smidig innehållshantering.",
        ],
      ],
    },
  },
  // project: Verdi Products
  "33845878-50c1-482f-bf83-110b7e05d6ea": {
    _type: "project",
    fields: {
      kindSv: "Webb",
    },
    blocks: {
      bodySv: [
        [
          "Designade och utvecklade en modern SPA-webbapplikation som visar kundens produkt och gör vardagen enklare för den som handlar mat.",
        ],
      ],
    },
  },
  // workExperience: SENIOR FULLSTACK DEVELOPER | VÄSTTRAFIK
  "781fc18c-8a3c-4c8f-be3d-4a99a2178483": {
    _type: "workExperience",
    fields: {
      titleSv: "SENIOR FULLSTACKUTVECKLARE | VÄSTTRAFIK",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag är en del av ett utvecklingsteam på avdelningen för trafikinformation. Vi utvecklar nya system och förvaltar befintliga för hela avdelningen.",
        ],
        [
          "I teamet jobbar alla fullt ut som fullstackutvecklare. Vi sköter också infrastruktur och drift för de tjänster och produkter vi levererar för trafikinformation.",
        ],
        ["Fullstackutveckling av produkter med hög kvalitet"],
        ["TDD"],
        ["Agilt"],
        ["Kollektivtrafik"],
      ],
    },
  },
  // workExperience: SENIOR FULLSTACK DEVELOPER | STENA LINE
  "51671ddd-bd94-47ad-8f3b-7fa6fad429bd": {
    _type: "workExperience",
    fields: {
      titleSv: "SENIOR FULLSTACKUTVECKLARE | STENA LINE",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag hade en central roll i ett av Stena Lines största utvecklingsteam, Freight-teamet. Det bestod av tre agila team och jag ingick i ett av dem. I det dagliga arbetet tog jag fram förbättringar och nya funktioner för alla digitala säljplattformar som fraktförsäljningen använder.",
        ],
        [
          "Freight-teamet hanterar också passagerarrelaterade uppgifter och en stor mängd kundinformation, linjedata och avtal. Den delen av arbetet är affärskritisk och ställer höga krav på testning och kvalitet. I teamet har jag jobbat som fullstackutvecklare med fokus på backend.",
        ],
        [
          "Här har jag jobbat brett: förvaltning, nya funktioner, integrationsutveckling och API:er mot externa system.",
        ],
        [
          "Samarbetade i tvärfunktionella team för smidiga leveranser av nya funktioner",
        ],
        ["Mentor för juniora utvecklare"],
        ["Agilt"],
        ["Fullstackutvecklare"],
      ],
    },
  },
  // workExperience: SENIOR FULLSTACK DEVELOPER | EMERSON
  "a2d52c12-d107-4f65-b898-ee0addea5a3e": {
    _type: "workExperience",
    fields: {
      titleSv: "SENIOR FULLSTACKUTVECKLARE | EMERSON",
    },
    blocks: {
      descriptionSv: [
        [
          "Emerson är en stor koncern och ett av fokusområdena är ett IoT-system för en stor industri. Där finns två utvecklingsteam med totalt över 20 utvecklare och testare, med en blandning av nationaliteter, erfarenheter och bakgrunder. Jag jobbade i hela stacken som fullstackutvecklare med fokus på backendtjänsterna.",
        ],
        [
          "På Emerson byggde jag helt nya backendtjänster som tar emot och förvaltar tidsseriedata. Datan distribuerades sedan vidare till olika produkter hos kunderna.",
        ],
        [
          "Samarbetade i tvärfunktionella team för smidiga leveranser av nya funktioner",
        ],
        ["Mentor för juniora utvecklare"],
        ["Backendutvecklare"],
      ],
    },
  },
  // workExperience: SENIOR BACKEND DEVELOPER | CAPPY
  "c3b3b3c2-4c54-4a3c-915e-f7efee5202e0": {
    _type: "workExperience",
    fields: {
      titleSv: "SENIOR BACKENDUTVECKLARE | CAPPY",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i ett litet team som byggde en ny fintech-app för en startup. Mitt fokus var backendtjänster, integrationer mot externa tjänster som BankId och devops.",
        ],
        [""],
        ["Startup"],
        ["Backendutvecklare"],
      ],
    },
  },
  // workExperience: SENIOR BACKEND DEVELOPER | BLOMSTERLANDET
  "2cc27f10-bfef-4b2f-97fa-4b68a9d91ce6": {
    _type: "workExperience",
    fields: {
      titleSv: "SENIOR BACKENDUTVECKLARE | BLOMSTERLANDET",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i ett tight Scrum-team som ansvarade för kundens e-handelslösning. Mitt fokus låg på backend och devops.",
        ],
        [""],
        ["CMS"],
        ["E-handel"],
        ["Backendutvecklare"],
      ],
    },
  },
  // workExperience: .NET TEACHER | HANDELSAKADEMIN
  "0940491f-31a6-4f7c-8be4-c8880a453bb4": {
    _type: "workExperience",
    fields: {
      titleSv: ".NET-LÄRARE | HANDELSAKADEMIN",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag höll en kurs i avancerad objektorienterad programmering i .NET C# för en klass på 25 studenter. Jag ansvarade för kursplanen, planerade alla lektioner, tog fram material och höll i examinationerna.",
        ],
        [""],
        ["Undervisning"],
        ["Examination"],
      ],
    },
  },
  // workExperience: FULLSTACK DEVELOPER | GRAFOKET
  "469804d8-e935-4bf3-9365-292284831495": {
    _type: "workExperience",
    fields: {
      titleSv: "FULLSTACKUTVECKLARE | GRAFOKET",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag hoppade in en kortare period för att stötta teamet. Jag jobbade i hela stacken med förvaltning och nya funktioner i kundernas webbappar.",
        ],
        [""],
        ["Fullstack"],
        ["Tryckeri"],
      ],
    },
  },
  // workExperience: BACKEND DEVELOPER | VÄSTIA PARKERING
  "89f97b2e-6ee5-4975-bbdf-ce3f4ab7fe6f": {
    _type: "workExperience",
    fields: {
      titleSv: "BACKENDUTVECKLARE | VÄSTIA PARKERING",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag hoppade in en kortare period för att stötta teamet med backendutvecklingen.",
        ],
        [""],
        ["Backendutvecklare"],
        ["Parkering"],
      ],
    },
  },
  // workExperience: TECH LEAD | FULLSTACK DEVELOPER | ARCTIC PAPER
  "10113c15-d216-4671-9040-3706edc5c4cd": {
    _type: "workExperience",
    fields: {
      titleSv: "TECH LEAD | FULLSTACKUTVECKLARE | ARCTIC PAPER",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i Scrum-teamet som byggde en helt ny webbplats, förberedd för att enkelt kunna byggas ut till en fullskalig e-handelsplattform. I projektet var jag Tech Lead, ansvarade för alla tekniska beslut och var länken mellan kunden och resten av utvecklingsteamet.",
        ],
        [""],
        ["Tech Lead"],
        ["CMS/e-handel"],
        ["Devops"],
        ["Fullstack"],
      ],
    },
  },
  // workExperience: FULLSTACK DEVELOPER | MQ Marqet
  "d4ccc9f4-e689-46fc-a7f0-9efa1466b91e": {
    _type: "workExperience",
    fields: {
      titleSv: "FULLSTACKUTVECKLARE | MQ Marqet",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i det interna teamet som förvaltade och vidareutvecklade MQ:s e-handelslösning. Jag ansvarade också för integrationslagret som hanterade alla integrationer mot externa system.",
        ],
        [""],
        ["Fullstackutvecklare"],
        ["Integrationer"],
        ["E-handel"],
      ],
    },
  },
  // workExperience: TECH LEAD | FULLSTACK DEVELOPER | CHRISTIAN BERNER
  "e51c85fb-a6a3-472d-9daa-cb1b06e87b6b": {
    _type: "workExperience",
    fields: {
      titleSv: "TECH LEAD | FULLSTACKUTVECKLARE | CHRISTIAN BERNER",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i Scrum-teamet som byggde en helt ny webbplats, förberedd för att enkelt kunna göras om till en fullskalig e-handelsplattform. I projektet var jag Tech Lead och ansvarade för alla tekniska beslut, samtidigt som jag var länken mellan kunden och resten av utvecklarna.",
        ],
        [""],
        ["Tech Lead"],
        ["CMS/e-handel"],
        ["Devops"],
        ["Fullstack"],
        [""],
      ],
    },
  },
  // workExperience: BACKEND DEVELOPER | KAPPAHL
  "e860a6c7-1988-4954-ac82-c32597c7055f": {
    _type: "workExperience",
    fields: {
      titleSv: "BACKENDUTVECKLARE | KAPPAHL",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i ett större konsultteam som satt på plats hos kunden. Uppdraget var att förvalta och bygga nya funktioner för att löpande förbättra kundens omfattande e-handelssajt.",
        ],
        [""],
        ["CMS"],
        ["E-handel"],
        ["Backendutvecklare"],
      ],
    },
  },
  // workExperience: BACKEND DEVELOPER | NÆRINGSLIVETS HOVEDORGANISASJON
  "6752d24d-33ae-4a19-982f-7b6c0b706619": {
    _type: "workExperience",
    fields: {
      titleSv: "BACKENDUTVECKLARE | NÆRINGSLIVETS HOVEDORGANISASJON",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag jobbade som konsult på plats hos NHO i Oslo. Jag ingick i teamet som byggde en ny beställningsportal där användare kan skapa egna, anpassade handböcker och trycka dem för sina organisationer.",
        ],
        [""],
        ["Backendutvecklare"],
        ["Devops"],
      ],
    },
  },
  // workExperience: BACKEND DEVELOPER | THOMAS CONCRETE GROUP
  "7b2369ab-f205-48be-bc1c-c4516fb6553f": {
    _type: "workExperience",
    fields: {
      titleSv: "BACKENDUTVECKLARE | THOMAS CONCRETE GROUP",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag ingick i ett litet team i ett utvecklingsprojekt där vi snabbt behövde möta kundens komplexa behov och krav. Uppdraget var att bygga en Progressive Web App (PWA) som följer leveranser från fabrik till byggarbetsplats.",
        ],
        [""],
        ["CMS"],
        ["Backendutvecklare"],
        ["PWA"],
      ],
    },
  },
  // workExperience: FULLSTACK DEVELOPER | STATKRAFT
  "2681b8a5-5334-4bb9-8d0d-fc6a3baa86f6": {
    _type: "workExperience",
    fields: {
      titleSv: "FULLSTACKUTVECKLARE | STATKRAFT",
    },
    blocks: {
      descriptionSv: [
        [
          "Jag var en nyckelperson i ett agilt internt team som ansvarade för kundens publika webbplats och hela intranätet. I rollen förvaltade jag både den publika webbplatsen och intranätet och byggde nya funktioner.",
        ],
        [""],
        ["CMS"],
        ["Devops"],
        ["Fullstackutvecklare"],
      ],
    },
  },
  // education: Systems Developer .NET
  "359b8390-adf8-4f83-82d2-12de018666c2": {
    _type: "education",
    fields: {
      titleSv: "Systemutvecklare .NET",
      fieldOfStudySv: "Systemutvecklare .NET",
    },
  },
};
