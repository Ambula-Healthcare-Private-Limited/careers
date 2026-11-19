# Ambula Healthcare – Paradeep Job Application Form

Online application form for **Lab Technician (MLT)** and **X-Ray Technician (MRT)** openings at the Diagnostic Center, JSW Utkal Steel Ltd Project Site, Paradeep. Responses go to a Google Sheet; resumes go to a Google Drive folder.

```
index.html               ← the form (host this on GitHub Pages)
assets/ambula-logo.png   ← add your logo here (see below)
apps-script/Code.gs      ← paste into the Google Sheet's Apps Script
```

**Logo:** save the Ambula logo PNG (the one on ambula.app) as `assets/ambula-logo.png` in the repo. If that file is missing, the form loads the logo from ambula.app instead, and if that also fails it shows an "AMBULA" wordmark.

## 1. Connect the Google Sheet (about 5 minutes)

1. Create a new Google Sheet, for example **Ambula Paradeep – Applications**.
2. In the sheet, open **Extensions → Apps Script**.
   (If you already set up the earlier version, delete the old `Applications` tab first so the new column headers are created.)
3. Delete the sample code, paste everything from `apps-script/Code.gs`, and click **Save**.
4. In the function dropdown pick **setup** and click **Run**. Approve the permissions (Sheets + Drive). This creates the `Applications` tab with headers and the resume folder in your Drive.
5. Click **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
7. Open `index.html`, find this line near the bottom and paste the URL:
   ```js
   const SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

> If you change `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## 2. Publish on GitHub Pages

1. Create a GitHub repository (e.g. `ambula-careers`) and upload `index.html` to it.
2. Go to **Settings → Pages** → Source: **Deploy from a branch** → Branch: `main` / root → **Save**.
3. After a minute your form is live at `https://<your-username>.github.io/ambula-careers/`.

Share that link on WhatsApp, job portals and social media.

## What the sheet records

Each submission adds one row: date/time (IST), reference number (e.g. `AMB-261116-K3QZ`), position, contact details, date of birth, current location, qualification, experience (including prior pre-employment medicals), current salary (optional), joining time, tests the candidate can do and machines they have used (separate lists for MLT and MRT), languages, source, remarks, a link to the uploaded resume, and a **Status** column (starts as `New`) for HR to update as Shortlisted / Interviewed / Selected / Rejected.

## Notes

- To change the JD, test lists or machine lists, edit the `ROLES` block near the bottom of `index.html`.
- The query contacts (careers@ambula.app, +91-8144301610) appear in the job card, the footer (with a WhatsApp chat button), the thank-you message and error messages.

- Until `SCRIPT_URL` is set, the form validates input but shows "Applications are not open yet" on submit.
- Resume upload is required; PDF, DOC, DOCX, JPG or PNG up to 5 MB.
- Applicant data is personal information. Share the sheet and the resume folder only with the HR team.
