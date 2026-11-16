/**
 * Ambula Healthcare – Job application receiver
 * Saves each application as a row in this Google Sheet and stores
 * uploaded resumes in a Google Drive folder.
 *
 * Setup: see README.md (Extensions → Apps Script → paste → Deploy as Web app).
 */

const SHEET_NAME = 'Applications';
const RESUME_FOLDER_NAME = 'Ambula Paradeep – Applicant Resumes';

const COLUMNS = [
  ['Submitted At', 'submittedAt'],
  ['Reference', 'ref'],
  ['Position', 'position'],
  ['Full Name', 'fullName'],
  ['Mobile', 'mobile'],
  ['On WhatsApp', 'onWhatsapp'],
  ['Email', 'email'],
  ['Date of Birth', 'dob'],
  ['Gender', 'gender'],
  ['Current Location', 'location'],
  ['Qualification', 'qualification'],
  ['Institute', 'institute'],
  ['Year of Passing', 'passYear'],
  ['Council Reg. No.', 'regNo'],
  ['Experience', 'expYears'],
  ['Pre-employment Medicals Before', 'preEmpExp'],
  ['Current / Last Workplace', 'employer'],
  ['Current Salary (₹/month)', 'currentSalary'],
  ['Can Join', 'notice'],
  ['Tests Can Do', 'tests'],
  ['Machines Used', 'machines'],
  ['Languages', 'languages'],
  ['Source', 'source'],
  ['Remarks', 'remarks'],
  ['Resume', 'resumeUrl'],
  ['Status', 'status']
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.fullName || !data.mobile || !data.position) {
      return json_({ result: 'error', error: 'Missing required fields' });
    }

    data.submittedAt = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd-MMM-yyyy HH:mm');
    data.status = 'New';
    data.resumeUrl = '';

    if (data.resumeData) {
      const bytes = Utilities.base64Decode(data.resumeData);
      if (bytes.length > 5 * 1024 * 1024) {
        return json_({ result: 'error', error: 'Resume larger than 5 MB' });
      }
      const safeName = String(data.fullName).replace(/[^\w\s-]/g, '').trim();
      const ext = String(data.resumeName || '').split('.').pop();
      const blob = Utilities.newBlob(bytes, data.resumeType, `${data.ref} - ${safeName}.${ext}`);
      data.resumeUrl = getFolder_().createFile(blob).getUrl();
    }

    const sheet = getSheet_();
    // Prefix with ' so phone numbers and values starting with = are stored as text.
    const row = COLUMNS.map(([, key]) => {
      const v = data[key] == null ? '' : String(data[key]);
      return /^[=+\-@]|^\d{10}$/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(row);

    return json_({ result: 'success', ref: data.ref });
  } catch (err) {
    return json_({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ result: 'ok', message: 'Ambula application receiver is running.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([h]) => h));
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#E8EDFF').setFontColor('#0743A1');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getFolder_() {
  const it = DriveApp.getFoldersByName(RESUME_FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(RESUME_FOLDER_NAME);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the header row and grant Drive permission. */
function setup() {
  getSheet_();
  getFolder_();
}
