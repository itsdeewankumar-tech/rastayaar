import assert from "node:assert/strict";
import { loadRouteData } from "./load-route-data.mjs";
const { planTrip, ROUTES, AREAS, scoreMatch, getArea } = await loadRouteData(true);
let tests = 0;
const check = (name, fn) => {
  fn();
  tests++;
  console.log("PASS", name);
};
check("Gulberg → NIPA uses reverse F11 without Defence", () => {
  const p = planTrip("Gulberg", "NIPA", 30, "fewest-transfers").find(
    (p) => p.legs[0].route.code === "F-11",
  );
  assert(p);
  assert.equal(p.changes, 0);
  assert(!p.legs[0].stops.includes("Defence Mor"));
  assert.equal(p.legs[0].stops[0], "Gulberg");
});
check("Gulberg → NED: F11 to NIPA, then onward bus", () => {
  const p = planTrip("Gulberg", "NED University", 100, "fewest-transfers").find(
    (p) => p.legs[0].route.code === "F-11" && p.legs[0].to === "NIPA Chorangi",
  );
  assert(p);
  assert.equal(p.changes, 1);
  assert(!p.legs.flatMap((l) => l.stops).includes("Defence Mor"));
});
check("Water Pump → NIPA has direct F11 and G11", () => {
  const plans = planTrip("Water Pump", "NIPA");
  for (const code of ["F-11", "G-11"])
    assert(plans.some((p) => p.changes === 0 && p.legs[0].route.code === code));
});
check("Water Pump → NED ranks a one-change journey first", () =>
  assert.equal(planTrip("Water Pump", "NED")[0].changes, 1),
);
check("CBM / IoBM consistent in search and planner", () => {
  assert.equal(scoreMatch("CBM", "IoBM"), 100);
  assert.equal(scoreMatch("IoBM", "سی بی ایم"), 100);
  assert.deepEqual(
    planTrip("Tower", "CBM").map((p) => p.legs.map((l) => l.route.slug)),
    planTrip("Tower", "IoBM").map((p) => p.legs.map((l) => l.route.slug)),
  );
  assert(AREAS.some((a) => scoreMatch(a.name, "IoBM") === 100));
});
check("Urdu origin and destination aliases", () =>
  assert(planTrip("گلبرگ", "نیپا").some((p) => p.legs[0].route.code === "F-11" && p.changes === 0)),
);
check("Code search ignores hyphen R9 / R-9", () => assert.equal(scoreMatch("R-9", "R9"), 100));
check("Fare total sums every bus range", () => {
  const p = planTrip("Gulberg", "NED")[0];
  assert.equal(p.fare.min, 60);
  assert.equal(p.fare.max, 300);
});
check("Sorting: fewest stops and least fare", () => {
  for (const [pref, key] of [
    ["fewest-stops", "hops"],
    ["lower-fare", "fare"],
  ]) {
    const plans = planTrip("Korangi 6", "Saddar", 100, pref);
    assert(plans.length);
    if (key === "hops") assert.equal(plans[0].hops, Math.min(...plans.map((p) => p.hops)));
  }
});
check("No journey has repeated stops or reused services", () => {
  for (const p of planTrip("Water Pump", "NED", 100)) {
    assert.equal(new Set(p.legs.map((l) => l.route.slug)).size, p.legs.length);
    assert(p.legs.every((l) => l.stops.length > 1));
  }
});
check("Pink services copy matching Red stops and require explicit women-only inclusion", () => {
  const pink = ROUTES.filter((r) => r.category === "pink_bus");
  assert.equal(pink.length, 5);
  for (const p of pink) {
    const red = ROUTES.find((r) => r.category === "red_bus" && r.code === p.code);
    assert.deepEqual(p.stops, red.stops);
    assert.notEqual(p.stops, red.stops);
  }
  assert(
    planTrip("Tower", "Khokhrapar", 100).every((p) =>
      p.legs.every((l) => l.route.category !== "pink_bus"),
    ),
  );
  assert(
    planTrip("Tower", "Khokhrapar", 100, "balanced", { includeWomenOnly: true }).some((p) =>
      p.legs.some((l) => l.route.category === "pink_bus"),
    ),
  );
});
check("Imran includes Gulbai and complete supplied endpoints", () => {
  const r = ROUTES.find((r) => r.code === "Imran");
  assert(r.stops.includes("Gulbai"));
  assert.equal(r.stops[0], "Model Colony");
  assert.equal(r.stops.at(-1), "Machli Chowk");
});
check("Downtown corrections recorded on five services", () => {
  for (const code of ["Muslim", "R-1", "R-9", "Ilyas", "N-5"]) {
    const r = ROUTES.find((r) => r.code === code);
    for (const s of ["Arts Council", "Press Club", "Governor House"]) assert(r.stops.includes(s));
  }
});
check("Area links resolve stop spelling variants", () => {
  assert(getArea("nipa"));
  assert(getArea("nipa-chorangi"));
  for (const r of ROUTES)
    for (const stop of r.stops) {
      const slug = stop
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      assert(getArea(slug) || (slug === "korangi-6" && getArea("no-6")), stop);
    }
});
check("Blank, identical and unknown journeys", () => {
  assert.deepEqual(planTrip("", "NIPA"), []);
  assert.deepEqual(planTrip("CBM", "IoBM"), []);
  assert.deepEqual(planTrip("not a place", "NIPA"), []);
});
check("CBM to Sultanabad uses R10 then N5 at Metropole without New Afridi", () => {
  const plans = planTrip("CBM", "Sultanabad");
  assert(plans.length);
  assert(plans.every((p) => p.changes === 1));
  assert(
    plans.some(
      (p) =>
        p.legs.map((l) => l.route.code).join("|") === "R-10|N-5" && p.legs[0].to === "Metropole",
    ),
  );
  assert(plans.every((p) => p.legs.every((l) => l.route.code !== "New Afridi")));
});
check("Sultanabad to IoBM also connects at Metropole with one change", () => {
  const plans = planTrip("Sultanabad", "IoBM");
  assert(plans.length);
  assert(
    plans.some(
      (p) =>
        p.changes === 1 &&
        p.legs.map((l) => l.route.code).join("|") === "N-5|R-10" &&
        p.legs[0].to === "Metropole",
    ),
  );
});
check("FAST and Sultanabad offer R9 / N5 through Shaheen Complex in both directions", () => {
  for (const [from, to, codes] of [
    ["FAST", "Sultanabad", "R-9|N-5"],
    ["Sultanabad", "FAST", "N-5|R-9"],
  ]) {
    const plan = planTrip(from, to).find(
      (p) => p.legs.map((l) => l.route.code).join("|") === codes,
    );
    assert(plan);
    assert.equal(plan.changes, 1);
    assert.equal(plan.legs[0].to, "Shaheen Complex");
    assert.equal(plan.legs[1].from, "Shaheen Complex");
  }
});
check("Shiraz is one service and includes KU, NED, NIPA and Tower", () => {
  const shiraz = ROUTES.filter((r) => r.code === "Shiraz");

  assert.equal(shiraz.length, 1);

  for (const stop of ["Karachi University (KU)", "NED University", "NIPA", "Tower"]) {
    assert(shiraz[0].stops.includes(stop), `Shiraz missing ${stop}`);
  }

  assert(!ROUTES.some((r) => r.code === "Sheraz"));
  assert(!ROUTES.some((r) => r.code === "Shiraz (NIPA–NED segment)"));
});

check("Shiraz provides a direct journey between NED and Tower", () => {
  const plans = planTrip("NED University", "Tower", 100);

  assert(
    plans.some((p) => p.changes === 0 && p.legs.length === 1 && p.legs[0].route.code === "Shiraz"),
  );
});
console.log(`${tests} planner checks passed`);
