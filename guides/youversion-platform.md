# Build with YouVersion Platform

YouVersion Platform is the preferred Scripture provider for new initiative-supported efforts. Its free-access model does not grant unlimited use or blanket redistribution rights. This initiative is independent of YouVersion and grants no Bible license.

## Sign up and get an App Key

1. Use an account owned by your operator. Create or sign in to a YouVersion account, then open [platform.youversion.com](https://platform.youversion.com/) and choose **Join the YouVersion Platform**. The [official signup instructions](https://help.youversion.com/l/en/article/72ghg45c41-how-to-sign-up-for-platform) describe the prerequisites and flow.
2. Choose Individual or Organization accurately. Complete the required identity/address fields and review the Platform requirements and Terms. Do not invent an organization, legal identity or authority to accept agreements. The signup guide currently requires noncommercial app use without advertisements, paywalls or subscriptions; verify the terms for your actual use.
3. Create an app in the portal and describe its purpose and use case. Obtain the App Key assigned to that app, following [the authentication guide](https://developers.youversion.com/authentication). Portal details may change; do not assume a particular button label beyond the documented signup flow.
4. Review the available Bible licenses/collections for that app and accept the appropriate agreements. Then verify the selected version's actual passage access. A key or catalog listing alone does not establish rights for a translation or delivery surface.
5. Supply the key through your project's configuration. API requests use the `X-YVP-App-Key` header; SDKs receive it through their documented configuration. Prefer a supported SDK when it fits the surface; otherwise follow [API usage](https://developers.youversion.com/api-usage).
6. Before production, complete the app's current Go Live requirements and check quotas in the portal. Record the operator, app registration, configuration location and verified access without publishing the key value.

The directory and workshop tools need no App Key. Agents without account access can build with synthetic fixtures and return code; the accountable operator supplies the app registration and runtime configuration. An agent should stop for human-only verification or agreement authority it does not have.

## App Keys: configuration, visibility and ownership

**Initiative policy:** treat an App Key as controlled, app-specific configuration. It is not an account password or a user session token. Nevertheless, it authenticates API requests and is associated with app access and rate limits, so do not publish a working key in source, records, issues, logs or contribution packages.

This is a repository policy, not a claim that YouVersion classifies every App Key as a server-only secret. Official [Swift setup](https://developers.youversion.com/sdks/swift/quick-start) passes a key to a client SDK; [web display guidance](https://developers.youversion.com/guides/display-bible-html) includes it in browser requests and the font stylesheet URL. **Inference:** these supported client integrations expose the key to users of the delivered app. Environment variables, CI storage and build injection keep it out of Git, but cannot make a browser bundle or distributed mobile binary confidential.

| Location | Recommended handling |
| --- | --- |
| Public code, examples and packages | Placeholder or configuration variable only. Never supply a shared initiative key. |
| Local development | Operator-provided environment variable or ignored local config, outside the contribution folder. Do not print it or embed it in shell history. |
| CI and hosted services | Project-scoped secret/config store; restrict access and inject only into authorized builds/runtimes. Using a secret store is convenient custody, not proof of runtime secrecy. |
| Browser/mobile app | Supply through the build or runtime configuration expected by the SDK. Document expected client visibility; do not call a bundled value hidden. |
| Server integration | Keep the value in server-side configuration. Use a backend when the product needs server control of requests or quotas; inspect client resource delivery too, and preserve the provider's supported font/rendering path. |

Each independently operated app uses its own registration/key. The workshop does not lend keys to contributors. For separate development/staging/production registrations, use the portal's supported options and document their ownership; do not assume multiple keys or restrictions are available. A key never substitutes for user authorization to an app's private features.

Monitor usage and handle `429` responses as documented. If a key appears in public source, remove the value and assess unintended use; replace/revoke it through supported portal controls or Platform support when warranted. Changing a config file does not erase Git history. Expected visibility in a supported client integration is different from accidentally publishing a reusable key in a source repository. Do not invent domain/IP restrictions or rotation capabilities not verified in the portal.

### Configuration example (server/tooling)

Keep the real value in the operator's environment. This example neither prints it nor makes a request:

```js
const appKey = process.env.YVP_APP_KEY;
if (!appKey) throw new Error("Set YVP_APP_KEY in the operator's environment");
const headers = { "X-YVP-App-Key": appKey };
// Pass headers to the documented API client; never log headers or appKey.
```

Browser frameworks need their own public build/runtime configuration mechanism; `process.env` is not automatically available in a browser. Record the variable name, injection method and expected visibility in each project's README, without the value. Hosted builds must use a hosted configuration store rather than depend on an operator's workstation.

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

Signup, authentication, API usage, Swift setup and web display sources were checked on 2026-10-06. Other links were checked on 2026-10-05. Recheck before implementation or release; this guide contains no app-specific grant. The [public Roblox example](https://github.com/yvlabs/yvp-roblox-scripture-example) is a reusable integration starting point, not a license or production certification.
