import { useSelector } from 'react-redux';
import Hero from '../components/home/Hero';
import WordMarquee from '../components/home/WordMarquee';
import FeaturedGrid from '../components/home/FeaturedGrid';
import PromiseStrip from '../components/home/PromiseStrip';
import StoryBand from '../components/home/StoryBand';
import { selectFeaturedProducts, selectCatalogStatus } from '../store/selectors/catalogSelectors';
import { selectCompany } from '../store/selectors/settingsSelectors';

const HomeContainer = () => {
  const featured = useSelector(selectFeaturedProducts);
  const catalogStatus = useSelector(selectCatalogStatus);
  const company = useSelector(selectCompany);

  return (
    <>
      <Hero
        hours={company.hours}
        tagline={company.tagline}
        description={company.description}
        image={company.heroImage}
        name={company.name}
      />
      <WordMarquee />
      {catalogStatus === 'error' ? (
        <p className="px-6 py-12 text-center text-sm text-clay-deep">
          The collection could not be loaded. Please try again in a moment.
        </p>
      ) : (
        <FeaturedGrid products={featured} />
      )}
      <PromiseStrip />
      <StoryBand />
    </>
  );
};

export default HomeContainer;
