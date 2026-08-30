require("dotenv").config({ path: "../.env" });
const { createHoneyBatch, getBatchInfo } = require("./blockchain");

async function test() {
  console.log("🧪 Testing blockchain connection...");

  const result = await createHoneyBatch(
    "MH-2026-0182",
    87,
    {
      hiveId: "Hive A102",
      floralSource: "Mustard",
      harvestDate: "14 Aug 2026",
      location: "Rajasthan, India",
      sensorData: { temp: 34.2, humidity: 60, weight: 25.5 },
      trustScore: 87,
      beekeeperInfo: { name: "Test Beekeeper", verified: true }
    }
  );

  console.log("✅ Result:", result);

  const info = await getBatchInfo("MH-2026-0182");
  console.log("📱 Honey Passport:", info.honeyPassport);
}

test().catch(console.error);