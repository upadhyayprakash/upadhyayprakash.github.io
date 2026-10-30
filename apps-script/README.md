# Contact form (Google Apps Script)

The site has no backend. The footer's contact form posts to one Google Apps Script web app that appends rows to a Google Sheet. The code is `Code.gs` in this folder.

## Setup

1. Create a Google Sheet and rename its first tab `Messages` (the name must match exactly).
2. Add this header row: `Timestamp`, `Name`, `Email`, `Message`.
3. Open Extensions, Apps Script. Replace the editor's contents with `Code.gs` (`pbcopy < apps-script/Code.gs`) and save.
4. Deploy, New deployment, type Web app. Set Execute as: Me, and Who has access: Anyone. Approve the permissions.
5. Copy the `/exec` URL into `contactUrl` in `src/data/site.ts`. Until it is set, the form shows an error with the email address instead of sending.
6. Open the `/exec` URL in a browser. It should answer `portfolio contact form (v1)`.

## What the site sends

A `POST` with a form-encoded body and `mode: 'no-cors'`, so the browser never sees the reply: `name`, `email`, `message`, `hp` (a honeypot real visitors leave empty) and `t` (`performance.now()` in milliseconds).

## How a request is handled

1. Honeypot filled, or `t` under one second: dropped.
2. Name and message are cleaned, the email is validated and lower-cased, and a leading `=`, `+`, `-` or `@` gets an apostrophe so the sheet never runs it as a formula.
3. A script lock serialises writes and the tab has a cap of 5,000 rows.
4. Every drop writes its reason (never the content) to the execution log, and the answer is still `ok`.

## Changing the script

The deployed code is not this file until you paste it and publish. Use Deploy, Manage deployments, the pencil, Version: New version. A brand-new deployment gets a new URL. Bump the `doGet` version string so you can see the new code is live.

## Limits

Anyone who reads the page source can post to the URL. The honeypot, timing check, validation and row cap limit the damage but do not stop a determined spammer. The script cannot see IP addresses, so it cannot rate-limit per person.
