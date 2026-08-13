/* Offline demo data — used when API_BASE is empty (no backend). */
export const DATA = {
  appVersion: "2.0.0",

  // login mode radios (Deployment logic comes later; Recce is the live flow)
  loginModes: ["Deployment", "Recce"],

  // "What is it" — element / product types
  elementTypes: [
    "Sunboard", "Art Board", "Flex", "Acrylic Signage", "LED",
    "Vinyl", "ACP Panel", "Glow Sign Board", "One Way Vision", "Fabric Backlit"
  ],

  // "Jis cheez pe lagana hai" — surfaces / locations
  surfaces: [
    "Main Entrance", "Facade", "In-Store", "Pillar", "Ceiling",
    "Window Glass", "Cash Counter", "Wall - Left", "Wall - Right", "Backwall"
  ],

  announcement: {
    title: "Welcome — OAMS Team",
    lines: [
      "APK Version: 2.0.0",
      "Select a store, upload at least 5 store photos, then add elements.",
      "For each element upload 2 photos WITHOUT mark and 2 WITH mark.",
      "Add a remark at every step. Turn ON Camera & Gallery permissions."
    ]
  },

  // Store master (searchable list after login)
  stores: [
    { storeCode: "STR-0451", storeName: "Reliance Trends - Andheri West", city: "Mumbai", category: "MBO", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
    { storeCode: "STR-0478", storeName: "Croma - Powai", city: "Mumbai", category: "OT", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" },
    { storeCode: "STR-0502", storeName: "Vijay Sales - Thane", city: "Thane", category: "ISB", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889" },
    { storeCode: "STR-0311", storeName: "Big Bazaar - Malad", city: "Mumbai", category: "OT", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
    { storeCode: "STR-0388", storeName: "DMart - Kandivali", city: "Mumbai", category: "MBO", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" },
    { storeCode: "STR-0450", storeName: "Shoppers Stop - Ghatkopar", city: "Mumbai", category: "ISB", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889" },
    { storeCode: "STR-0561", storeName: "Croma - Vashi", city: "Navi Mumbai", category: "OT", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
    { storeCode: "STR-0604", storeName: "Reliance Digital - Borivali", city: "Mumbai", category: "MBO", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" }
  ],

  // minimum store photos required before submit
  minStorePhotos: 5
};
