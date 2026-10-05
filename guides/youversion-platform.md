# Build with YouVersion Platform

YouVersion Platform is the preferred Scripture provider for new initiative-supported efforts. Its free-access model does not grant unlimited use or blanket redistribution rights. This initiative is independent of YouVersion and grants no Bible license.

## Get your own access

Register your application in the [Platform portal](https://platform.youversion.com/), obtain its own App Key, and accept the applicable licenses. Follow the current [API usage guide](https://developers.youversion.com/api-usage). Requests authenticate with the `X-YVP-App-Key` header. Prefer a supported SDK when it fits the surface; use the documented REST API when it does not.

Keep credentials outside Git, PRs and logs. Use placeholders in examples. The central directory needs no Scripture credential. One project’s access does not authorize another project to reuse its key or license.

## Prove the content path

Before selecting a translation, verify catalog presence **and actual passage access for your app**. Metadata availability alone is not proof of a passage grant. Check app registration, applicable agreements, current quotas and Go Live requirements before production. Handle failures and rate limits without changing or fabricating Scripture; see [the official error guide](https://developers.youversion.com/error-codes).

## Render faithfully

Preserve returned Scripture text and required publisher attribution. For web display, follow [Display Bible HTML](https://developers.youversion.com/guides/display-bible-html): use the supported display model, supplied attribution, required stylesheets and container semantics. Retain poetry, notes and other supplied structure. Do not invent missing attribution or show an incomplete licensed display.

Review credential delivery for your surface, including stylesheet/font requests. Do not assume a backend passage proxy hides every credential. Use the provider’s supported design and restrictions; do not copy or self-host provider fonts to evade them.

## Check rights for the actual use

Verify offline storage, caching, audio, broadcasting, recording, redistribution, territory and commercial restrictions separately where relevant. A public catalog entry or a free app is not permission for every surface. Record unresolved rights honestly and keep synthetic placeholders in prototypes until the intended path is established.

## AI and test boundaries

Agents can write software and tests, research opportunities and operate the project. They must not generate Scripture, explanations, spiritual counsel or personalized verse recommendations. Those are initiative rules, not a substitute for reading the provider’s current agreement.

Use synthetic strings for directory tests. Live integration tests should prove passage access, required attribution, failure handling and faithful rendering without storing Scripture payloads, keys or reader activity in public artifacts. Record versions, test scope and limitations.

Official guides above were checked on 2026-10-05. Recheck before implementation or release; this guide contains no app-specific grant. The [public Roblox example](https://github.com/yvlabs/yvp-roblox-scripture-example) is a reusable integration starting point, not a license or production certification.
