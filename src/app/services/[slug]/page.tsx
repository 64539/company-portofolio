import React from "react";
import { SERVICES_DETAIL } from "@/constants/services-detail";

export default function ServicePage({ params }: { params: { slug: string } }) {
  const detail = SERVICES_DETAIL[params.slug];

  if (!detail) {
    return (
      <section className="section-spacing">
        <div className="phi-container">
          <h1 className="text-3xl font-bold">Service Not Found</h1>
          <p className="text-white/60 mt-4">The requested service does not exist.</p>
        </div>
      </section>
    );
  }

  const accent =
    detail.color === "blue"
      ? "from-[#00f2fe] to-[#00a1ff]"
      : detail.color === "purple"
      ? "from-[#a56cff] to-[#7000ff]"
      : detail.color === "green"
      ? "from-[#37ffb0] to-[#00d38b]"
      : "from-[#ffb35a] to-[#ff6a00]";

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px] -z-10 opacity-20 bg-linear-to-r from-primary-start to-primary-end" />
      <div className="phi-container space-y-16">
        {/* Hero Detail */}
        <div className="space-y-6">
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-[-0.05em] leading-[0.95] uppercase text-center mx-auto max-w-4xl bg-clip-text text-transparent bg-linear-to-r">
            <span className={accent}>{detail.title}</span>
          </h1>
          <p className="text-white/60 text-lg max-w-3xl mx-auto text-center leading-relaxed">
            {detail.hero.description}
          </p>
          <div className="mx-auto w-fit px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase">
            Lead Expert: {detail.hero.leadExpert}
          </div>
        </div>

        {/* Expertise & Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Expertise</h3>
            <ul className="space-y-2 text-white/70">
              {detail.expertise.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Capabilities</h3>
            <ul className="space-y-2 text-white/70">
              {detail.capabilities.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
            <div className="flex flex-wrap gap-3">
              {detail.techStack.map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The Tech Flow (Process) */}
        <div className="glass rounded-2xl p-8 overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max">
            {detail.flow.map((step, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold">
                  {i + 1}. {step}
                </div>
                {i < detail.flow.length - 1 && (
                  <div className="h-[2px] w-16 bg-linear-to-r from-white/20 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
