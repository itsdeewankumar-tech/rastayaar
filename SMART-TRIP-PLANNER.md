# Smart Trip Planner: behaviour and limitations

## What changed
- Results are ranked and limited to a short list instead of showing a long, noisy list.
- The default ranking prioritizes fewer bus changes, then fewer stops; a preference selector lets users prioritize fewer transfers, less walking, or lower estimated fare.
- A known Sultanabad access rule allows a user searching Sultanabad -> Fast University to board route R-9 at Tower and ride to Fast University. The result is labelled as one bus plus a walk to the boarding stop, not a bus stop at Sultanabad.
- Route and fare information remains based on RastaYaar's saved records and is not live service verification.

## AI integration note
This is an explainable local ranking algorithm, not a live generative-AI call. Do not put an OpenAI API key in browser code. A production AI advisor should be implemented through a server-side endpoint, with an API key stored in server environment variables. It should rank only journeys returned by the route engine, never invent bus routes or stops, and should return a fallback when route evidence is insufficient.

## Areas that are not bus stops
A general area can be used only when RastaYaar can map it to a known nearby boarding stop using verified coordinates or a reviewed area-to-stop access rule. Do not silently infer that a bus passes through an arbitrary map location. Add verified coordinates and a maximum walking distance before enabling automatic nearby-stop matching for more areas.

## Before release
- Verify that Sultanabad-to-Tower walking access is suitable for the exact origin the user means; Sultanabad is a broad area and the walk varies by starting point.
- Validate route R-9's current operation and stops before describing it as current service.
- Test direct, transfer, misspelled stop, and unknown-area searches.
