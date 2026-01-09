# Resume Upload Feature - Batch Upload Portal

## Problem
When uploading a CSV file with 50 student records, if the upload process is interrupted (due to internet issues or other problems) after 20 records are successfully uploaded, re-uploading the same CSV file would start from the beginning, potentially creating duplicate NFTs for the first 20 students.

## Solution
Implemented a **Smart Resume System** that:

### 1. **Tracks Processed Records**
- Uses browser's `localStorage` to store successfully processed records
- Each record is uniquely identified by: `studentAddress + degreeType + graduationYear`
- Stored data includes: student info, IPFS hash, and timestamp
- Storage is per-wallet (each university's records are separate)

### 2. **Detects Already Processed Records**
When you upload a CSV file:
- The system automatically checks each record against the processing history
- Shows a notification like: "Found 20 already processed records out of 50 total"
- Displays already processed records with visual indicators (checkmark icon)

### 3. **Smart Skip/Resume Options**
In the Review step, you'll see:
- **Blue info banner** showing how many records were already processed
- **Checkbox option**: "Skip already processed records (recommended)" - checked by default
- **Clear History button**: If you want to force re-processing all records
- **Counter**: Shows exactly how many records will be processed vs skipped

### 4. **Processing Behavior**
During upload:
- **If skip is enabled** (default): Already processed records are skipped instantly
- **If skip is disabled**: All records are re-processed (creates duplicates)
- Skipped records are marked with "(Skipped)" label in the progress table
- Processing continues from where it left off automatically

### 5. **Results Display**
The completion summary shows:
- **Total Records**: Total in the CSV file
- **Newly Processed**: Records uploaded in this session
- **Skipped**: Records that were already uploaded previously
- **Failed**: Any records that encountered errors

Each result row shows:
- Blue checkmark for skipped records
- Green checkmark for newly processed records
- Red X for failed records
- "(Previously Uploaded)" label for skipped records

## How to Use

### Scenario 1: Internet Interruption (Your Case)
1. Upload your 50-student CSV file
2. Upload starts but stops at record 20 due to internet issues
3. **Re-upload the same CSV file**
4. System detects 20 records already uploaded
5. Shows message: "Found 20 already processed records out of 50 total"
6. Keep "Skip already processed records" checked ✅
7. Click "Process Certificates"
8. System automatically starts from record 21 and processes remaining 30 records

### Scenario 2: Force Re-upload Everything
1. Upload CSV file
2. System detects previously processed records
3. **Uncheck** "Skip already processed records"
4. Click "Process Certificates"
5. All 50 records will be re-processed (may create duplicates)

### Scenario 3: Clear History
1. In the Review step, click **"Clear History"** button
2. All processing history is deleted
3. Next upload will process all records as new

## Technical Details

### Storage Key Format
```javascript
`batch_upload_processed_${walletAddress}`
```

### Record Identification
```javascript
`${studentAddress}_${degreeType}_${graduationYear}`
```

### Stored Data Structure
```json
{
  "key": "studentAddress_degreeType_year",
  "studentName": "John Doe",
  "studentAddress": "29peNqm...",
  "degreeType": "Bachelor of Technology",
  "graduationYear": "2026",
  "timestamp": "2025-10-20T10:30:00.000Z",
  "ipfsHash": "QmXx..."
}
```

## Benefits

✅ **No Duplicates**: Prevents accidentally creating duplicate NFTs
✅ **Resume Capability**: Continue exactly where you left off
✅ **Visual Feedback**: Clear indicators of what's already processed
✅ **Flexible Options**: Can choose to skip or re-process
✅ **Per-Wallet Storage**: Each university has separate history
✅ **Persistent**: History survives browser refresh
✅ **Manual Override**: Can clear history when needed

## Important Notes

1. **Storage Location**: Uses browser's localStorage (persistent until cleared)
2. **Per Wallet**: Each wallet address has its own processing history
3. **Privacy**: All data stored locally in your browser, not on any server
4. **Browser Specific**: History is tied to the browser you use
5. **Clearing Cache**: Will delete processing history if you clear browser data
6. **Same CSV File**: Resume works best when using the exact same CSV file

## Testing the Feature

1. **Test Resume**: Upload half of a CSV file, cancel, then re-upload
2. **Test Skip**: Check that already processed records show checkmarks
3. **Test Re-process**: Uncheck skip option and verify all records process
4. **Test Clear**: Use Clear History button and verify history is deleted
5. **Test Multiple Wallets**: Switch wallets and verify separate histories

## UI Indicators

- 🟦 Blue banner: Already processed records detected
- ✅ Green checkmark: Newly processed in current session
- 🔵 Blue checkmark: Skipped (already processed previously)
- ❌ Red X: Failed processing
- 📝 "(Skipped)" label: Record was previously uploaded
- 📝 "(Previously Uploaded)" label: In completion table

## Future Enhancements (Optional)

- Export processing history as CSV
- Import processing history from another browser
- Cloud backup of processing history
- Email notifications for batch completion
- Retry failed records automatically
- Partial file upload (select specific records to process)
