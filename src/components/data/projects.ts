export const projects = [
  {
    slug: "hinora-highlands-resort",
    title: "Hinora Highlands Resort",
    category: "Hospitality and Resort Development",
    filter: "Hospitality",
    location: "Pao Norte, San Fernando City, La Union",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/0f187da66_generated_8e65c987.png",
    summary:
      "A luxury hospitality development on a 21-hectare property in Pao Norte, San Fernando City, La Union, featuring a resort hotel and villa complex.",
    scope: [
      "Resort hotel and villa complex",
      "Site development across a 21-hectare property",
      "Structural and architectural works",
      "Supporting site infrastructure",
    ],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
  {
    slug: "camiguin-airport",
    title: "Camiguin Airport",
    category: "Aviation Infrastructure",
    filter: "Infrastructure",
    location: "Camiguin",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/adce59328_generated_9a7199dc.png",
    summary:
      "Airport infrastructure development involving runway works, terminal facilities, and supporting site works.",
    scope: ["Runway works", "Terminal facilities", "Site works and supporting infrastructure"],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
  {
    slug: "general-santos-airport",
    title: "General Santos Airport",
    category: "Aviation Infrastructure",
    filter: "Infrastructure",
    location: "General Santos City",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/cfc60ed7a_generated_0c51f5a3.png",
    summary:
      "Airport expansion and improvement works involving terminal construction, airside infrastructure, and utilities development.",
    scope: ["Terminal construction", "Airside infrastructure", "Utilities development"],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
  {
    slug: "pgh-building",
    title: "PGH Building",
    category: "Commercial and High-Rise Construction",
    filter: "Commercial",
    location: "Metro Manila",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/dae638cd3_generated_f428b615.png",
    summary:
      "A high-rise commercial tower involving structural, architectural, and MEP works delivered under a design-build arrangement.",
    scope: [
      "Structural works",
      "Architectural works",
      "Mechanical, electrical, and plumbing works",
      "Design-build delivery",
    ],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
  {
    slug: "afp-facilities",
    title: "AFP Facilities",
    category: "Institutional and Government-Related Facilities",
    filter: "Institutional",
    location: "Philippines",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/8d63bb038_generated_1d80f82e.png",
    summary:
      "Military facilities and support infrastructure delivered under security and compliance requirements.",
    scope: [
      "Facility construction",
      "Support infrastructure",
      "Security and compliance requirements",
    ],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
  {
    slug: "nha-housing-projects",
    title: "NHA Housing Projects",
    category: "Residential and Community Development",
    filter: "Residential",
    location: "Philippines",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/adced4ef0_generated_7c47b85e.png",
    summary:
      "Mass housing development involving site development, vertical construction, and community infrastructure.",
    scope: ["Site development", "Vertical construction", "Community infrastructure"],
    notes:
      "Project dates, contract values, and completion figures are not stated in the corporate profile and are therefore not published.",
  },
];

export const projectFilters = [
  "All",
  "Hospitality",
  "Infrastructure",
  "Commercial",
  "Institutional",
  "Residential",
];

export const getProject = (slug) => projects.find((project) => project.slug === slug);