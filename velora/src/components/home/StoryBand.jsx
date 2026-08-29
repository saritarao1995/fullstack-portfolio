const StoryBand = () => (
  <section className="bg-ink text-parchment">
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
      <img
        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80"
        alt="Craftsman finishing a walnut cabinet"
        className="h-[420px] w-full rounded-3xl object-cover"
      />
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-sand">How we make</p>
        <h2 className="mt-3 font-display text-4xl leading-tight">
          Solid wood, honest stone, light that behaves.
        </h2>
        <p className="mt-5 text-sand">
          Furniture and light from the Kota showroom — edited down to what you will still love in
          ten years. Browse the collection, order online, or collect from Civil Lines when it is
          ready.
        </p>
        <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="font-display text-3xl">8</dt>
            <dd className="mt-1 text-xs uppercase tracking-widest text-sand">Pieces</dd>
          </div>
          <div>
            <dt className="font-display text-3xl">3</dt>
            <dd className="mt-1 text-xs uppercase tracking-widest text-sand">Rooms</dd>
          </div>
          <div>
            <dt className="font-display text-3xl">4wk</dt>
            <dd className="mt-1 text-xs uppercase tracking-widest text-sand">Lead time</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
);

export default StoryBand;
