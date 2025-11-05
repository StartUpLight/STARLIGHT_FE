import Landing from './_components/landing/Landing';

const page = () => {
  return (
    <div>
      <section className="relative h-[684px] w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/home.mp4"
          autoPlay
          muted
          playsInline
          loop
          preload="metadata"
        />
        <div className="absolute inset-0 z-10 bg-black/30" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Landing />
        </div>
      </section>

      <section className="h-[526px] bg-gradient-to-b from-black to-[#6F55FF] pt-[240px]" />
      <div className="h-[897px] px-[132px] py-[120px]">
        <div className="ds-heading font-semibold">항목별 체크리스트 </div>
      </div>
    </div>
  );
};

export default page;
