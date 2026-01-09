# Quick Reference: Resume Upload Feature

## 🚀 Quick Start

### Normal Upload (First Time)
1. Upload CSV file
2. Review data
3. Click "Process Certificates"
4. Wait for completion

### Resume Upload (After Interruption)
1. **Re-upload the SAME CSV file**
2. See blue banner: "X records already processed"
3. Keep **"Skip already processed records"** checked ✅
4. Click "Process Certificates"
5. System automatically skips already uploaded records
6. Only processes new/remaining records

## 📊 Visual Indicators

| Icon | Meaning |
|------|---------|
| 🔵 Blue checkmark | Already processed (skipped) |
| ✅ Green checkmark | Newly processed this session |
| ❌ Red X | Failed processing |
| ✓ Small green check in SL No. | Record already in history |

## 🎛️ Controls

### Skip Checkbox (Review Step)
```
☑ Skip already processed records (recommended)
```
- **Checked (Default)**: Skips already uploaded records ✅
- **Unchecked**: Re-processes everything (may duplicate) ⚠️

### Clear History Button
```
[Clear History]
```
- Deletes all processing history for your wallet
- Use when you want to start fresh
- Cannot be undone ⚠️

## 📈 Statistics Display

### Processing Step
Shows current progress:
- "20 of 50 Certificates Processed"
- Progress bar
- Current student being processed

### Completion Step
Four metrics displayed:
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total        │ Newly        │ Skipped      │ Failed       │
│ Records      │ Processed    │              │              │
├──────────────┼──────────────┼──────────────┼──────────────┤
│ 50           │ 30           │ 20           │ 0            │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

## ⚙️ How It Works

### Record Identification
Each record is uniquely identified by:
```
Student Wallet + Degree Type + Graduation Year
```

Example:
```
29peNqmLi7xR...YTPj + "Bachelor of Technology" + "2026"
```

### Storage
- Stored in browser's localStorage
- Per wallet address (separate history per university)
- Includes: student info, IPFS hash, timestamp
- Survives browser refresh
- Deleted when browser cache is cleared

## 🎯 Common Scenarios

### Scenario 1: Internet Disconnected Mid-Upload
**Problem**: Uploaded 20 of 50, internet died
**Solution**: 
1. Re-upload same CSV
2. System detects 20 already processed
3. Automatically continues from record 21

### Scenario 2: Error on Specific Record
**Problem**: Record #25 failed, others succeeded
**Solution**:
1. Re-upload CSV
2. Records 1-24 skipped (already done)
3. Record 25 retried (not in history)
4. Records 26-50 skipped (already done)

### Scenario 3: Want to Re-upload Everything
**Solution**:
1. Option A: Uncheck "Skip already processed"
2. Option B: Click "Clear History" first

### Scenario 4: Different CSV File
**Note**: Resume works best with same CSV
- If student wallet + degree + year match → skipped
- Otherwise → processed as new

## ⚡ Pro Tips

1. **Always keep "Skip" checked** unless you specifically want duplicates
2. **Use same CSV file** for best resume experience
3. **Check blue banner** to see how many will be skipped
4. **Review completion statistics** to verify correct count
5. **Clear history** only when starting completely new batch
6. **Different browsers** have separate histories
7. **Switching wallets** creates separate histories

## 🐛 Troubleshooting

### "Not seeing already processed records?"
- Check if you're using the same wallet
- Check if you're using the same browser
- Verify student wallet + degree + year match exactly

### "Want to force re-upload?"
- Uncheck "Skip already processed records", OR
- Click "Clear History" button

### "History disappeared?"
- Browser cache was cleared
- Used different browser
- Used different wallet

### "Some records processing, some skipping?"
- Expected behavior!
- Records matching history = skipped
- New/failed records = processed

## 📝 Data Privacy

- All history stored **locally in your browser**
- Nothing stored on any server
- Specific to your wallet address
- Can be cleared anytime with "Clear History"

## 🎨 UI Flow

```
Upload CSV
    ↓
Parse & Check History
    ↓
Review Step
    ├─► Blue Banner (if duplicates found)
    ├─► Skip Checkbox
    ├─► Clear History Button
    └─► Table with indicators
    ↓
Processing
    ├─► Skip processed records
    └─► Upload new records
    ↓
Completion
    └─► Show statistics (Total/New/Skipped/Failed)
```

## 📞 Need Help?

Check the help section at the bottom of the Batch Upload Portal for:
- Processing time estimates
- Required fields explanation
- Storage information
- Resume feature details

---

**Remember**: The resume feature is **automatic** and works by default. Just re-upload your CSV file, and the system handles everything! 🎉
