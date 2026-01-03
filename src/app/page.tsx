import Landing from './_components/landing/Landing';
import LandingBlackSection from './_components/landing/LandingBlackSection';
import LandingChecklist from './_components/landing/LandingChecklist';
import LandingPaySection from './_components/landing/LandingPaySection';
import LandingRelation from './_components/landing/LandingRelation';

const page = () => {
  return (
    <div>
      <section className="relative h-[684px] w-full">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/images/landing/home.mp4"
          poster="/images/video_thumbnail.png"
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

      <LandingChecklist />
      <LandingBlackSection />
      <LandingPaySection />
      <LandingRelation />
    </div>
  );
};

export default page;
