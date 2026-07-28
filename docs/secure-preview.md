# Secure preview boundary

`@openforge/preview` allocates short-lived sessions on an origin separate from
the control plane. Every session carries an unpredictable token, fixed expiry,
iframe sandbox policy, CSP/browser headers, resource ceilings, and an explicit
egress-origin allowlist.

The runtime refuses executors unless they advertise and receive enforceable CPU,
memory, disk, timeout, process-isolation, and network-policy capabilities.
Production adapters must translate those limits to their container or sandbox;
an unrestricted child process cannot satisfy this interface.

Cross-window messages require an exact origin, strict versioned payload shape,
and matching session token. Logs recursively redact credential-shaped keys,
bearer values, common API-key formats, cycles, and oversized strings.

Production HTML is parsed with parse5 and all `data-openforge-*` development
selection attributes are removed structurally before serialization.
