/**
 * ============================================================================
 * Jobin & Amitha — Wedding RSVP Google Apps Script
 * Google Sheet: https://docs.google.com/spreadsheets/d/1aoZ3qD4LypZYenxXsvIrFbnzktEVGGs0s3UhL0DgCbU/edit
 * ============================================================================
 * 
 * HOW TO SET UP (പൂർണ്ണ വിവരണം താഴെ):
 * 1. Open Google Sheet:
 *    https://docs.google.com/spreadsheets/d/1aoZ3qD4LypZYenxXsvIrFbnzktEVGGs0s3UhL0DgCbU/edit
 * 
 * 2. In Sheet, Row 1 Column Headers (Column A, B, C):
 *    - Column A1: Timestamp
 *    - Column B1: Guest Name
 *    - Column C1: Attendance
 * 
 * 3. Menu-ൽ "Extensions" -> "Apps Script" ക്ലിക്ക് ചെയ്യുക.
 * 4. അവിടുള്ള കോഡ് മുഴുവൻ മാറ്റി ഈ ഫയലിലെ കോഡ് പൂർണ്ണമായി പേസ്റ്റ് ചെയ്യുക.
 * 5. Save (Floppy disk icon) അമർത്തുക.
 * 6. Top right blue button "Deploy" -> "New deployment" ക്ലിക്ക് ചെയ്യുക.
 * 7. "Select type" (Gear icon) -> "Web app" തിരഞ്ഞെടുക്കുക.
 * 8. Details:
 *    - Description: RSVP Web App
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (ഏറ്റവും പ്രധാനം: Anyone എന്ന് നൽകണം)
 * 9. "Deploy" ക്ലിക്ക് ചെയ്യുക (Google Account Authorize ചോദിച്ചാൽ നൽകുക).
 * 10. കിട്ടുന്ന "Web app URL" (ends with /exec) കോപ്പി ചെയ്ത് script.js-ലെ
 *     GOOGLE_SCRIPT_URL = '...'; എന്നതിൽ പേസ്റ്റ് ചെയ്യുക.
 * ============================================================================
 */

const SHEET_ID = '1aoZ3qD4LypZYenxXsvIrFbnzktEVGGs0s3UhL0DgCbU';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // 10 സെക്കൻഡ് ലോക്ക് വെയിറ്റ് ചെയ്യും (മൾട്ടിപ്പിൾ യൂസേഴ്സ് ഒരേ സമയം സബ്മിറ്റ് ചെയ്താലും തെറ്റില്ല)

  try {
    let sheet;
    try {
      sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    } catch (err) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    // ഷീറ്റ് കാലിയാണെങ്കിൽ Header Row ഓട്ടോമാറ്റിക് ആയി നൽകും
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Guest Name', 'Attendance']);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#f3e4a8');
    }

    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    const timestamp = data.timestamp || Utilities.formatDate(new Date(), 'Asia/Kolkata', 'yyyy-MM-dd HH:mm:ss');
    const name = data.name || 'Anonymous';
    const attendance = data.attendance || 'Not specified';

    // ഗൂഗിൾ ഷീറ്റിലേക്ക് പുതിയ വരി ആഡ് ചെയ്യുന്നു
    sheet.appendRow([timestamp, name, attendance]);

    return ContentService.createTextOutput(JSON.stringify({
      result: 'success',
      message: 'RSVP recorded successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput('Jobin & Amitha Wedding RSVP Web App is live!').setMimeType(ContentService.MimeType.TEXT);
}
