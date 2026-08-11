/* Offline demo data — used when API_BASE is empty (no backend). */
export const DATA = {
  appVersion: "1.0.0",

  materials: [
    "Vinyl", "Flex", "Acrylic Signage", "LED", "ACP Panel",
    "One Way Vision", "Sunboard", "Fabric Backlit", "Glow Sign Board", "Vinyl on Sunboard"
  ],

  locations: [
    "Main Entrance", "Facade", "In-Store", "Pillar", "Ceiling",
    "Window Glass", "Cash Counter", "Wall - Left", "Wall - Right", "Backwall"
  ],

  locationTypeTabs: ["All", "WOD"],
  categoryTabs: ["OT", "MBO", "ISB"],

  modules: [
    { key: "fas", title: "FAS Installation", icon: "🏗️" },
    { key: "gsb", title: "GSB Preinstallation", icon: "📐" },
    { key: "installation", title: "Installation", icon: "🔧" },
    { key: "recce", title: "Recce", icon: "📋" }
  ],

  announcement: {
    title: "Welcome — OAMS Team",
    lines: [
      "APK Version: 1.0.0",
      "If the app misbehaves, clear cache from Settings and re-login.",
      "Always tap \"Refresh Master\" before starting a new day to get the latest store list & material checklist.",
      "Turn ON GPS & Camera permissions for photo capture to work."
    ]
  },

  tickets: {
    recce: [
      {
        ticketNo: "RCE-100245", storeCode: "STR-0451", storeName: "Reliance Trends - Andheri West",
        category: "MBO", date: "2026-08-09", status: "Pending", stage: "Recce",
        createdBy: "OAMS Coordinator", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223",
        tentativeDate: "2026-08-12", remarks: "Facade rebranding + in-store signage survey required.",
        itemSummary: [{ category: "Glow Sign Board", qty: 2 }, { category: "Vinyl", qty: 5 }, { category: "LED", qty: 3 }]
      },
      {
        ticketNo: "RCE-100251", storeCode: "STR-0478", storeName: "Croma - Powai",
        category: "OT", date: "2026-08-10", status: "Pending", stage: "Recce",
        createdBy: "OAMS Coordinator", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556",
        tentativeDate: "2026-08-13", remarks: "Measure main entrance and pillar wraps.",
        itemSummary: [{ category: "ACP Panel", qty: 1 }, { category: "One Way Vision", qty: 4 }]
      },
      {
        ticketNo: "RCE-100260", storeCode: "STR-0502", storeName: "Vijay Sales - Thane",
        category: "ISB", date: "2026-08-11", status: "Pending", stage: "Recce",
        createdBy: "OAMS Coordinator", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889",
        tentativeDate: "2026-08-14", remarks: "Full store audit before installation.",
        itemSummary: [{ category: "Flex", qty: 6 }, { category: "Acrylic Signage", qty: 2 }]
      }
    ],
    fas: [
      {
        ticketNo: "FAS-200110", storeCode: "STR-0311", storeName: "Big Bazaar - Malad",
        category: "OT", date: "2026-08-08", status: "Pending", stage: "FAS Installation",
        createdBy: "OAMS Coordinator", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223",
        tentativeDate: "2026-08-12", remarks: "FAS installation survey.",
        itemSummary: [{ category: "Glow Sign Board", qty: 1 }]
      }
    ],
    gsb: [
      {
        ticketNo: "GSB-300145", storeCode: "STR-0388", storeName: "DMart - Kandivali",
        category: "MBO", date: "2026-08-09", status: "Pending", stage: "GSB Preinstallation",
        createdBy: "OAMS Coordinator", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556",
        tentativeDate: "2026-08-13", remarks: "Pre-installation checks for glow sign board.",
        itemSummary: [{ category: "Glow Sign Board", qty: 2 }]
      }
    ],
    installation: [
      {
        ticketNo: "INS-400188", storeCode: "STR-0450", storeName: "Shoppers Stop - Ghatkopar",
        category: "ISB", date: "2026-08-10", status: "Pending", stage: "Installation",
        createdBy: "OAMS Coordinator", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889",
        tentativeDate: "2026-08-14", remarks: "Final installation of approved elements.",
        itemSummary: [{ category: "LED", qty: 4 }, { category: "ACP Panel", qty: 2 }]
      }
    ]
  }
};
