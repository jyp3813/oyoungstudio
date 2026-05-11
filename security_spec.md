# Security Specification - Oyoung Studio

## 1. Data Invariants
- `settings/config` is read-only for public, writeable only by authorized admins.
- `projects` are read-only for public, writeable only by authorized admins.
- `admins` collection is only readable/writeable by existing admins (or the bootstrapped developer email).

## 2. The Dirty Dozen Payloads

### P1: Unauthorized Settings Write (Public)
**Target:** `settings/config`
**Payload:** `{ "siteName": "Hacked", "logoType": "text" }`
**Expected:** `PERMISSION_DENIED`

### P2: Unauthorized Project Creation (Public)
**Target:** `projects/new-id`
**Payload:** `{ "title": "Spam", "imageUrl": "http://evil.com/img.png" }`
**Expected:** `PERMISSION_DENIED`

### P3: Admin Identity Spoofing (Public)
**Target:** `admins/unauthorized-uid`
**Payload:** `{ "email": "evil@gmail.com", "role": "admin" }`
**Expected:** `PERMISSION_DENIED`

### P4: Shadow Field Injection in Project (Admin)
**Target:** `projects/valid-id`
**Payload:** `{ "title": "Valid", "imageUrl": "http://ok.com/i.png", "isFeatured": true, "extraInternalField": "secret" }`
**Exepcted:** `PERMISSION_DENIED` (if strict schema is enforced via `hasOnly`)

### P5: Invalid Enum for Setting LogoType (Admin)
**Target:** `settings/config`
**Payload:** `{ "logoType": "unsupported-type" }`
**Expected:** `PERMISSION_DENIED`

### P6: Giant String ID Poisoning (Public)
**Target:** `projects/` + "A".repeat(2000)
**Payload:** `{ "title": "Big ID" }`
**Expected:** `PERMISSION_DENIED` (via `isValidId`)

### P7: Resource Exhaustion - Long String (Admin)
**Target:** `projects/id`
**Payload:** `{ "title": "A".repeat(10001) }`
**Expected:** `PERMISSION_DENIED` (via `.size()` check)

### P8: Modifying Immutable Field - CreatedAt (Admin)
**Target:** `projects/id` (update)
**Payload:** `{ "title": "Updated", "createdAt": "2000-01-01T00:00:00Z" }`
**Expected:** `PERMISSION_DENIED`

### P9: Deleting Admins (Public)
**Target:** `admins/some-admin` (delete)
**Expected:** `PERMISSION_DENIED`

### P10: Bypassing Email Verification (Unverified User)
**Target:** `projects/id`
**Expected:** `PERMISSION_DENIED` (if `email_verified == true` is required)

### P11: Orphaned Project (No Reference Check)
**Target:** `projects/id`
**Payload:** (Missing required fields or invalid structure)
**Expected:** `PERMISSION_DENIED`

### P12: PII Leak - Reading Admin List (Public)
**Target:** `admins/some-admin` (get)
**Expected:** `PERMISSION_DENIED`
