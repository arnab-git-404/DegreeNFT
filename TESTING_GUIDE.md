# Testing Guide: Resume Upload Feature

## 🧪 Complete Testing Checklist

### Test 1: Basic Resume Functionality ✅

**Purpose**: Verify basic resume works after interruption

**Steps**:
1. Create a test CSV with 10 students
2. Upload the CSV file
3. Let 5 records process successfully
4. Close the browser tab (simulating interruption)
5. Re-open the portal
6. Upload the SAME CSV file again

**Expected Results**:
- ✅ Blue banner shows: "Found 5 already processed records out of 10 total"
- ✅ Skip checkbox is checked by default
- ✅ Counter shows: "Will process 5 new records"
- ✅ First 5 records in table show checkmark icon
- ✅ Processing skips first 5 instantly
- ✅ Only processes records 6-10
- ✅ Completion shows: Total=10, New=5, Skipped=5, Failed=0

---

### Test 2: Skip Toggle Functionality ✅

**Purpose**: Verify skip checkbox works correctly

**Steps**:
1. Upload CSV that has 5 already processed records
2. See the blue banner appear
3. **Uncheck** "Skip already processed records"
4. Click "Process Certificates"

**Expected Results**:
- ✅ All 10 records are processed (no skipping)
- ✅ Processing takes full time for all records
- ✅ May create duplicates (this is intentional)
- ✅ Completion shows: Total=10, New=10, Skipped=0

**Then**:
5. Re-upload the same CSV
6. **Check** "Skip already processed records"
7. Click "Process Certificates"

**Expected Results**:
- ✅ All 10 records are now skipped
- ✅ Processing is instant
- ✅ Completion shows: Total=10, New=0, Skipped=10

---

### Test 3: Clear History Functionality ✅

**Purpose**: Verify clearing history works

**Steps**:
1. Upload CSV with some already processed records
2. See blue banner showing duplicates
3. Click **"Clear History"** button
4. Observe the UI

**Expected Results**:
- ✅ Toast notification: "Processing history cleared"
- ✅ Blue banner disappears
- ✅ Checkmark icons disappear from table
- ✅ Counter shows: "Will process X records" (all of them)

**Then**:
5. Process the certificates
6. After completion, upload the same CSV again

**Expected Results**:
- ✅ No blue banner (history was cleared)
- ✅ All records process as new
- ✅ New history is created

---

### Test 4: Failed Record Retry ✅

**Purpose**: Verify failed records are retried, not skipped

**Setup**:
1. Temporarily disable internet AFTER 3 records process
2. Let records 4-5 fail
3. Re-enable internet
4. Upload same CSV again

**Expected Results**:
- ✅ Records 1-3: Skipped (successfully uploaded before)
- ✅ Records 4-5: Processed (failed before, not in history)
- ✅ Records 6-10: Processed (never attempted)
- ✅ Completion shows: Total=10, New=7, Skipped=3, Failed=0

---

### Test 5: Different Wallets ✅

**Purpose**: Verify history is per-wallet

**Steps**:
1. Connect with Wallet A
2. Upload CSV and process 5 records
3. **Disconnect and connect with Wallet B**
4. Upload the SAME CSV file

**Expected Results**:
- ✅ No blue banner (Wallet B has no history)
- ✅ All records show as new
- ✅ No checkmarks in table
- ✅ All records are processed

**Then**:
5. **Disconnect and reconnect with Wallet A**
6. Upload the same CSV file

**Expected Results**:
- ✅ Blue banner appears (Wallet A has history)
- ✅ Shows 5 already processed records
- ✅ Skip functionality works for Wallet A's history

---

### Test 6: Different Browsers ✅

**Purpose**: Verify history is browser-specific

**Steps**:
1. In Chrome: Upload and process 5 records
2. Open the portal in **Firefox**
3. Connect with same wallet
4. Upload the same CSV file

**Expected Results**:
- ✅ No blue banner in Firefox (localStorage is browser-specific)
- ✅ All records processed as new
- ✅ Firefox creates its own separate history

---

### Test 7: Large Batch Processing ✅

**Purpose**: Test with maximum allowed records

**Steps**:
1. Create CSV with 200 students (maximum allowed)
2. Upload and let 100 process
3. Interrupt (close browser)
4. Re-upload same CSV

**Expected Results**:
- ✅ Blue banner shows: "Found 100 already processed records"
- ✅ Processes remaining 100 records only
- ✅ No performance issues
- ✅ All data saves correctly
- ✅ Completion shows accurate statistics

---

### Test 8: Duplicate Detection Logic ✅

**Purpose**: Verify record identification works correctly

**Test Case A - Same Student, Same Degree, Same Year**:
```csv
studentAddress,degreeType,graduationYear
ABC123...,Bachelor of Technology,2026
```
Upload twice → **Should be detected as duplicate** ✅

**Test Case B - Same Student, Different Degree**:
```csv
studentAddress,degreeType,graduationYear
ABC123...,Bachelor of Technology,2026
ABC123...,Master of Technology,2027
```
→ **Should NOT be duplicate** (different degree type) ✅

**Test Case C - Same Student, Same Degree, Different Year**:
```csv
studentAddress,degreeType,graduationYear
ABC123...,Bachelor of Technology,2026
ABC123...,Bachelor of Technology,2027
```
→ **Should NOT be duplicate** (different year) ✅

---

### Test 9: UI Visual Indicators ✅

**Purpose**: Verify all visual elements work

**Check these elements**:
- ✅ Blue banner appears when duplicates detected
- ✅ Info icon in blue banner
- ✅ Skip checkbox renders and toggles
- ✅ Clear History button visible and clickable
- ✅ Small checkmark appears in SL No. column for processed records
- ✅ Opacity reduced on processed records when skip is enabled
- ✅ "(Skipped)" label in processing step
- ✅ Blue checkmark for skipped records
- ✅ Green checkmark for new records
- ✅ "(Previously Uploaded)" label in completion table
- ✅ Four statistics boxes render correctly

---

### Test 10: Edge Cases ✅

**Test Case A - Empty CSV**:
```csv
(headers only, no data)
```
**Expected**: Error message, no processing ✅

**Test Case B - All Records Already Processed**:
- Upload 10 records, complete successfully
- Upload same file again
**Expected**: 
- Blue banner: "Found 10 already processed records"
- With skip enabled: All skip instantly
- Completion: Total=10, New=0, Skipped=10, Failed=0 ✅

**Test Case C - No Records Processed Yet**:
- First time upload
**Expected**:
- No blue banner
- No skip checkbox needed
- All records process normally ✅

**Test Case D - LocalStorage Disabled**:
- Disable localStorage in browser settings
- Upload CSV
**Expected**:
- Feature gracefully degrades
- No errors thrown
- Processing works but no history saved
- Console shows error (handled) ✅

---

### Test 11: Performance Testing ⚡

**Purpose**: Verify no performance degradation

**Test with 200 records (100 already processed)**:

| Action | Expected Time |
|--------|--------------|
| File upload & parse | < 1 second ✅ |
| History check (100 records) | < 100ms ✅ |
| Display review screen | < 500ms ✅ |
| Skip 100 records | < 500ms total ✅ |
| Process 100 new records | ~11-12 minutes ✅ |
| localStorage save per record | < 10ms ✅ |

**Memory Usage**:
- ✅ localStorage: ~100KB for 200 records (negligible)
- ✅ No memory leaks during processing
- ✅ Browser remains responsive

---

### Test 12: Error Handling 🛡️

**Test Case A - Corrupt localStorage Data**:
1. Manually corrupt localStorage data in browser DevTools
2. Upload CSV

**Expected**:
- ✅ Try-catch prevents crash
- ✅ Console error logged
- ✅ Feature continues to work (starts fresh)

**Test Case B - Invalid IPFS Hash in History**:
1. Manually edit history to have invalid IPFS hash
2. Upload CSV with those records

**Expected**:
- ✅ Re-processes the record (treats as not found)
- ✅ Updates history with correct hash
- ✅ No errors thrown

**Test Case C - Network Failure During Processing**:
1. Process 5 records successfully
2. Disable internet
3. Let remaining records fail
4. Re-enable internet
5. Re-upload CSV

**Expected**:
- ✅ First 5 skipped (in history)
- ✅ Failed records retry (not in history)
- ✅ No duplicate of first 5

---

## 🎯 Acceptance Criteria

The feature is working correctly if:

✅ **Resume Functionality**
- [ ] Can resume after interruption
- [ ] Detects already processed records
- [ ] Skips processed records by default
- [ ] Only processes new/failed records

✅ **User Control**
- [ ] Can toggle skip on/off
- [ ] Can clear history
- [ ] Gets clear notifications
- [ ] Sees accurate counters

✅ **Visual Feedback**
- [ ] Blue banner for duplicates
- [ ] Checkmarks on processed records
- [ ] Color-coded status indicators
- [ ] Accurate statistics display

✅ **Data Integrity**
- [ ] No duplicates when skipping
- [ ] Per-wallet isolation
- [ ] Correct record identification
- [ ] Failed records retry correctly

✅ **Performance**
- [ ] Fast duplicate detection
- [ ] Instant skipping
- [ ] No UI lag
- [ ] Minimal storage usage

✅ **Error Handling**
- [ ] No crashes on corrupt data
- [ ] Graceful degradation
- [ ] Helpful error messages
- [ ] Console logging for debugging

---

## 🐛 Known Limitations

1. **Browser-Specific**: History doesn't sync across browsers
2. **Local Only**: No cloud backup of history
3. **Cache Dependent**: Cleared if browser cache is cleared
4. **Single Device**: Not synced across devices
5. **Manual Deletion**: Can't delete individual records from history (only all or none)

---

## 📝 Test Report Template

```markdown
## Test Execution Report

**Date**: 
**Tester**: 
**Environment**: 
**Browser**: 
**Wallet**: 

### Test Results

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Basic Resume | ⬜ Pass / ⬜ Fail | |
| 2 | Skip Toggle | ⬜ Pass / ⬜ Fail | |
| 3 | Clear History | ⬜ Pass / ⬜ Fail | |
| 4 | Failed Retry | ⬜ Pass / ⬜ Fail | |
| 5 | Different Wallets | ⬜ Pass / ⬜ Fail | |
| 6 | Different Browsers | ⬜ Pass / ⬜ Fail | |
| 7 | Large Batch | ⬜ Pass / ⬜ Fail | |
| 8 | Duplicate Detection | ⬜ Pass / ⬜ Fail | |
| 9 | UI Indicators | ⬜ Pass / ⬜ Fail | |
| 10 | Edge Cases | ⬜ Pass / ⬜ Fail | |
| 11 | Performance | ⬜ Pass / ⬜ Fail | |
| 12 | Error Handling | ⬜ Pass / ⬜ Fail | |

### Issues Found
1. 
2. 
3. 

### Overall Status
⬜ All Tests Passed ✅
⬜ Minor Issues Found ⚠️
⬜ Major Issues Found ❌

### Recommendations
- 
- 
- 
```

---

## 🚀 Quick Test Script

For rapid testing, use this test CSV:

```csv
universityName,studentName,studentAddress,degreeType,issueDate,graduationYear,cgpa,programDuration,major,honors
Test University,Alice Johnson,29peNqmLi7xRtQfyiibo4WTKwRDS9hWQ93iFZxq2YTPj,Bachelor of Technology,2025-10-20,2026,8.5,4 years,Computer Science,Dean's List
Test University,Bob Smith,3AB4Cdef5GH6ijKL7mnOP8qrST9uvWX0yzAbCdEfGhI1,Bachelor of Technology,2025-10-20,2026,7.8,4 years,Electrical Engineering,None
Test University,Carol Davis,4CD5Efgh6IJ7klMN8opQR9stUV0wxYZ1abCdEfGhIjK2,Bachelor of Technology,2025-10-20,2026,9.2,4 years,Mechanical Engineering,Gold Medal
Test University,David Wilson,5DE6Fghi7JK8lmNO9pqRS0tuVW1xyZA2bcDeFgHiJkL3,Bachelor of Technology,2025-10-20,2026,8.0,4 years,Civil Engineering,None
Test University,Emma Brown,6EF7Ghij8KL9mnOP0qrST1uvWX2yzAB3cdEfGhIjKlM4,Bachelor of Technology,2025-10-20,2026,8.8,4 years,Information Technology,President's Award
```

**Quick Test**:
1. Upload CSV → Process 3 records → Close browser
2. Re-upload CSV → Should skip 3, process 2 ✅

---

**Ready to test! Follow the checklist and verify all functionality works correctly.** 🎉
