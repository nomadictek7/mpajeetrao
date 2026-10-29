// Refreshes lib/parliament.json, the copy bundled with the site. The admin
// panel's "Refresh from Rajya Sabha" button does the same without a redeploy.
// Run: npm run parliament

import { writeFile } from "node:fs/promises";
import { fetchParliament } from "../lib/rajya-sabha.ts";

const out = await fetchParliament();
await writeFile(new URL("../lib/parliament.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`${out.attendance.length} sessions, ${out.questions.length} questions`);
