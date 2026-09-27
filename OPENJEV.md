# OpenJEV support

This fork adds **optional** [OpenJEV](https://openjev.sh) support alongside the
original TypeSafe integration. OpenJEV is a free community gateway to the same
Jev model built by TypeSafe. TypeSafe remains the default — anyone with a
TypeSafe key sees zero behaviour change.

## What was added

- `src/providers/openjev.ts` — `OpenJevProvider` adapter for the OpenJEV gateway
  (`POST https://api.openjev.sh/v1/systemone`, model `openjev`). Same
  `JevProvider` interface and request/response contract as `TypeSafeProvider`.
- `src/index.ts` — re-exports `OpenJevProvider` next to `TypeSafeProvider`.
- `src/providers/http.ts` — added HTTP `503` (OpenJEV unavailable) to the
  retryable statuses, alongside the existing `429`/`529` backoff.
- `.env.example` — documents `OPENJEV_API_KEY` and `JEV_PROVIDER=openjev`.
- `README.md` — short note after the intro, TypeSafe credited first.
- `package.json` — added `openjev` keyword.

No TypeSafe code was renamed, removed, or re-defaulted.

## Provider selection rule

jev-guard uses explicit provider instantiation — you construct the provider you
want and pass it to `guard()` / `enforce()` / the adapters. The convention is:

1. **Explicit choice wins** — `JEV_PROVIDER=openjev` (documented hint) or simply
   instantiating `OpenJevProvider`.
2. **Otherwise, if a TypeSafe key is set** → use `TypeSafeProvider` (unchanged
   default; the original behaviour).
3. **Otherwise, if only `OPENJEV_API_KEY` is set** → use `OpenJevProvider`.

```ts
import { guard, shellPolicy, OpenJevProvider } from 'jev-guard';

// key from https://openjev.sh/dashboard — never committed
const provider = new OpenJevProvider(process.env.OPENJEV_API_KEY!);
const { verdict } = await guard(call, shellPolicy(), provider);
```

## How to configure

Get a free key at https://openjev.sh/dashboard and set `OPENJEV_API_KEY` in your
environment (or `.env`). Then construct `OpenJevProvider` instead of
`TypeSafeProvider`. The model defaults to `openjev`; the endpoint defaults to
`https://api.openjev.sh/v1`.

## How it was verified

A live `POST https://api.openjev.sh/v1/systemone` request with model `openjev`,
state `ping`, and one `noul` question returned HTTP 200 with a valid answer.
The repo's own build/test scripts were **not** executed (third-party code is
never run during porting). A grep confirms no hardcoded `api.typesafe.ai`
default was introduced or left in the new code.

## Upstream

Original project: https://github.com/CMaintz/jev-guard by @CMaintz (MIT).
