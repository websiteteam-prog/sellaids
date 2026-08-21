/* Offline demo data — used when API_BASE is empty (no backend). */
export const DATA = {
  appVersion: "3.0.0",

  loginModes: ["Deployment", "Recce"],

  // "What is it" — element list (from client's Element List)
  elementTypes: [
    "SUNBOARD 3MM", "SUNBOARD 5MM", "VINYL", "ONEWAY VISION", "TRANSLIT",
    "FABRIC PRINT", "FABRIC BOX NEW", "GSB FLEX CHANGE", "GSB NEW", "GSB NEW D/S",
    "NONLIT BOARD", "NONLIT FLEX CHANGE", "ACP BOARD", "FROSTED VINYL",
    "LIT ACRYLIC HEADER", "IRON ANGLE", "LIT CLIPON", "SCAFFOLDING/CRANE",
    "ROCKET PILLAR", "REPAIR", "ACRYLIC SANDWICH", "LIT FLANGE"
  ],

  announcement: {
    title: "Welcome — OAMS Team",
    lines: [
      "APK Version: 3.0.0",
      "Select a store, add store photos (front + overview), then add elements.",
      "For each element pick the type, enter W x H, add photos and a remark.",
      "Add a remark at every step. Turn ON Camera & Gallery permissions."
    ]
  },

  // Store master (searchable list after login)
  stores: [
    { storeCode: "626425", storeName: "Sharma Electronics Store", address: "Opp. HDFC Bank, Chandigarh Road, Samrala (LDH)", phone: "9888908988, 9464681941", city: "Ludhiana", category: "Consumer Electronics", brand: "Mi", retType: "" },
    { storeCode: "STR-0478", storeName: "Croma - Powai", address: "Powai Plaza, Powai", phone: "022-99870 44556", city: "Mumbai", category: "OT", brand: "Croma", retType: "" },
    { storeCode: "STR-0451", storeName: "Reliance Trends - Andheri West", address: "Link Road, Andheri West", phone: "022-98200 11223", city: "Mumbai", category: "MBO", brand: "Reliance", retType: "" },
    { storeCode: "STR-0502", storeName: "Vijay Sales - Thane", address: "Station Road, Thane West", phone: "022-98330 77889", city: "Thane", category: "ISB", brand: "Vijay Sales", retType: "" },
    { storeCode: "STR-0311", storeName: "Big Bazaar - Malad", address: "Mindspace, Malad West", phone: "022-98200 11223", city: "Mumbai", category: "OT", brand: "Big Bazaar", retType: "" },
    { storeCode: "STR-0388", storeName: "DMart - Kandivali", address: "SV Road, Kandivali", phone: "022-99870 44556", city: "Mumbai", category: "MBO", brand: "DMart", retType: "" },
    { storeCode: "STR-0450", storeName: "Shoppers Stop - Ghatkopar", address: "R City Mall, Ghatkopar", phone: "022-98330 77889", city: "Mumbai", category: "ISB", brand: "Shoppers Stop", retType: "" },
    { storeCode: "STR-0604", storeName: "Reliance Digital - Borivali", address: "SV Road, Borivali West", phone: "022-99870 44556", city: "Mumbai", category: "OT", brand: "Reliance Digital", retType: "" }
  ],

  // Planned elements per store (admin loads these from the Excel import).
  // In Offline Mode the app shows these pre-filled; the field user just adds photos + a remark.
  storeElements: [
    { storeCode: "626425",   srNo: "1", brand: "Mi",    element: "GSB NEW",      width: 120, height: 36, qty: 1, sqft: 30,  remarks: "Main front board" },
    { storeCode: "626425",   srNo: "2", brand: "Mi",    element: "SUNBOARD 3MM", width: 48,  height: 24, qty: 2, sqft: 16,  remarks: "Side panels" },
    { storeCode: "626425",   srNo: "3", brand: "Mi",    element: "LIT CLIPON",   width: 36,  height: 36, qty: 1, sqft: 9,   remarks: "Entry clip-on" },
    { storeCode: "STR-0478", srNo: "1", brand: "Croma", element: "VINYL",        width: 60,  height: 18, qty: 1, sqft: 7.5, remarks: "Window vinyl" },
    { storeCode: "STR-0478", srNo: "2", brand: "Croma", element: "ACP BOARD",    width: 96,  height: 48, qty: 1, sqft: 32,  remarks: "Facade ACP" }
  ]
};
