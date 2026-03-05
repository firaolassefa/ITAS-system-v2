# Sample Question File Format for Upload

## ✅ File Upload is Now Working!

You can upload Word (.docx) or PDF files with questions and they will be automatically imported into the system.

---

## File Format

Create a Word or PDF file with this exact format:

```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax
Points: 10

Question 2: What is the standard VAT rate in your country?
A) 5%
B) 10%
C) 15%
D) 20%
Correct Answer: C
Explanation: The standard VAT rate is 15%
Points: 10

Question 3: Who must register for VAT?
A) All businesses
B) Businesses with turnover above threshold
C) Only large corporations
D) Only retail businesses
Correct Answer: B
Explanation: Businesses must register for VAT when their turnover exceeds the registration threshold
Points: 10

Question 4: What is input VAT?
A) VAT on sales
B) VAT on purchases
C) VAT refund
D) VAT penalty
Correct Answer: B
Explanation: Input VAT is the VAT paid on business purchases
Points: 10

Question 5: How often are VAT returns filed?
A) Weekly
B) Monthly
C) Quarterly
D) Annually
Correct Answer: C
Explanation: VAT returns are typically filed quarterly
Points: 10
```

---

## Format Rules

### Required Fields:
1. **Question X:** - Question number and text
2. **A), B), C), D)** - Answer options (at least 2, up to 4)
3. **Correct Answer: X** - The letter of the correct answer (A, B, C, or D)

### Optional Fields:
1. **Explanation:** - Explanation of the correct answer (recommended)
2. **Points:** - Points for this question (default is 1 if not specified)

---

## Important Notes

### ✅ DO:
- Start each question with "Question X:" (where X is the number)
- Use A), B), C), D) format for options
- Specify "Correct Answer: A" (or B, C, D)
- Add explanations for better learning
- Specify points if different from default

### ❌ DON'T:
- Skip question numbers
- Use different option formats (like 1., 2., 3.)
- Forget to specify correct answer
- Use special characters in question numbers

---

## How to Upload

### Step 1: Create Your File
1. Open Microsoft Word or any text editor
2. Copy the format above
3. Replace with your questions
4. Save as .docx or export as .pdf

### Step 2: Upload to System
1. Login as admin (`contentadmin` / `Content@123`)
2. Go to "Assessment Management"
3. Click "Import from File"
4. Choose a course (to load modules)
5. Select the module where questions should be added
6. Click "Choose File" and select your Word/PDF file
7. Click "Upload & Extract"

### Step 3: Verify
1. System will show "Successfully imported X questions!"
2. Go to "Question Management" to see your questions
3. Questions are automatically linked to the selected module
4. Each option becomes an Answer entity in the database

---

## Example Files

### Example 1: Basic Quiz (5 questions)
```
Question 1: What does HTML stand for?
A) Hyper Text Markup Language
B) High Tech Modern Language
C) Home Tool Markup Language
D) Hyperlinks and Text Markup Language
Correct Answer: A
Explanation: HTML stands for Hyper Text Markup Language
Points: 5

Question 2: What does CSS stand for?
A) Creative Style Sheets
B) Cascading Style Sheets
C) Computer Style Sheets
D) Colorful Style Sheets
Correct Answer: B
Explanation: CSS stands for Cascading Style Sheets
Points: 5

Question 3: What is JavaScript?
A) A programming language
B) A markup language
C) A style sheet language
D) A database language
Correct Answer: A
Explanation: JavaScript is a programming language used for web development
Points: 5

Question 4: What is a variable in programming?
A) A constant value
B) A container for storing data
C) A function
D) A loop
Correct Answer: B
Explanation: A variable is a container for storing data values
Points: 5

Question 5: What is an array?
A) A single value
B) A collection of values
C) A function
D) A loop
Correct Answer: B
Explanation: An array is a collection of values stored in a single variable
Points: 5
```

### Example 2: Advanced Exam (with detailed explanations)
```
Question 1: What is the time complexity of binary search?
A) O(n)
B) O(log n)
C) O(n^2)
D) O(1)
Correct Answer: B
Explanation: Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration
Points: 15

Question 2: What is polymorphism in OOP?
A) Having multiple forms
B) Inheritance
C) Encapsulation
D) Abstraction
Correct Answer: A
Explanation: Polymorphism means "many forms" and allows objects to be treated as instances of their parent class
Points: 15
```

---

## Supported File Types

✅ **Word Documents (.docx)**
- Microsoft Word 2007 and later
- Google Docs (export as .docx)
- LibreOffice Writer (save as .docx)

✅ **PDF Documents (.pdf)**
- Any PDF with selectable text
- Exported from Word, Google Docs, etc.
- NOT scanned images (text must be selectable)

❌ **NOT Supported:**
- .doc (old Word format) - save as .docx instead
- Scanned PDFs without OCR
- Images (.jpg, .png)
- Excel files (.xlsx)

---

## Troubleshooting

### "Failed to import questions"
- Check file format matches exactly
- Ensure "Question X:" format is correct
- Verify "Correct Answer: X" is present
- Make sure file is .docx or .pdf

### "No questions found"
- File might be empty
- Format might be incorrect
- Try copying the sample format exactly

### "Invalid question format"
- Missing "Question X:" header
- Missing answer options
- Missing "Correct Answer:" line
- Check for typos in format

---

## Tips for Best Results

1. **Use the exact format** - Copy the sample and modify
2. **Test with small file first** - Upload 2-3 questions to test
3. **Add explanations** - Helps students learn
4. **Specify points** - Important questions get more points
5. **Review after upload** - Check questions in Question Management
6. **Keep it simple** - Don't use complex formatting in Word

---

## What Happens After Upload

1. ✅ File is read (Word or PDF)
2. ✅ Text is extracted
3. ✅ Questions are parsed
4. ✅ Each question becomes a Question entity
5. ✅ Each option becomes an Answer entity
6. ✅ Correct answer is marked
7. ✅ Questions are linked to selected module
8. ✅ Questions appear in Question Management
9. ✅ Students can take quizzes with these questions

---

## Summary

**File upload is fully working!** Just:
1. Create a Word or PDF file with the format above
2. Upload through Assessment Management
3. Questions are automatically imported
4. No manual entry needed!

**Date**: March 4, 2026
**Status**: ✅ WORKING
**Tested**: YES
**Ready**: Production
