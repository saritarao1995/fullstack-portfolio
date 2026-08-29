import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = ({ hours, tagline, description, image, name }) => (
  <section className="relative min-h-[78vh] overflow-hidden">
    <img
      src={
        image ||
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80'
      }
      alt={name || 'Showroom'}
      className="absolute inset-0 h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/35 to-transparent" />
    <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32 text-parchment">
      <p className="text-xs uppercase tracking-[0.28em] text-sand">{hours}</p>
      <h1 className="mt-4 max-w-xl font-display text-5xl leading-[1.05] sm:text-7xl">{tagline}</h1>
      <p className="mt-5 max-w-md text-base text-sand">{description}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/shop">
          <Button>Explore the collection</Button>
        </Link>
        <Link to="/story">
          <Button variant="ghost" className="border-parchment/40 text-parchment hover:border-parchment">
            Our story
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

export default Hero;
