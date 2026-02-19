export type ServiceDetail = {
  slug: string;
  title: string;
  color: "blue" | "purple" | "green" | "orange";
  hero: {
    description: string;
    leadExpert: string;
  };
  expertise: string[];
  capabilities: string[];
  flow: string[];
  techStack: string[];
};

export const SERVICES_DETAIL: Record<string, ServiceDetail> = {
  "fullstack-dev": {
    slug: "fullstack-dev",
    title: "Fullstack Development",
    color: "blue",
    hero: {
      description:
        "We engineer scalable neural architectures with edge-aware compute paths and uncompromising code quality. Our systems are designed to adapt, optimize, and evolve with your growth.",
      leadExpert: "Software by CTO Office",
    },
    expertise: [
      "Scalable Neural Architectures",
      "Edge Computing",
      "Clean Code Principles",
    ],
    capabilities: [
      "Distributed services & microfrontends",
      "Event-driven data pipelines",
      "Observability & resilience",
    ],
    flow: ["Discovery", "Synthesis", "Engineering"],
    techStack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
  },
  "ui-ux-design": {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    color: "purple",
    hero: {
      description:
        "We optimize cognitive load and craft neural aesthetics that translate behavior into delight. The outcome is interfaces that feel inevitable and frictionless.",
      leadExpert: "Design by CPO Office",
    },
    expertise: [
      "Cognitive Load Optimization",
      "Neural Aesthetics",
      "Interaction Architecture",
    ],
    capabilities: [
      "User research & journey mapping",
      "Design systems & components",
      "High-fidelity prototyping",
    ],
    flow: ["Discovery", "Synthesis", "Engineering"],
    techStack: ["Figma", "Spline", "Framer", "Storybook", "Tailwind"],
  },
  "video-editing": {
    slug: "video-editing",
    title: "Video Editing",
    color: "green",
    hero: {
      description:
        "Cinematic storytelling and post-production that captivates audiences and elevates brand narrative.",
      leadExpert: "Creative by CMO Office",
    },
    expertise: ["Visual Storytelling", "Post-Production", "Motion Graphics"],
    capabilities: [
      "Color grading",
      "Sound design",
      "Visual effects",
    ],
    flow: ["Concept", "Production", "Post-Production"],
    techStack: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Audition"],
  },
  "jastip-service": {
    slug: "jastip-service",
    title: "Jasa Titip (Jastip)",
    color: "orange",
    hero: {
      description:
        "Secure and reliable procurement service connecting you with global products seamlessly.",
      leadExpert: "Operations by COO Office",
    },
    expertise: ["Global Procurement", "Logistics Management", "Customs Handling"],
    capabilities: [
      "Product sourcing",
      "Secure payment",
      "Express delivery",
    ],
    flow: ["Request", "Procurement", "Delivery"],
    techStack: ["Custom Logistics Platform", "Payment Gateways", "Tracking Systems"],
  },
};
