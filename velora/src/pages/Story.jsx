import { Link } from 'react-router-dom';

const Story = () => (
  <article className="mx-auto max-w-3xl px-6 py-20">
    <p className="text-xs uppercase tracking-[0.22em] text-clay">Atelier note</p>
    <h1 className="mt-3 font-display text-5xl leading-tight">Rooms that know how to be still.</h1>
    <p className="mt-6 text-lg text-ink-soft">
      Velora Atelier is a furniture house in Kota. We mill solid wood, finish by hand, and keep
      the palette quiet so the room, not the brand, leads.
    </p>
    <p className="mt-4 text-lg text-ink-soft">
      Order online for white-glove delivery, or collect from the Civil Lines showroom when we
      call. Lead time on workshop pieces is four to six weeks.
    </p>
    <Link to="/shop" className="mt-10 inline-block text-sm uppercase tracking-[0.2em] text-clay">
      Enter the collection →
    </Link>
  </article>
);

export default Story;
