# Batch Upload Resume Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INITIAL UPLOAD (Interrupted)                  │
└─────────────────────────────────────────────────────────────────┘

Upload CSV (50 students)
│
├─► Record 1-20: ✅ Successfully Uploaded → Saved to localStorage
│
└─► Record 21-50: ❌ INTERRUPTED (Internet/Error)


┌─────────────────────────────────────────────────────────────────┐
│                    RE-UPLOAD (With Resume Feature)               │
└─────────────────────────────────────────────────────────────────┘

Upload Same CSV (50 students)
│
├─► System checks localStorage
│   │
│   └─► Found 20 records already processed ✓
│
├─► REVIEW STEP
│   │
│   ├─► Show blue banner: "20 records already processed"
│   ├─► Display checkbox: ☑ "Skip already processed records"
│   ├─► Show counter: "Will process 30 new records"
│   └─► Table shows records with ✅ icon for already processed
│
└─► PROCESSING STEP
    │
    ├─► Records 1-20:  ⏭️  SKIPPED (shown as "Skipped")
    │                      └─► Uses cached IPFS hash
    │
    └─► Records 21-50: 🔄 PROCESSING
                          └─► Upload to IPFS
                          └─► Create NFT allocation
                          └─► Save to localStorage


┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETION SUMMARY                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ Total: 50    │ New: 30      │ Skipped: 20  │ Failed: 0    │
└──────────────┴──────────────┴──────────────┴──────────────┘

Result Table:
┌─────┬──────────────┬──────────────────┬─────────────┬──────────┐
│ # 1 │ John Doe     │ Btech CSE        │ QmXx...     │ (Skip)   │ 🔵
│ # 2 │ Jane Smith   │ Btech IT         │ QmYy...     │ (Skip)   │ 🔵
│ ... │ ...          │ ...              │ ...         │ ...      │
│ #20 │ Bob Johnson  │ Btech ECE        │ QmZz...     │ (Skip)   │ 🔵
├─────┼──────────────┼──────────────────┼─────────────┼──────────┤
│ #21 │ Alice Brown  │ Btech Mech       │ QmAa...     │ New      │ ✅
│ #22 │ Charlie Lee  │ Btech Civil      │ QmBb...     │ New      │ ✅
│ ... │ ...          │ ...              │ ...         │ ...      │
│ #50 │ David Wilson │ Btech EEE        │ QmCc...     │ New      │ ✅
└─────┴──────────────┴──────────────────┴─────────────┴──────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    LOCAL STORAGE STRUCTURE                       │
└─────────────────────────────────────────────────────────────────┘

Key: batch_upload_processed_29peNqmLi7xRtQ... (your wallet)

Value: [
  {
    key: "studentAddr1_Btech_2026",
    studentName: "John Doe",
    studentAddress: "29peNqm...",
    degreeType: "Bachelor of Technology",
    graduationYear: "2026",
    timestamp: "2025-10-20T10:30:00.000Z",
    ipfsHash: "QmXx..."
  },
  {
    key: "studentAddr2_Btech_2026",
    ...
  },
  ... (20 records total)
]


┌─────────────────────────────────────────────────────────────────┐
│                    USER OPTIONS                                  │
└─────────────────────────────────────────────────────────────────┘

Option 1: Skip Already Processed (Default) ✅
┌────────────────────────────────────────────┐
│ ☑ Skip already processed records          │
│                                            │
│ ✓ Fast processing                         │
│ ✓ No duplicates                           │
│ ✓ Resume from where left off             │
└────────────────────────────────────────────┘

Option 2: Re-process Everything
┌────────────────────────────────────────────┐
│ ☐ Skip already processed records          │
│                                            │
│ ⚠ May create duplicates                   │
│ ⚠ Longer processing time                  │
│ ⚠ Use only if needed                      │
└────────────────────────────────────────────┘

Option 3: Clear History
┌────────────────────────────────────────────┐
│ [Clear History] Button                     │
│                                            │
│ ⚠ Deletes all processing history          │
│ ⚠ Next upload will process all records    │
│ ⚠ Cannot be undone                        │
└────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────┘

Scenario: Record 25 fails during processing
│
├─► Records 1-20:  ⏭️  SKIPPED
├─► Records 21-24: ✅ SUCCESS → Saved to localStorage
├─► Record 25:     ❌ FAILED  → Not saved
└─► Records 26-50: ✅ SUCCESS → Saved to localStorage

Next Upload:
├─► Records 1-24:  ⏭️  SKIPPED (already in localStorage)
├─► Record 25:     🔄 RETRY (not in localStorage)
└─► Records 26-50: ⏭️  SKIPPED (already in localStorage)

Result: Only failed record is retried! 🎯


┌─────────────────────────────────────────────────────────────────┐
│                    KEY BENEFITS                                  │
└─────────────────────────────────────────────────────────────────┘

🎯 Resume Capability
   └─► Continue exactly where you left off

🚫 No Duplicates
   └─► Automatically prevents duplicate NFTs

⚡ Fast Re-upload
   └─► Skip processed records instantly

💾 Persistent Storage
   └─► Survives browser refresh

🔄 Retry Only Failed
   └─► Smart detection of what needs processing

👁️ Visual Feedback
   └─► Clear indicators of status

🎛️ User Control
   └─► Options to skip, re-process, or clear history
```
