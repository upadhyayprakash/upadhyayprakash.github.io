/**
 * Portfolio contact form (Google Apps Script web app).
 * Appends one row per message to the "Messages" tab of the bound spreadsheet.
 * Deploy as: Execute as "Me", Who has access "Anyone".
 *
 * The endpoint URL is public, so everything below assumes hostile input.
 *
 * @OnlyCurrentDoc limits the permission to this one spreadsheet.
 */
const SHEET_NAME = 'Messages'
const MAX_NAME = 120       // characters kept for a name
const MAX_EMAIL = 254      // longest valid email address
const MAX_MESSAGE = 4000   // characters kept for a message
const MAX_ROWS = 5000      // hard cap so a flood cannot fill the sheet
const MIN_MS = 1000        // faster than this since page load is a bot
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Opening the web app URL in a browser shows which code is deployed. It reads and writes nothing.
function doGet() {
  return ContentService.createTextOutput('portfolio contact form (v1)')
}

function doPost(e) {
  const p = (e && e.parameter) || {}

  // Honeypot: real visitors never see or fill this field.
  if (p.hp) return drop_('honeypot filled')

  // Too fast to be a person typing.
  if (!(Number(p.t) >= MIN_MS)) return drop_('submitted too fast (t=' + p.t + ')')

  const name = line_(p.name, MAX_NAME)
  const email = String(p.email || '').trim().toLowerCase()
  // Line breaks are kept in a message; other control characters are not.
  const message = String(p.message || '')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, MAX_MESSAGE)

  if (name.length < 2) return drop_('name too short')
  if (email.length > MAX_EMAIL || !EMAIL_RE.test(email)) return drop_('not a valid email')
  if (message.length < 2) return drop_('message too short')

  const lock = LockService.getScriptLock()
  if (!lock.tryLock(5000)) return drop_('could not get the lock')
  try {
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME)
    if (!sheet) return drop_('tab not found: ' + SHEET_NAME)
    if (sheet.getLastRow() > MAX_ROWS) return drop_('row cap reached')
    const row = sheet.getLastRow() + 1
    // Plain-text format so a cell is never parsed as a formula or date.
    sheet.getRange(row, 1, 1, 4).setNumberFormat('@')
      .setValues([[new Date().toISOString(), safe_(name), safe_(email), safe_(message)]])
    console.log('message: saved one row')
  } finally {
    lock.releaseLock()
  }
  return ok_()
}

// One line of plain text.
function line_(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

// Spreadsheet formula injection: neutralise leading = + - @ (OWASP guidance).
function safe_(text) {
  return /^[=+\-@]/.test(text) ? "'" + text : text
}

// Records why a request was ignored (reasons only, never the content), then answers the same way.
function drop_(reason) {
  console.log('dropped: ' + reason)
  return ok_()
}

// Always answer the same way so attackers learn nothing from responses.
function ok_() {
  return ContentService.createTextOutput('ok')
}
