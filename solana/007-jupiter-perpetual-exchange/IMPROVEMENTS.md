# Improvements: Jupiter Perpetual Exchange

## What Worked Well

- On-chain IDL fetch for typegen — zero friction, 60+ typed instructions generated instantly
- Typed decoders for complex nested params (Side enum, optional fields) — fully typed without manual parsing
- Each instruction has different account layouts (keeper vs owner vs signer) — typegen handles this perfectly

## Skills Update Consideration

- **Try/catch decode chain pattern**: When tracking multiple instruction types from one program, use a try/catch chain where each `decode()` throws if the d8 doesn't match. This is more robust than checking d8 manually because the decoder validates the full discriminator.
- **Stale IDL warning**: On-chain IDLs may not include the latest instructions if the program was upgraded but the IDL account wasn't updated. Always check Portal for unknown d8 values.

## No Skills Patch Applied

The existing skill documentation already covers typegen and decode patterns adequately. The try/catch chain is a standard pattern.
