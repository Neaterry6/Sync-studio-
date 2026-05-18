# Security Spec: Studio One

## Data Invariants
- **Users**: One profile per UID. Only the user can read/write their own profile. `storageUsed` should ideally be validated.
- **Projects**: Owned by a UID. Only the owner can read, write, or delete.
- **Project Versions**: Linked to a Project. Access inherited from Project ownership.
- **Assets**: Personal library items. Only the owner can access.

## The Dirty Dozen Payloads (Rejection Targets)
1. **Identity Spoofing**: `create` project with `ownerId: "attacker_uid"`.
2. **Unauthorized Read**: `get` project owned by another user.
3. **Blanket Query**: `list` projects without filtering by `ownerId`.
4. **Owner Hijack**: `update` project to change `ownerId`.
5. **Timestamp Tampering**: `update` project to change `createdAt`.
6. **Asset Injection**: `create` asset in `/users/victim_uid/assets/`.
7. **Resource Poisoning**: `create` project with `title` size > 1000 chars.
8. **Schema Bypass**: `create` project missing `type` field.
9. **PII Leak**: `get` another user's profile info.
10. **Orphaned Version**: `create` version with `projectId` that doesn't exist.
11. **Storage Trickery**: `update` User profile `storageLimit` to 1TB.
12. **Cross-User Versioning**: `create` version for a project owned by someone else.

## Test Runner (Logic)
- Every write must pass `isValid[Entity]`.
- Every read must be restricted to `request.auth.uid`.
- Timestamps must be `request.time`.
