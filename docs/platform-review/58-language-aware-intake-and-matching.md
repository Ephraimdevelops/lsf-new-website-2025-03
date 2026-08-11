# Language-Aware Intake and Matching

## What changed

- Added `preferredLanguage` to legal help requests.
- Added `preferredLanguageOther` so users can specify another support language.
- Mobile intake now asks for preferred support language before submission.
- Mobile intake requires a short language value when `other` is selected.
- Saved mobile intake drafts preserve the language preference in SecureStore.
- Staff triage shows the beneficiary's preferred support language.
- Assisted provider recommendations now add language-fit evidence when provider profile languages match Kiswahili or English.

## Why this matters

The app UI language is not always the same as the language a beneficiary wants for legal support. Capturing service language during intake helps staff assign providers who can communicate clearly and safely.

## Current behavior

- Supported intake values: `sw`, `en`, `both`, `other`.
- `other` stores a normalized free-text language name for staff routing.
- Existing records remain compatible because the schema field is optional.
- New submissions require the field so staff do not receive incomplete routing information.
- Matching gives an additional score boost and reason when provider languages match the request.

## Still not done

- Beneficiary profile-level persistent language preference.
- Language filters in the staff reassignment selector.
- Provider availability and language verification workflow.
