import {
  ArrowPathIcon,
  CloudArrowUpIcon,
  LockClosedIcon
} from '@heroicons/react/20/solid'

const features = [
  {
    name: 'Verdiene Geld mit deinen Materialien',
    description:
      'Teile deine Unterrichtsmaterialien mit anderen Lehrkräften und verdiene passives Einkommen.',
    href: '#',
    icon: CloudArrowUpIcon
  },
  {
    name: 'Hochwertige Inhalte von Lehrern für Lehrinnen und Lehrer',
    description:
      'Alle Materialien stammen von erfahrenen Lehrkräften und sind praxisnah.',
    href: '#',
    icon: LockClosedIcon
  },
  {
    name: 'Zeitsparend & effizient',
    description:
      'Keine stundenlange Vorbereitung – finde geprüfte Materialien für jeden Schultyp und jedes Fach.',
    href: '#',
    icon: ArrowPathIcon
  }
]

export const FeatureSection: React.FC = () => {
  return (
    <div className="bg-white pb-24 sm:pb-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">
            Einfach erklärt
          </h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Was ist Edurika?
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            Edurika ist die neue Plattform, auf der Lehrinnen und Lehrer ihre
            selbst erstellten Unterrichtsmaterialien verkaufen und gleichzeitig
            hochwertige Materialien von Kollegen erwerben können. Ob
            Arbeitsblätter, Präsentationen oder komplette Unterrichtseinheiten –
            hier findest du alles, was du für deinen Unterricht brauchst.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base/7 font-semibold text-gray-900">
                  <feature.icon
                    aria-hidden="true"
                    className="size-5 flex-none text-indigo-600"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base/7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm/6 font-semibold text-indigo-600"
                    >
                      Lerne mehr <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
