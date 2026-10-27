export const equipmentCategories = [
  {
    id: "earthmoving",
    name: "Earthmoving and Excavation",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/a240867ba_generated_747dc82b.png",
    blurb:
      "Excavation, grading, and bulk earthworks equipment for site preparation and foundation works.",
    items: [
      { name: "Bulldozers", specs: [] },
      { name: "Wheel Loaders", specs: [] },
      { name: "Excavators", specs: [] },
      { name: "Backhoes", specs: [] },
      { name: "Underground Excavation Equipment", specs: [] },
    ],
  },
  {
    id: "road-compaction",
    name: "Road Construction and Compaction",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/f59fa97b0_generated_e54d7271.png",
    blurb:
      "Paving, grading, and compaction assets for road works, hardstands, and finished slab preparation.",
    items: [
      { name: "Motor Graders", specs: [] },
      { name: "Road Rollers", specs: [] },
      { name: "Tamping Rammers", specs: [] },
      { name: "Power Trowels", specs: [] },
    ],
  },
  {
    id: "pile-driving",
    name: "Pile-Driving and Specialized Equipment",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/498e26cb2_generated_2f78635e.png",
    blurb:
      "Foundation and specialized works equipment for deep foundations and constrained site conditions.",
    items: [
      { name: "Static Pile Drivers", specs: [] },
      { name: "Hydraulic Hammer Pile Drivers", specs: [] },
    ],
  },
  {
    id: "lifting",
    name: "Lifting Equipment",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/b0dce947c_generated_149f229c.png",
    blurb:
      "Crane and access equipment for structural erection, material handling, and elevated works.",
    items: [
      { name: "Mobile Cranes", specs: [] },
      { name: "Rough-Terrain Cranes", specs: [] },
      { name: "Tower Cranes", specs: [] },
      { name: "Boom Trucks", specs: [] },
      { name: "Forklifts", specs: [] },
      { name: "Manlifts and Aerial Work Platforms", specs: [] },
    ],
  },
  {
    id: "transport",
    name: "Transport Assets",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/626f3318e_generated_7f335610.png",
    blurb:
      "Hauling and mobilization assets supporting material movement, equipment transfer, and site logistics.",
    items: [
      { name: "Dump Trucks", specs: [] },
      { name: "Mini Dump Trucks", specs: [] },
      { name: "Flatbed Trailers", specs: [] },
      { name: "Prime Movers", specs: [] },
      { name: "Mobile Fuel Tankers", specs: [] },
    ],
  },
  {
    id: "concrete-production",
    name: "Concrete Production",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/085c9e5a8_generated_89329c4a.png",
    blurb:
      "Batching and mixing plant supporting ready-mix supply and on-site concrete production.",
    items: [
      {
        name: "Portable Concrete Batching Plant",
        specs: [{ label: "Listed capacity", value: "18 m³ per hour" }],
      },
      { name: "Concrete Mixers", specs: [] },
      { name: "Concrete Vibrators", specs: [] },
      { name: "Mortar Sprayers", specs: [] },
    ],
  },
  {
    id: "concrete-delivery",
    name: "Concrete Delivery and Pumping",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/4bdb55e7c_generated_1d4dcba3.png",
    blurb:
      "Delivery and placement equipment for structural concrete pours across project scales.",
    items: [
      {
        name: "Transit Mixers",
        specs: [{ label: "Listed drum capacity", value: "10 m³" }],
      },
      { name: "Concrete Pump Trucks", specs: [] },
      { name: "Stationary Concrete Pumps", specs: [] },
    ],
  },
  {
    id: "support",
    name: "Support Machinery and Utilities",
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/4c4ab4432_generated_20182013.png",
    blurb:
      "Site utilities, fabrication support, and access systems that keep works running through the shift.",
    items: [
      { name: "Generator Sets", specs: [] },
      { name: "Welding Machines", specs: [] },
      { name: "Air Compressors", specs: [] },
      { name: "Water Pumps", specs: [] },
      { name: "Scaffolding Systems", specs: [] },
      { name: "Lighting Towers", specs: [] },
    ],
  },
];

export const equipmentItems = equipmentCategories.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.name,
    categoryId: category.id,
  })),
);

export const equipmentSpecNote =
  "Equipment types are listed as documented in the corporate profile. Detailed specifications are issued on request and confirmed per unit before planning. Listed capacities describe equipment ratings and do not represent guaranteed daily production output.";