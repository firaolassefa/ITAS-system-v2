# How to Upload Questions with Answers - Complete Guide

## Issue Fixed: 401 Unauthorized Error

### Problem
When uploading files, you got: `POST http://localhost:8080/api/assessment-definitions/import 401 (Unauthorized)`

### Solution
✅ Added better token validation and error handling
✅ Shows clear message if session expired
✅ Automatically redirects to login if unauthorized

### What to Do If You Get 401 Error
1. **Logout and Login Again**
   - Your session may have expired
   - Login as: `contentadmin` / `Content@123`

2. **Check Your Role**
   - Only these roles can upload:
     - CONTENT_ADMIN
     - TRAINING_ADMIN
     - SYSTEM_ADMIN

---

## How to Add Answers in Your File

### Complete Format (Copy This!)

```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax
Points: 10

Question 2: What is the standard VAT rate in Ethiopia?
A) 5%
B) 10%
C) 15%
D) 20%
Correct Answer: C
Explanation: The standard VAT rate in Ethiopia is 15%
Points: 10

Question 3: Who must register for VAT?
A) All businesses
B) Businesses with annual turnover above 1 million Birr
C) Only large corporations
D) Only exporters
Correct Answer: B
Explanation: Businesses with annual turnover exceeding 1 million Birr must register for VAT
Points: 5

Question 4: Is VAT a direct tax?
A) True
B) False
Correct Answer: B
Explanation: VAT is an indirect tax, not a direct tax
Points: 5
```

---

## Format Rules

### Required Fields (MUST HAVE)

1. **Question Number and Text**
   ```
   Question 1: What is VAT?
   ```
   - Must start with "Question" followed by number
   - Colon (:) after number
   - Question text after colon

2. **Answer Options (At least 2)**
   ```
   A) Value Added Tax
   B) Variable Annual Tax
   ```
   - Start with letter: A), B), C), D)
   - Can also use: A., B., C., D.
   - Minimum 2 options required
   - Maximum 4 options (A, B, C, D)

3. **Correct Answer**
   ```
   Correct Answer: A
   ```
   - Must say "Correct Answer:"
   - Followed by the letter (A, B, C, or D)
   - Only ONE correct answer per question

### Optional Fields (Nice to Have)

4. **Explanation** (Recommended)
   ```
   Explanation: VAT stands for Value Added Tax
   ```
   - Helps students learn
   - Shows after they answer

5. **Points** (Optional)
   ```
   Points: 10
   ```
   - Default is 1 point if not specified
   - Can be any number

---

## Examples for Different Question Types

### Example 1: Multiple Choice (4 Options)
```
Question 1: What does TIN stand for?
A) Tax Identification Number
B) Total Income Number
C) Transaction Invoice Number
D) Tax Information Note
Correct Answer: A
Explanation: TIN stands for Tax Identification Number, a unique identifier for taxpayers
Points: 5
```

### Example 2: Multiple Choice (3 Options)
```
Question 2: Which tax is collected at the point of sale?
A) Income Tax
B) VAT
C) Property Tax
Correct Answer: B
Explanation: VAT is collected at the point of sale from consumers
Points: 5
```

### Example 3: True/False Question
```
Question 3: All businesses must pay corporate tax
A) True
B) False
Correct Answer: B
Explanation: Only businesses structured as corporations pay corporate tax
Points: 3
```

### Example 4: Without Explanation
```
Question 4: What is the VAT rate?
A) 10%
B) 15%
C) 20%
D) 25%
Correct Answer: B
Points: 5
```

### Example 5: Without Points (Uses Default)
```
Question 5: Is VAT refundable for exporters?
A) Yes
B) No
Correct Answer: A
Explanation: Exporters can claim VAT refunds on their purchases
```

---

## Step-by-Step Upload Process

### Step 1: Create Your File

**Option A: Microsoft Word (.docx)**
1. Open Microsoft Word
2. Type your questions using the format above
3. Save as `.docx` file
4. Example: `vat-questions.docx`

**Option B: PDF**
1. Create in Word or Google Docs
2. Export/Save as PDF
3. Make sure text is selectable (not scanned image)
4. Example: `vat-questions.pdf`

### Step 2: Login to System
1. Go to login page
2. Login as Content Admin:
   - Username: `contentadmin`
   - Password: `Content@123`

### Step 3: Navigate to Question Management
1. Click "Question Management" in sidebar
2. Select a Course from dropdown
3. Select a Module from dropdown

### Step 4: Upload File
1. Click "Upload File" button
2. Click "Choose File"
3. Select your `.docx` or `.pdf` file
4. Click "Upload & Import"

### Step 5: Verify Success
✅ You should see: "Successfully imported X questions!"
✅ Questions appear in the list below
✅ Each question has its answers
✅ Correct answers are marked

---

## Common Mistakes and Fixes

### ❌ Mistake 1: Missing "Question X:"
```
What is VAT?  ← WRONG (no "Question 1:")
A) Value Added Tax
```

✅ **Fix:**
```
Question 1: What is VAT?  ← CORRECT
A) Value Added Tax
```

### ❌ Mistake 2: Wrong Answer Format
```
Question 1: What is VAT?
1) Value Added Tax  ← WRONG (should be A))
2) Variable Tax     ← WRONG (should be B))
```

✅ **Fix:**
```
Question 1: What is VAT?
A) Value Added Tax  ← CORRECT
B) Variable Tax     ← CORRECT
```

### ❌ Mistake 3: Missing Correct Answer
```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Tax
← MISSING "Correct Answer: A"
```

✅ **Fix:**
```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Tax
Correct Answer: A  ← ADDED
```

### ❌ Mistake 4: Multiple Correct Answers
```
Correct Answer: A, B  ← WRONG (only one allowed)
```

✅ **Fix:**
```
Correct Answer: A  ← CORRECT (only one letter)
```

### ❌ Mistake 5: Only One Answer Option
```
Question 1: What is VAT?
A) Value Added Tax
← NEED at least 2 options
```

✅ **Fix:**
```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Tax  ← ADDED second option
Correct Answer: A
```

---

## Sample File You Can Copy

Create a file called `sample-questions.docx` with this content:

```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax, an indirect tax on consumption
Points: 10

Question 2: What is the VAT registration threshold in Ethiopia?
A) 500,000 Birr
B) 1,000,000 Birr
C) 2,000,000 Birr
D) 5,000,000 Birr
Correct Answer: B
Explanation: Businesses with annual turnover exceeding 1 million Birr must register for VAT
Points: 10

Question 3: Is VAT charged on exports?
A) Yes
B) No
Correct Answer: B
Explanation: Exports are zero-rated for VAT purposes
Points: 5

Question 4: Can businesses claim VAT refunds?
A) Yes, if they have excess input VAT
B) No, VAT is never refundable
C) Only for exporters
D) Only for manufacturers
Correct Answer: A
Explanation: Businesses can claim refunds when input VAT exceeds output VAT
Points: 5

Question 5: VAT is collected at every stage of production
A) True
B) False
Correct Answer: A
Explanation: VAT is collected at each stage of the supply chains
✅ **File Types**: .docx or .pdf
✅ **Who Can Upload**: CONTENT_ADMIN, TRAINING_ADMIN, SYSTEM_ADMIN

**Ready to upload!** 🚀

---

**Date**: March 5, 2026
**Status**: ✅ COMPLETE
**Next Step**: Create your question file and upload!
                 │
│                                         │
│  [Blank line]                           │
│                                         │
│  Question 2: [Next question...]         │
│                                         │
└─────────────────────────────────────────┘
```

---

## Summary

✅ **Fixed**: 401 error with better token handling
✅ **Format**: Use "Question X:", "A)", "B)", "Correct Answer: X"
✅ **Required**: Question text, 2+ answers, correct answer
✅ **Optional**: Explanation, Point
```
┌─────────────────────────────────────────┐
│  QUESTION FORMAT QUICK REFERENCE        │
├─────────────────────────────────────────┤
│                                         │
│  Question 1: [Your question text]       │
│  A) [First option]                      │
│  B) [Second option]                     │
│  C) [Third option] (optional)           │
│  D) [Fourth option] (optional)          │
│  Correct Answer: [A/B/C/D]              │
│  Explanation: [Why this is correct]     │
│  Points: [Number]      le

### Database Structure:
```
Question Table:
- id: 1
- questionText: "What is VAT?"
- moduleId: 5
- questionType: MULTIPLE_CHOICE
- points: 10
- explanation: "VAT stands for..."

Answer Table:
- id: 1, questionId: 1, answerText: "A) Value Added Tax", isCorrect: true
- id: 2, questionId: 1, answerText: "B) Variable Tax", isCorrect: false
- id: 3, questionId: 1, answerText: "C) Verified Tax", isCorrect: false
- id: 4, questionId: 1, answerText: "D) None", isCorrect: false
```

---

## Quick Reference Card
 are created
5. ✅ Correct answers are marked
6. ✅ Questions saved to database
7. ✅ Linked to selected modue is not corrupted
3. Try with the sample file above first
4. Check backend logs for detailed error

### Problem: Questions imported but no answers
**Solution:**
1. Check answer format: A), B), C), D)
2. Make sure "Correct Answer: A" is present
3. Make sure there's a blank line between questions

---

## What Happens After Upload

### Backend Processing:
1. ✅ File is received
2. ✅ Text is extracted (Word or PDF)
3. ✅ Questions are parsed
4. ✅ Answer optionsroblem: "Failed to import questions"
**Solution:**
1. Check file type is `.docx` or `.pdf`
2. Make sure fil
Points: 3
```

---

## Troubleshooting

### Problem: "401 Unauthorized"
**Solution:**
1. Logout and login again
2. Make sure you're logged in as:
   - `contentadmin` / `Content@123`
   - OR `trainingadmin` / `Training@123`
   - OR `systemadmin` / `Admin@123`

### Problem: "No questions found"
**Solution:**
1. Check your file format matches examples above
2. Make sure you have "Question 1:", "Question 2:", etc.
3. Make sure you have answer options (A), B), etc.)
4. Make sure you have "Correct Answer: X"

### P