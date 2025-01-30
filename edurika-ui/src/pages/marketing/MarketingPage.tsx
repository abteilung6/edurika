import { HeroSection } from './sections/HeroSection'
import { FeatureSection } from './sections/FeatureSection'
import { FooterSection } from './sections/FooterSection'
import { TestimonialsSection } from './sections/TestimonialsSection'
import { QuestionsSection } from './sections/QuestionsSection'

const MarketingPage: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TestimonialsSection />
      <QuestionsSection />
      <FooterSection />
    </div>
  )
}

export default MarketingPage
