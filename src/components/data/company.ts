import {
  Building2,
  PenTool,
  Route,
  ClipboardList,
  Truck,
  Wrench,
} from "lucide-react";

export const company = {
  name: "CMTBuilders & RapidMix Concrete Solutions Inc.",
  shortName: "CMTBuilders",
  positioning: "An Integrated Construction and Infrastructure Solutions Partner",
  mobile: "+63 917 631 0707",
  mobileHref: "tel:+639176310707",
  telephone: "(02) 5310-5637",
  telephoneHref: "tel:+63253105637",
  email: "inquiry@thecmtbuilders.com",
  website: "www.thecmtbuilders.com",
  headquarters: {
    label: "Headquarters",
    lines: [
      "1908 Antel Global Corporate Center",
      "Dona Julia Vargas Avenue, Ortigas Center",
      "Pasig City, Philippines",
    ],
    mapQuery: "Antel Global Corporate Center, Ortigas Center, Pasig City",
  },
  branch: {
    label: "Branch Office",
    lines: ["By-Pass Road, Sitio 1", "Barangay Biday", "City of San Fernando, La Union"],
    mapQuery: "By-Pass Road, Sitio 1, Barangay Biday, San Fernando, La Union",
  },
};

export const navigation = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Equipment & Fleet", to: "/equipment" },
  { label: "Projects", to: "/projects" },
  { label: "Compliance", to: "/compliance" },
  { label: "Contact", to: "/contact" },
];

export const services = [
  {
    id: "general-construction",
    title: "General Construction",
    short:
      "Execution of residential, commercial, industrial, institutional, and mixed-use developments, from structural works to architectural finishes.",
    icon: Building2,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/0fd322a92_generated_b4ee9c17.png",
  },
  {
    id: "design-and-build",
    title: "Design and Build Services",
    short:
      "A single accountable engagement covering architectural, structural, civil, mechanical, electrical, plumbing, and specialty systems design through construction.",
    icon: PenTool,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/8c0e335c0_generated_c2402935.png",
  },
  {
    id: "infrastructure-site-development",
    title: "Infrastructure and Site Development",
    short:
      "Site preparation, land development, and infrastructure works supported by planning, equipment mobilization, and resource coordination.",
    icon: Route,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/1b2125066_generated_58c652a3.png",
  },
  {
    id: "project-management",
    title: "Project Management",
    short:
      "Planning, budgeting, cost control, scheduling, procurement, quality assurance, progress monitoring, reporting, and turnover coordination.",
    icon: ClipboardList,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/2d9def7d3_generated_09a1a591.png",
  },
  {
    id: "ready-mix-concrete",
    title: "Ready-Mix Concrete Supply",
    short:
      "Ready-mix concrete production and delivery through a portable batching plant, transit mixers, and concrete pumping equipment.",
    icon: Truck,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/96fa7d213_generated_89ebda87.png",
  },
  {
    id: "equipment-support",
    title: "Equipment Rental and Heavy Equipment Support",
    short:
      "Earthmoving, compaction, pile-driving, lifting, transport, and concrete equipment supporting project execution and site logistics.",
    icon: Wrench,
    image:
      "https://media.base44.com/images/public/6adf4e1a323dd7f47ef1a45f/a25ce2c4a_generated_f44a1a42.png",
  },
];

export const capabilities = [
  {
    title: "Engineering and technical expertise",
    text: "Licensed civil engineers and technical staff lead structural, civil, and multidisciplinary coordination across the project lifecycle.",
  },
  {
    title: "Construction execution",
    text: "Direct construction delivery covering site development, vertical construction, infrastructure works, fit-outs, and renovations.",
  },
  {
    title: "Project planning and cost management",
    text: "Scope definition, budgeting, scheduling, risk assessment, and resource allocation established before mobilization.",
  },
  {
    title: "Dedicated equipment resources",
    text: "An owned fleet spanning earthmoving, road construction, pile-driving, lifting, transport, and concrete production equipment.",
  },
  {
    title: "Concrete production and delivery",
    text: "Ready-mix concrete produced through a portable batching plant and delivered by transit mixers and pumping equipment.",
  },
  {
    title: "Logistics support",
    text: "Equipment mobilization, transport assets, and site support resources coordinated to keep work sequenced and supplied.",
  },
  {
    title: "Quality assurance and safety",
    text: "QA/QC processes, health, safety, and environment protocols, inspections, and operator competency requirements.",
  },
];

export const processStages = [
  {
    number: "01",
    title: "Project Planning and Cost Management",
    text: "Project evaluation, scope definition, budgeting, scheduling, risk assessment, and resource allocation.",
  },
  {
    number: "02",
    title: "Mobilization and Construction Execution",
    text: "Deployment of qualified personnel, equipment, materials, and support resources to the project site.",
  },
  {
    number: "03",
    title: "Quality Management and Safety Excellence",
    text: "HSE procedures, QA/QC processes, safety audits, training, inspections, and performance monitoring.",
  },
  {
    number: "04",
    title: "Project Monitoring, Control, and Reporting",
    text: "Monitoring of progress, productivity, costs, schedules, and key performance indicators throughout construction.",
  },
  {
    number: "05",
    title: "Project Turnover",
    text: "Inspections, testing, documentation, punch listing, commissioning, and client acceptance.",
  },
];

export const coverageRegions = [
  {
    name: "Ilocos Region",
    code: "Region I",
    note: "Supported directly by the San Fernando City, La Union branch office.",
  },
  {
    name: "Cordillera Administrative Region",
    code: "CAR",
    note: "Mountain terrain site development and infrastructure works.",
  },
  {
    name: "Central Luzon",
    code: "Region III",
    note: "Commercial, industrial, and institutional construction.",
  },
  {
    name: "National Capital Region",
    code: "NCR",
    note: "Headquarters location in Ortigas Center, Pasig City.",
  },
];

export const credentials = [
  {
    title: "PCAB Licensed Contractor",
    note: "Licensed in General Engineering and General Building.",
  },
  {
    title: "PCAB AAA Accredited",
    note: "Current PCAB accreditation classification stated in the corporate profile.",
  },
  {
    title: "Design-Build Capability",
    note: "In-house coordination of architectural, structural, civil, and MEP design disciplines.",
  },
  {
    title: "Ready-Mix Concrete Capability",
    note: "Batching plant, transit mixers, and concrete pumping equipment.",
  },
  {
    title: "Equipment Fleet and Logistics",
    note: "Earthmoving, lifting, transport, and concrete equipment with mobilization support.",
  },
  {
    title: "PhilGEPS Platinum Membership",
    note: "Registered with the Philippine Government Electronic Procurement System.",
  },
];

export const inquiryTypes = [
  "General Construction",
  "Design and Build",
  "Infrastructure and Site Development",
  "Project Management",
  "Ready-Mix Concrete",
  "Equipment Rental",
  "Partnership",
  "Other",
];