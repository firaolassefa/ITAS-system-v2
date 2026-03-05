# How to Upload Questions with Answers

## Fixed: 401 Unauthorized Error

✅ Added better token validation
✅ Shows clear error if session expired
✅ Auto-redirects to login

**If you get 401 error:**
1. Logout and login again as `contentadmin` / `Content@123`
2. Only CONTENT_ADMIN, TRAINING_ADMIN, SYSTEM_ADMIN can upload

---

## Complete Question Format

### Copy This Template:

```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Annual Tax
C) Verified Asset Tax
D) None of the above
Correct Answer: A
Explanation: VAT stands for Value Added Tax
Points: 10

Question 2: What is the VAT rate in Ethiopia?
A) 5%
B) 10%
C) 15%
D) 20%
Correct Answer: C
Explanation: The standard VAT rate is 15%
Points: 10

Question 3: Is VAT a direct tax?
A) True
B) False
Correct Answer: B
Explanation: VAT is an indirect tax
Points: 5
```

---

## Format Rules

### REQUIRED (Must Have):

1. **Question Line**
   ```
   Question 1: What is VAT?
   ```

2. **Answer Options (2-4 options)**
   ```
   A) Value Added Tax
   B) Variable Tax
   ```
   - Use A), B), C), D)
   - Or use A., B., C., D.
   - Minimum 2 options

3. **Correct Answer**
   ```
   Correct Answer: A
   ```
   - Only ONE letter (A, B, C, or D)

### OPTIONAL (Recommended):

4. **Explanation**
   ```
   Explanation: VAT stands for Value Added Tax
   ```

5. **Points**
   ```
   Points: 10
   ```
   - Default is 1 if not specified

---

## Upload Steps

1. **Login** as `contentadmin` / `Content@123`
2. **Go to** "Question Management"
3. **Select** Course and Module
4. **Click** "Upload File" button
5. **Choose** your .docx or .pdf file
6. **Click** "Upload & Import"
7. **Success!** Questions appear in list

---

## Common Mistakes

### ❌ Wrong:
```
What is VAT?  (missing "Question 1:")
1) Answer     (should be A))
Correct: A    (should be "Correct Answer: A")
```

### ✅ Correct:
```
Question 1: What is VAT?
A) Value Added Tax
B) Variable Tax
Correct Answer: A
```

---

## Sample File Content

```
Question 1: What does TIN stand for?
A) Tax Identification Number
B) Total Income Number
C) Transaction Invoice Number
D) Tax Information Note
Correct Answer: A
Explanation: TIN is Tax Identification Number
Points: 5

Question 2: Is VAT refundable for exporters?
A) Yes
B) No
Correct Answer: A
Explanation: Exporters can claim VAT refunds
Points: 5

Question 3: VAT is collected at every stage
A) True
B) False
Correct Answer: A
Points: 3
```

---

## Quick Reference

```
Question 1: [Question text]
A) [Option 1]
B) [Option 2]
C) [Option 3] (optional)
D) [Option 4] (optional)
Correct Answer: [A/B/C/D]
Explanation: [Why correct] (optional)
Points: [Number] (optional)

[Blank line between questions]

Question 2: [Next question...]
```

---

## Troubleshooting

**401 Unauthorized**
→ Logout and login again

**No questions found**
→ Check format matches examples

**Questions but no answers**
→ Check you have A), B), C), D) format
→ Check "Correct Answer: A" line exists

---

**Status**: ✅ Fixed and Ready
**File Types**: .docx or .pdf
**Who Can Upload**: Content/Training/System Admin
