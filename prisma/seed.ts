import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Turbine Nexus database…");

  // Create admin user
  const hashed = await bcrypt.hash("TurbineAdmin2024!", 12);
  await prisma.user.upsert({
    where: { email: "admin@turbinenexus.com" },
    update: {},
    create: {
      email: "admin@turbinenexus.com",
      password: hashed,
      name: "Turbine Nexus Admin",
      role: "admin",
    },
  });
  console.log("✅ Admin user created");

  const equipment = [
    {
      slug: "ge-lm6000-gas-turbine-45mw",
      title: "GE LM6000 Aero-Derivative Gas Turbine — 45 MW",
      manufacturer: "General Electric",
      equipmentType: "GasTurbine",
      model: "LM6000-PC Sprint",
      ratedPowerMW: 44.7,
      fuelType: "Natural Gas / Distillate",
      yearOfManufacture: 2008,
      operatingHours: 42500,
      condition: "Good",
      location: "United States",
      description:
        "A proven GE LM6000-PC Sprint aero-derivative gas turbine in good operating condition. This unit was operated by a major utility and decommissioned following a grid modernisation programme. It has been stored indoors with full preservation carried out. Ideal for peaking, combined heat and power, or industrial power applications. Full documentation package available including maintenance records and OEM service history.",
      keySpecs: JSON.stringify([
        { key: "ISO Base Rating", value: "44.7 MW" },
        { key: "Heat Rate (LHV)", value: "9,450 BTU/kWh" },
        { key: "Exhaust Flow", value: "448,000 lb/hr" },
        { key: "Exhaust Temperature", value: "855°F (457°C)" },
        { key: "Speed", value: "3,600 RPM" },
        { key: "Fuel", value: "Natural Gas / Distillate" },
        { key: "NOx Emissions", value: "<25 ppm (DLE)" },
        { key: "Dimensions (LxW)", value: "~30m x 7m (package)" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80",
      ]),
      status: "Available",
      featured: true,
      serialNumber: "LM6000-PCX-2008-0743",
      internalNotes:
        "Original owner: Midwest Power LLC. Seller motivated – floor at $3.8M. Full records available. Contact John D. for logistics.",
      sellerFloorPrice: 3800000,
      assetOwnerName: "Midwest Power LLC",
      assetOwnerContact: "john.doe@midwestpower.com",
    },
    {
      slug: "siemens-sgt-800-gas-turbine-50mw",
      title: "Siemens SGT-800 Industrial Gas Turbine — 50 MW",
      manufacturer: "Siemens",
      equipmentType: "GasTurbine",
      model: "SGT-800",
      ratedPowerMW: 50.5,
      fuelType: "Natural Gas",
      yearOfManufacture: 2012,
      operatingHours: 31200,
      condition: "Excellent",
      location: "Germany",
      description:
        "This Siemens SGT-800 industrial gas turbine is in excellent condition with relatively low operating hours. The unit was part of a combined cycle block that has been decommissioned due to a site closure. It has been fully inspected, with all hot gas path components recently serviced to OEM specifications. An exceptional opportunity for operators seeking a reliable, efficient mid-range gas turbine with full back-documentation.",
      keySpecs: JSON.stringify([
        { key: "ISO Base Rating", value: "50.5 MW" },
        { key: "Efficiency (simple cycle)", value: "38.3%" },
        { key: "Exhaust Temperature", value: "544°C" },
        { key: "Exhaust Mass Flow", value: "143 kg/s" },
        { key: "Speed", value: "6,500 RPM (geared)" },
        { key: "Fuel", value: "Natural Gas" },
        { key: "NOx Emissions", value: "<15 ppm (DLE)" },
        { key: "Compressor Stages", value: "15" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      ]),
      status: "Available",
      featured: true,
      serialNumber: "SGT800-2012-DE-4421",
      internalNotes:
        "Purchased from E.ON decommissioning. Full borescope records. Floor price €4.2M. Negotiable for quick deal.",
      sellerFloorPrice: 4500000,
      assetOwnerName: "E.ON Energy GmbH",
      assetOwnerContact: "assets@eon-decom.de",
    },
    {
      slug: "wartsila-50sg-gas-engine-18mw",
      title: "Wärtsilä 50SG Gas Engine — 18 MW",
      manufacturer: "Wärtsilä",
      equipmentType: "GasEngine",
      model: "18V50SG",
      ratedPowerMW: 18.5,
      fuelType: "Natural Gas",
      yearOfManufacture: 2015,
      operatingHours: 22800,
      condition: "Good",
      location: "Finland",
      description:
        "A well-maintained Wärtsilä 18V50SG spark-ignited gas engine generating set. This unit was operated on a long-term service agreement and has full LTSA records. Ideal for baseload distributed generation, industrial cogeneration, or islanded power schemes. All auxiliary systems (cooling, exhaust, fuel train) are intact and available as a package.",
      keySpecs: JSON.stringify([
        { key: "ISO Rated Power", value: "18.5 MWe" },
        { key: "Electrical Efficiency", value: "46.5%" },
        { key: "Cylinder Configuration", value: "18V (Vee)" },
        { key: "Bore x Stroke", value: "500mm x 580mm" },
        { key: "Speed", value: "500 RPM" },
        { key: "Fuel", value: "Natural Gas (pipeline quality)" },
        { key: "NOx Emissions", value: "<190 mg/Nm³" },
        { key: "Weight (engine)", value: "~310 tonnes" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      ]),
      status: "Available",
      featured: false,
      serialNumber: "W50SG-2015-FI-1837",
      internalNotes:
        "Wärtsilä LTSA documentation complete. Very clean unit. Owner: Nordic Power AS. Floor at €1.6M including auxiliaries.",
      sellerFloorPrice: 1600000,
      assetOwnerName: "Nordic Power AS",
      assetOwnerContact: "disposal@nordicpower.no",
    },
    {
      slug: "ge-d11-steam-turbine-120mw",
      title: "GE D11 Steam Turbine — 120 MW",
      manufacturer: "General Electric",
      equipmentType: "SteamTurbine",
      model: "D11",
      ratedPowerMW: 120.0,
      fuelType: "Steam",
      yearOfManufacture: 2003,
      operatingHours: 145000,
      condition: "Good",
      location: "United Kingdom",
      description:
        "A GE D11 tandem-compound steam turbine from a major UK coal-to-gas conversion site. The turbine has been subject to a comprehensive inspection and refurbishment programme. Key rotating components have been replaced or re-bladed. This is a large-scale asset suitable for combined cycle, industrial steam extraction, or waste-to-energy applications. Site disassembly can be arranged.",
      keySpecs: JSON.stringify([
        { key: "Rated Output", value: "120 MW" },
        { key: "Steam Inlet Pressure", value: "162 bar" },
        { key: "Steam Inlet Temperature", value: "538°C" },
        { key: "Reheat Temperature", value: "538°C" },
        { key: "Speed", value: "3,000 RPM" },
        { key: "Configuration", value: "Tandem-compound, double-flow LP" },
        { key: "Condenser Pressure", value: "50 mbar" },
        { key: "Last Major Overhaul", value: "2019" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&q=80",
      ]),
      status: "UnderNegotiation",
      featured: false,
      serialNumber: "GED11-2003-UK-0091",
      internalNotes:
        "Exclusive mandate from Drax Group. Site visit completed March 2024. Floor £5.5M. Logistics challenging – heavy lift required.",
      sellerFloorPrice: 6800000,
      assetOwnerName: "Drax Group plc",
      assetOwnerContact: "assets@drax.com",
    },
    {
      slug: "siemens-sst-600-steam-turbine-75mw",
      title: "Siemens SST-600 Steam Turbine — 75 MW",
      manufacturer: "Siemens",
      equipmentType: "SteamTurbine",
      model: "SST-600",
      ratedPowerMW: 75.0,
      fuelType: "Steam",
      yearOfManufacture: 2010,
      operatingHours: 58000,
      condition: "Excellent",
      location: "Netherlands",
      description:
        "A Siemens SST-600 industrial steam turbine in excellent condition with moderate run hours. This unit was decommissioned as part of a combined heat and power plant upgrade and has been carefully preserved in a climate-controlled warehouse. Suitable for industrial steam power, combined cycle bottoming cycle, or biomass/waste heat applications. Full Siemens documentation and CMMS data available.",
      keySpecs: JSON.stringify([
        { key: "Rated Output", value: "75 MW" },
        { key: "Live Steam Pressure", value: "120 bar" },
        { key: "Live Steam Temperature", value: "520°C" },
        { key: "Speed", value: "3,000 RPM" },
        { key: "Configuration", value: "Single-cylinder, single-flow" },
        { key: "Last Inspection", value: "2022 (Siemens certified)" },
        { key: "Control System", value: "Siemens SPPA-T3000" },
        { key: "Bearings", value: "New pads installed 2022" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
      ]),
      status: "Available",
      featured: true,
      serialNumber: "SST600-2010-NL-2267",
      internalNotes:
        "Excellent documentation. Seller is Dutch utility. Floor €3.1M. Can be sold with generator (Siemens SGen-1000A, 90 MVA).",
      sellerFloorPrice: 3100000,
      assetOwnerName: "Eneco B.V.",
      assetOwnerContact: "secondary@eneco.nl",
    },
    {
      slug: "man-es-18v4860ts-gas-engine-20mw",
      title: "MAN Energy Solutions 18V48/60TS Gas Engine — 20 MW",
      manufacturer: "MAN Energy Solutions",
      equipmentType: "GasEngine",
      model: "18V48/60TS",
      ratedPowerMW: 20.7,
      fuelType: "Natural Gas",
      yearOfManufacture: 2017,
      operatingHours: 18400,
      condition: "Excellent",
      location: "United Arab Emirates",
      description:
        "A near-new MAN Energy Solutions 18V48/60TS turbo-spark gas engine with very low operating hours. The unit was installed as emergency standby generation and has rarely been called upon. All OEM warranties (where applicable) and full service records are available. This represents one of the best-condition secondary market gas engine assets currently available. Suitable for baseload, peaking, or combined cycle applications.",
      keySpecs: JSON.stringify([
        { key: "ISO Rated Power", value: "20.7 MWe" },
        { key: "Electrical Efficiency", value: "50.3%" },
        { key: "Cylinder Configuration", value: "18V" },
        { key: "Bore x Stroke", value: "480mm x 600mm" },
        { key: "Speed", value: "500 RPM" },
        { key: "Fuel", value: "Natural Gas" },
        { key: "NOx Emissions", value: "<250 mg/Nm³ at 5% O₂" },
        { key: "Scope", value: "Complete genset including alternator" },
      ]),
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80",
      ]),
      status: "Available",
      featured: false,
      serialNumber: "MAN4860-2017-AE-3301",
      internalNotes:
        "Exceptional asset. Seller is Abu Dhabi-based developer. Floor $2.9M. Stored in Al Ain, UAE. Export permits required.",
      sellerFloorPrice: 2900000,
      assetOwnerName: "Al Wathba Power Development LLC",
      assetOwnerContact: "procurement@alwathbapower.ae",
    },
  ];

  for (const item of equipment) {
    await prisma.equipment.upsert({
      where: { slug: item.slug },
      update: {},
      create: item,
    });
    console.log(`✅ Equipment: ${item.title}`);
  }

  // Seed site settings (upsert so re-running is safe)
  const defaultSettings = [
    // ── Social ──
    { key: "linkedin_url",     value: "https://www.linkedin.com/company/turbine-nexus/", label: "LinkedIn URL",                    group: "social"  },
    { key: "telegram_url",     value: "",                                                  label: "Telegram URL / Username",         group: "social"  },
    { key: "wechat_id",        value: "",                                                  label: "WeChat ID / Link",                group: "social"  },

    // ── Contact ──
    { key: "sales_email",      value: "sales@turbinenexus.com",                           label: "Sales Email",                     group: "contact" },
    { key: "info_email",       value: "info@turbinenexus.com",                            label: "Info Email",                      group: "contact" },
    { key: "phone_display",    value: "",                                                  label: "Phone Number (footer)",           group: "contact" },
    { key: "phone_secondary",  value: "",                                                  label: "Secondary Phone Number",          group: "contact" },
    { key: "contact_address",  value: "",                                                  label: "Office Address",                  group: "contact" },

    // ── General / footer ──
    { key: "footer_tagline",   value: "Global specialists in the relocation and redeployment of surplus power generation equipment.", label: "Footer Tagline", group: "general" },
    { key: "footer_location",  value: "Global Operations — Serving 40+ Countries",        label: "Footer Location Text",            group: "general" },
    { key: "calendly_url",     value: "",                                                  label: "Calendly / Teams Booking URL",    group: "general" },

    // ── Hero (home page) ──
    { key: "hero_heading",     value: "Surplus Power Generation Equipment, Redeployed.",   label: "Hero Heading",                    group: "hero"    },
    { key: "hero_subheading",  value: "Turbine Nexus connects motivated sellers with strategic buyers of gas turbines, steam turbines, and power generation assets across 40+ countries.", label: "Hero Subheading", group: "hero" },

    // ── About page stats ──
    { key: "about_stat_mw",        value: "500+ MW",  label: "About Stat — Capacity Brokered", group: "about" },
    { key: "about_stat_countries", value: "40+",      label: "About Stat — Countries Served",  group: "about" },
    { key: "about_stat_years",     value: "15+",      label: "About Stat — Years Expertise",   group: "about" },
    { key: "about_stat_value",     value: "$800M+",   label: "About Stat — Assets Managed",    group: "about" },
    { key: "about_stat_clients",   value: "20+",      label: "About Stat — Clients Served",    group: "about" },

    // ── Integrations ──
    { key: "webhook_url",      value: "",  label: "Automation Webhook URL (n8n / Zapier / Make)", group: "integrations" },
  ];
  for (const s of defaultSettings) {
    await prisma.siteSettings.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log("⚙️  Site settings seeded");

  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
