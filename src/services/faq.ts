import { Locale } from './i18n.js';

export interface FAQItem {
  question: string;
  answer: string;
  details?: string[];
}

export const getFAQ = (locale: Locale): FAQItem[] => {
  if (locale === 'en') {
    return [
      {
        question: 'What is Skyddad?',
        answer: 'Skyddad is a secure one-time secret sharing service. You can share sensitive information with confidence, knowing it will be automatically deleted after viewing or expiration.',
        details: [
          'Messages are encrypted with AES-256-CBC',
          'Optional PIN protection available',
          'Automatic deletion after viewing',
          'Configurable expiration times (1 hour, 24 hours, 7 days)',
        ],
      },
      {
        question: 'How secure is Skyddad?',
        answer: 'Skyddad uses industry-standard encryption and security practices to protect your secrets.',
        details: [
          'AES-256-CBC encryption for all messages',
          'bcrypt hashing for PINs (if used)',
          'HMAC token validation for links',
          'Rate limiting to prevent abuse',
          'CSRF protection on all forms',
          'No tracking or analytics without consent',
        ],
      },
      {
        question: 'How long are messages stored?',
        answer: 'Messages are automatically deleted after being viewed once, or when they expire. You can choose expiration times of 1 hour, 24 hours, or 7 days when creating a secret.',
        details: [
          'Default expiration: 24 hours',
          'Messages are permanently deleted after viewing',
          'Expired messages are automatically cleaned up',
        ],
      },
      {
        question: 'Can I use a PIN to protect my message?',
        answer: 'Yes, you can optionally add a PIN when creating a secret. The PIN must be between 4 and 20 alphanumeric characters.',
        details: [
          'PIN is hashed with bcrypt before storage',
          'Maximum 5 PIN attempts per secret',
          'Secret is locked after too many failed attempts',
        ],
      },
      {
        question: 'What happens if I lose the link?',
        answer: 'If you lose the link to your secret, it cannot be recovered. This is by design for security reasons. Make sure to save the link when you create a secret.',
      },
      {
        question: 'Is my data private?',
        answer: 'Yes, Skyddad is designed with privacy in mind. We use GDPR-compliant practices including data anonymization and automatic deletion.',
        details: [
          'IP addresses are hashed (SHA-256) before storage',
          'User agent information is partially anonymized',
          'No personally identifiable information is collected',
          'Logs are automatically deleted after 90 days',
        ],
      },
      {
        question: 'Can I view a message multiple times?',
        answer: 'No, messages can only be viewed once. After viewing, the message is permanently deleted. This ensures maximum security for sensitive information.',
      },
      {
        question: 'What if someone guesses my PIN?',
        answer: 'After 5 failed PIN attempts, the secret is permanently locked and cannot be viewed. This protects against brute-force attacks.',
      },
      {
        question: 'Is Skyddad free to use?',
        answer: 'Yes, Skyddad is completely free to use. There are no registration requirements or usage limits.',
      },
      {
        question: 'Who can see my messages?',
        answer: 'Only someone with the exact link and valid token can view your message. If you use a PIN, they also need to know the PIN. Messages are encrypted and cannot be read by anyone without the link and token.',
      },
    ];
  }

  // Swedish
  return [
    {
      question: 'Vad är Skyddad?',
      answer: 'Skyddad är en säker tjänst för engångsdelning av hemligheter. Du kan dela känslig information med trygghet, vetskapen om att den automatiskt raderas efter visning eller utgångstid.',
      details: [
        'Meddelanden krypteras med AES-256-CBC',
        'Valfritt PIN-skydd tillgängligt',
        'Automatisk radering efter visning',
        'Konfigurerbara utgångstider (1 timme, 24 timmar, 7 dagar)',
      ],
    },
    {
      question: 'Hur säker är Skyddad?',
      answer: 'Skyddad använder branschstandard för kryptering och säkerhet för att skydda dina hemligheter.',
      details: [
        'AES-256-CBC kryptering för alla meddelanden',
        'bcrypt-hashing för PIN (om används)',
        'HMAC token-validering för länkar',
        'Rate limiting för att förhindra missbruk',
        'CSRF-skydd på alla formulär',
        'Ingen spårning eller analys utan samtycke',
      ],
    },
    {
      question: 'Hur länge lagras meddelanden?',
      answer: 'Meddelanden raderas automatiskt efter att de har visats en gång, eller när de går ut. Du kan välja utgångstider på 1 timme, 24 timmar eller 7 dagar när du skapar en hemlighet.',
      details: [
        'Standard utgångstid: 24 timmar',
        'Meddelanden raderas permanent efter visning',
        'Utgångna meddelanden rensas automatiskt',
      ],
    },
    {
      question: 'Kan jag använda en PIN för att skydda mitt meddelande?',
      answer: 'Ja, du kan valfritt lägga till en PIN när du skapar en hemlighet. PIN:en måste vara mellan 4 och 20 alfanumeriska tecken.',
      details: [
        'PIN hashas med bcrypt före lagring',
        'Maximalt 5 PIN-försök per hemlighet',
        'Hemligheten låses efter för många misslyckade försök',
      ],
    },
    {
      question: 'Vad händer om jag tappar bort länken?',
      answer: 'Om du tappar bort länken till din hemlighet kan den inte återställas. Detta är avsiktligt av säkerhetsskäl. Se till att spara länken när du skapar en hemlighet.',
    },
    {
      question: 'Är min data privat?',
      answer: 'Ja, Skyddad är designad med integritet i åtanke. Vi använder GDPR-kompatibla metoder inklusive dataanonymisering och automatisk radering.',
      details: [
        'IP-adresser hashas (SHA-256) före lagring',
        'User agent-information är delvis anonymiserad',
        'Ingen personligt identifierbar information samlas in',
        'Loggar raderas automatiskt efter 90 dagar',
      ],
    },
    {
      question: 'Kan jag visa ett meddelande flera gånger?',
      answer: 'Nej, meddelanden kan bara visas en gång. Efter visning raderas meddelandet permanent. Detta säkerställer maximal säkerhet för känslig information.',
    },
    {
      question: 'Vad händer om någon gissar min PIN?',
      answer: 'Efter 5 misslyckade PIN-försök låses hemligheten permanent och kan inte visas. Detta skyddar mot brute-force-attacker.',
    },
    {
      question: 'Är Skyddad gratis att använda?',
      answer: 'Ja, Skyddad är helt gratis att använda. Det finns inga registreringskrav eller användningsgränser.',
    },
    {
      question: 'Vem kan se mina meddelanden?',
      answer: 'Endast någon med exakt länk och giltig token kan visa ditt meddelande. Om du använder en PIN behöver de också känna till PIN:en. Meddelanden är krypterade och kan inte läsas av någon utan länken och token.',
    },
  ];
};

