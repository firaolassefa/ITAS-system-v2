# How to Use Dynamic Resource Upload

## Quick Guide

### Using Existing Categories/Audiences

1. **Login** as CONTENT_ADMIN
   - Username: `contentadmin`
   - Password: `Content@123`

2. **Navigate** to "Upload Resource"

3. **Select from existing options**:
   - Category: VAT, INCOME_TAX, CORPORATE_TAX, TCC, CUSTOMS, EXCISE, TAX_COMPLIANCE
   - Audience: ALL, TAXPAYER, STAFF, SME, INDIVIDUAL, CORPORATE, GOVERNMENT

4. **Upload** your file

---

## Adding Custom Category

### Step-by-Step

1. **Open** Upload Resource page

2. **Select Category** dropdown

3. **Choose** "OTHER" (last option)

4. **New field appears** below:
   ```
   Enter Custom Category
   e.g., Property Tax, Sales Tax
   ```

5. **Type** your custom category:
   - Example: "Property Tax"
   - Example: "Sales Tax"
   - Example: "Withholding Tax"

6. **Fill** other required fields

7. **Upload** resource

8. **Result**: Your custom category is now available!

### Next Time
- Open Category dropdown
- Your custom category appears in the list
- Example: "PROPERTY_TAX" (auto-formatted)

---

## Adding Custom Audience

### Step-by-Step

1. **Open** Upload Resource page

2. **Select Audience** dropdown

3. **Choose** "OTHER" (last option)

4. **New field appears** below:
   ```
   Enter Custom Audience
   e.g., Tax Consultants, Accountants
   ```

5. **Type** your custom audience:
   - Example: "Tax Consultants"
   - Example: "Accountants"
   - Example: "Legal Advisors"

6. **Fill** other required fields

7. **Upload** resource

8. **Result**: Your custom audience is now available!

### Next Time
- Open Audience dropdown
- Your custom audience appears in the list
- Example: "TAX_CONSULTANTS" (auto-formatted)

---

## Examples

### Example 1: Adding "Property Tax" Category

```
1. Category dropdown → Select "OTHER"
2. Custom field appears
3. Type: "Property Tax"
4. Upload resource
5. Next upload: "PROPERTY_TAX" is in dropdown
```

### Example 2: Adding "Accountants" Audience

```
1. Audience dropdown → Select "OTHER"
2. Custom field appears
3. Type: "Accountants"
4. Upload resource
5. Next upload: "ACCOUNTANTS" is in dropdown
```

### Example 3: Multiple Custom Values

```
Upload 1:
- Category: OTHER → "Sales Tax"
- Result: "SALES_TAX" added

Upload 2:
- Category: OTHER → "Payroll Tax"
- Result: "PAYROLL_TAX" added

Upload 3:
- Category dropdown now shows:
  ✓ VAT
  ✓ INCOME_TAX
  ✓ CORPORATE_TAX
  ✓ TCC
  ✓ CUSTOMS
  ✓ EXCISE
  ✓ TAX_COMPLIANCE
  ✓ SALES_TAX (your custom)
  ✓ PAYROLL_TAX (your custom)
  ✓ OTHER
```

---

## Auto-Formatting Rules

Your custom input is automatically formatted:

| You Type | System Saves |
|----------|--------------|
| Property Tax | PROPERTY_TAX |
| sales tax | SALES_TAX |
| Tax Consultants | TAX_CONSULTANTS |
| Small Business | SMALL_BUSINESS |
| legal advisors | LEGAL_ADVISORS |

**Rules:**
- Converted to UPPERCASE
- Spaces → Underscores
- Special characters removed

---

## Tips & Tricks

### Tip 1: Use Descriptive Names
✅ Good: "Property Tax", "Sales Tax"
❌ Bad: "PT", "ST"

### Tip 2: Check Existing Options First
Before adding custom, check if similar option exists:
- "TAXPAYER" vs creating "Tax Payers"
- "SME" vs creating "Small Business"

### Tip 3: Be Consistent
If you create "Tax Consultants", use it for all consultant resources
Don't create "Tax Consultant", "Consultants", "Tax Advisors" for same thing

### Tip 4: Session Persistence
Custom values persist during your session:
- Stay available until you logout
- Refresh page → Still there
- Logout → Need to add again

### Tip 5: Team Coordination
If multiple admins upload resources:
- Coordinate on category names
- Use consistent naming
- Document custom categories

---

## Common Use Cases

### Use Case 1: New Tax Type Introduced
Government introduces new tax:
1. Select "OTHER" in Category
2. Enter new tax name
3. Upload related resources
4. All future resources can use this category

### Use Case 2: Specific User Group
Need to target specific group:
1. Select "OTHER" in Audience
2. Enter group name (e.g., "Import/Export Businesses")
3. Upload targeted resources
4. Group can filter by this audience

### Use Case 3: Seasonal Content
Tax season specific content:
1. Category: OTHER → "Tax Season 2026"
2. Upload seasonal guides
3. Easy to find all seasonal content

---

## Troubleshooting

### Issue: Custom field doesn't appear
**Solution**: Make sure you selected "OTHER" from dropdown

### Issue: Custom value not in list after upload
**Solution**: 
- Check upload was successful
- Refresh the page
- Try adding again

### Issue: Can't type in custom field
**Solution**: 
- Check you're not in upload mode
- Wait for previous upload to complete
- Refresh page if stuck

### Issue: Custom value looks wrong
**Solution**: 
- Remember auto-formatting rules
- "Property Tax" becomes "PROPERTY_TAX"
- This is normal and expected

---

## Visual Guide

### Before Selecting "OTHER"
```
┌─────────────────────────────┐
│ Category                ▼   │
├─────────────────────────────┤
│ VAT                         │
│ INCOME_TAX                  │
│ CORPORATE_TAX               │
│ TCC                         │
│ CUSTOMS                     │
│ EXCISE                      │
│ TAX_COMPLIANCE              │
│ OTHER                       │ ← Select this
└─────────────────────────────┘
```

### After Selecting "OTHER"
```
┌─────────────────────────────┐
│ Category                ▼   │
│ OTHER                       │ ← Selected
└─────────────────────────────┘

┌─────────────────────────────┐
│ Enter Custom Category       │ ← New field appears!
│ e.g., Property Tax          │
├─────────────────────────────┤
│ [Type here...]              │
└─────────────────────────────┘
This will be added to the category list
```

---

## Quick Reference

### Available Categories (Initial)
- VAT
- INCOME_TAX
- CORPORATE_TAX
- TCC
- CUSTOMS
- EXCISE
- TAX_COMPLIANCE
- OTHER (add custom)

### Available Audiences (Initial)
- ALL
- TAXPAYER
- STAFF
- SME
- INDIVIDUAL
- CORPORATE
- GOVERNMENT
- OTHER (add custom)

### Resource Types (Fixed)
- PDF
- VIDEO
- ARTICLE
- GUIDE
- PRESENTATION

---

## Summary

✅ Select "OTHER" to add custom category
✅ Select "OTHER" to add custom audience
✅ Custom values auto-formatted
✅ Custom values persist during session
✅ Use for new tax types or user groups
✅ No code changes needed

**Happy Uploading!** 🚀
