const faqs = [
  {
    id: 1,
    question: 'Welche Materialien kann ich verkaufen?',
    answer:
      'Du kannst Arbeitsblätter, Präsentationen, Tests, Unterrichtseinheiten und andere digitale Lehrmaterialien hochladen. Alle Inhalte sollten von dir selbst erstellt und urheberrechtlich unbedenklich sein.'
  },
  {
    id: 2,
    question: 'Wie viel Geld kann ich verdienen?',
    answer:
      'Der Verdienst hängt von der Anzahl der Verkäufe und dem Preis deiner Materialien ab. Du kannst selbst festlegen, wie viel du für dein Material verlangen möchtest.'
  },
  {
    id: 3,
    question: 'Wie erhalte ich meine Einnahmen?',
    answer:
      'Deine Einnahmen werden monatlich über die von dir gewählte Zahlungsmethode (z. B. Banküberweisung oder PayPal) ausgezahlt.'
  },
  {
    id: 4,
    question: 'Sind die Materialien geprüft?',
    answer:
      'Ja, alle Materialien stammen von erfahrenen Lehrkräften. Zusätzlich können Nutzer Bewertungen und Kommentare hinterlassen, um die Qualität sicherzustellen.'
  },
  {
    id: 5,
    question: 'Kann ich gekaufte Materialien weiterverkaufen?',
    answer:
      'Nein, gekaufte Materialien sind nur für den persönlichen Gebrauch bestimmt. Eine Weitergabe oder ein Weiterverkauf ist nicht erlaubt.'
  },
  {
    id: 6,
    question: 'Ist die Nutzung von Edurika kostenlos?',
    answer:
      'Ja, die Registrierung und das Stöbern in den Materialien sind kostenlos. Gebühren fallen nur beim Kauf oder Verkauf von Materialien an.'
  },
  {
    id: 7,
    question: 'Wie sicher sind meine Daten?',
    answer:
      'Wir legen großen Wert auf Datenschutz. Deine Daten werden verschlüsselt gespeichert und nicht an Dritte weitergegeben.'
  },
  {
    id: 8,
    question: 'Ich habe eine Frage – wie kann ich euch kontaktieren?',
    answer:
      'Du kannst uns jederzeit per E-Mail unter support@edurika.de erreichen oder unser Kontaktformular auf der Webseite nutzen.'
  },
  {
    id: 9,
    question: 'Ich habe ein Problem mit einem Kauf – was kann ich tun?',
    answer:
      'Falls du ein Problem mit einem gekauften Material hast, kontaktiere uns bitte mit deiner Bestellnummer. Wir helfen dir schnellstmöglich weiter.'
  }
]

export const QuestionsSection: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Haufig gestellte Fragen
        </h2>
        <p className="mt-6 max-w-2xl text-base/7 text-gray-600">
          Hast du eine andere Frage und kannst die Antwort nicht finden?
          Kontaktiere unser Support-Team per E-Mail,
          <a
            href="support@edurika.de"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            sending us an email
          </a>{' '}
          und wir melden uns so schnell wie möglich bei dir.
        </p>
        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <dt className="text-base/7 font-semibold text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
