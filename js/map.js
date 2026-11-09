// Vulnerability zone details for the schematic map (map.html)

const ZONES = {
  coastal: {
    title: "Zone A: Coastal & Fishpond Areas",
    level: "High exposure",
    tag: "high",
    description:
      "The southern part of Hagonoy facing Manila Bay, made up largely of fishponds, mangroves, and island-like settlements such as those in Pugad and Tibaguin. These are the lowest-lying areas in town.",
    risks: [
      "Regular tidal flooding, even on days without rain",
      "Storm surge during typhoons",
      "Fishpond dikes being overtopped or eroded",
      "Saltwater intrusion into wells",
      "Land permanently submerged as subsidence continues",
    ],
    actions: [
      "Elevate homes and keep valuables on higher floors",
      "Plant and protect mangroves as natural barriers",
      "Avoid digging new deep wells and use rainwater harvesting",
      "Know your evacuation route and follow MDRRMO tide and storm advisories",
    ],
  },
  river: {
    title: "Zone B: Riverside & Town Center",
    level: "Moderate to high exposure",
    tag: "mod",
    description:
      "Barangays along the Hagonoy River and its tributaries, including the busy town center (Poblacion). Floodwater from upstream in the Pampanga River basin passes through here on its way to the bay.",
    risks: [
      "River overflow combined with high tide",
      "Slow drainage as land and channels lose their slope",
      "Roads raised above homes and shops",
      "Cracks in buildings and damage to drainage pipes",
    ],
    actions: [
      "Keep canals and esteros free of garbage",
      "Report cracks, sinking structures, and blocked drainage to the barangay",
      "Conserve water and connect to piped surface-water supply where available",
      "Support river dredging and drainage maintenance programs",
    ],
  },
  inland: {
    title: "Zone C: Inland Barangays",
    level: "Moderate exposure",
    tag: "low",
    description:
      "The northern, inland part of the municipality, with more rice fields and residential areas. It sits slightly higher than the coast but rests on the same soft delta soils and the same aquifers.",
    risks: [
      "Seasonal flooding during the monsoon and typhoons",
      "Subsidence from local and regional groundwater pumping",
      "Salty or lower-quality well water over time",
    ],
    actions: [
      "Reduce groundwater use and fix leaking pipes and faucets",
      "Register wells with the proper authorities",
      "Practice rainwater harvesting for non-drinking uses",
      "Share awareness so that subsidence is prevented, not only reacted to",
    ],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("zone-info");
  const zones = document.querySelectorAll(".zone");

  function show(key) {
    const z = ZONES[key];
    zones.forEach((el) => el.classList.toggle("selected", el.dataset.zone === key));
    panel.innerHTML = `
      <span class="tag ${z.tag}">${z.level}</span>
      <h3>${z.title}</h3>
      <p>${z.description}</p>
      <h4>Main risks</h4>
      <ul>${z.risks.map((r) => `<li>${r}</li>`).join("")}</ul>
      <h4>What residents can do</h4>
      <ul class="check">${z.actions.map((a) => `<li>${a}</li>`).join("")}</ul>`;
  }

  zones.forEach((el) => {
    el.addEventListener("click", () => show(el.dataset.zone));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(el.dataset.zone);
      }
    });
  });
});
