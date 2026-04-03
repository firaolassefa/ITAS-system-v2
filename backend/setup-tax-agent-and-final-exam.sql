-- ============================================
-- COMPLETE SETUP: TAX AGENT + FINAL EXAM
-- ============================================
-- This script will:
-- 1. Change user type to TAXPAYER
-- 2. Create a complete course with 5 modules
-- 3. Add 5 quiz questions per module (25 total for final exam)
-- 4. Enroll the user in the course
-- ============================================

-- Step 1: Change user to TAXPAYER
UPDATE users 
SET user_type = 'TAXPAYER' 
WHERE id = 1;

-- Verify user type change
SELECT id, username, full_name, user_type 
FROM users 
WHERE id = 1;

-- Step 2: Create course (if not exists)
INSERT INTO courses (title, description, category, difficulty, duration_hours, created_at, updated_at)
VALUES (
    'VAT and Tax Compliance Course',
    'Complete course covering VAT registration, returns, compliance, and advanced topics for tax agents',
    'TAX_EDUCATION',
    'INTERMEDIATE',
    25,
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Get the course ID
DO $$
DECLARE
    v_course_id INTEGER;
    v_module_id INTEGER;
    v_question_id INTEGER;
    module_num INTEGER;
    question_num INTEGER;
    answer_num INTEGER;
BEGIN
    -- Get or create course
    SELECT id INTO v_course_id 
    FROM courses 
    WHERE title = 'VAT and Tax Compliance Course' 
    LIMIT 1;
    
    RAISE NOTICE 'Course ID: %', v_course_id;
    
    -- Delete existing modules for this course (if re-running script)
    DELETE FROM answers WHERE question_id IN (
        SELECT q.id FROM questions q 
        JOIN modules m ON q.module_id = m.id 
        WHERE m.course_id = v_course_id
    );
    DELETE FROM questions WHERE module_id IN (
        SELECT id FROM modules WHERE course_id = v_course_id
    );
    DELETE FROM modules WHERE course_id = v_course_id;
    
    -- Create 5 modules
    FOR module_num IN 1..5 LOOP
        INSERT INTO modules (
            course_id, 
            title, 
            description, 
            "order", 
            duration_minutes, 
            passing_score, 
            max_attempts, 
            is_locked, 
            created_at,
            updated_at
        )
        VALUES (
            v_course_id,
            CASE module_num
                WHEN 1 THEN 'Module 1: Introduction to VAT'
                WHEN 2 THEN 'Module 2: VAT Registration Process'
                WHEN 3 THEN 'Module 3: VAT Returns and Filing'
                WHEN 4 THEN 'Module 4: VAT Compliance and Penalties'
                WHEN 5 THEN 'Module 5: Advanced VAT Topics'
            END,
            CASE module_num
                WHEN 1 THEN 'Learn the fundamentals of Value Added Tax (VAT) in Saudi Arabia'
                WHEN 2 THEN 'Understand the VAT registration requirements and process'
                WHEN 3 THEN 'Master VAT return preparation and submission procedures'
                WHEN 4 THEN 'Learn about compliance requirements and penalty structures'
                WHEN 5 THEN 'Explore advanced topics including zero-rated supplies and exemptions'
            END,
            module_num - 1,
            60,
            70,
            3,
            CASE WHEN module_num = 1 THEN false ELSE true END,
            NOW(),
            NOW()
        )
        RETURNING id INTO v_module_id;
        
        RAISE NOTICE 'Created Module %: ID = %', module_num, v_module_id;
        
        -- Add 5 quiz questions per module
        FOR question_num IN 1..5 LOOP
            INSERT INTO questions (
                module_id, 
                question_text, 
                question_type, 
                is_practice, 
                points, 
                "order", 
                created_at,
                updated_at
            )
            VALUES (
                v_module_id,
                CASE module_num
                    WHEN 1 THEN
                        CASE question_num
                            WHEN 1 THEN 'What does VAT stand for?'
                            WHEN 2 THEN 'What is the standard VAT rate in Saudi Arabia?'
                            WHEN 3 THEN 'When was VAT introduced in Saudi Arabia?'
                            WHEN 4 THEN 'Who must register for VAT in Saudi Arabia?'
                            WHEN 5 THEN 'What is the VAT registration threshold?'
                        END
                    WHEN 2 THEN
                        CASE question_num
                            WHEN 1 THEN 'How long does VAT registration typically take?'
                            WHEN 2 THEN 'What documents are required for VAT registration?'
                            WHEN 3 THEN 'Can a business voluntarily register for VAT?'
                            WHEN 4 THEN 'What is a Tax Registration Number (TRN)?'
                            WHEN 5 THEN 'When should a business apply for VAT registration?'
                        END
                    WHEN 3 THEN
                        CASE question_num
                            WHEN 1 THEN 'How often must VAT returns be filed?'
                            WHEN 2 THEN 'What is the deadline for filing VAT returns?'
                            WHEN 3 THEN 'What information must be included in a VAT return?'
                            WHEN 4 THEN 'Can VAT returns be amended after submission?'
                            WHEN 5 THEN 'What is output VAT?'
                        END
                    WHEN 4 THEN
                        CASE question_num
                            WHEN 1 THEN 'What is the penalty for late VAT return filing?'
                            WHEN 2 THEN 'What records must be kept for VAT purposes?'
                            WHEN 3 THEN 'How long must VAT records be retained?'
                            WHEN 4 THEN 'What is a VAT audit?'
                            WHEN 5 THEN 'What happens if VAT is not paid on time?'
                        END
                    WHEN 5 THEN
                        CASE question_num
                            WHEN 1 THEN 'What are zero-rated supplies?'
                            WHEN 2 THEN 'What is the difference between zero-rated and exempt supplies?'
                            WHEN 3 THEN 'Can input VAT be recovered on zero-rated supplies?'
                            WHEN 4 THEN 'What are examples of exempt supplies?'
                            WHEN 5 THEN 'What is the reverse charge mechanism?'
                        END
                END,
                'MULTIPLE_CHOICE',
                false,  -- Quiz question (NOT practice) - these go to final exam
                10,
                question_num - 1,
                NOW(),
                NOW()
            )
            RETURNING id INTO v_question_id;
            
            -- Add 4 answers per question (1 correct, 3 incorrect)
            FOR answer_num IN 1..4 LOOP
                INSERT INTO answers (
                    question_id, 
                    answer_text, 
                    is_correct, 
                    "order"
                )
                VALUES (
                    v_question_id,
                    CASE module_num
                        WHEN 1 THEN
                            CASE question_num
                                WHEN 1 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Value Added Tax'
                                        WHEN 2 THEN 'Variable Annual Tax'
                                        WHEN 3 THEN 'Verified Asset Tax'
                                        WHEN 4 THEN 'Voluntary Audit Tax'
                                    END
                                WHEN 2 THEN
                                    CASE answer_num
                                        WHEN 1 THEN '15%'
                                        WHEN 2 THEN '5%'
                                        WHEN 3 THEN '10%'
                                        WHEN 4 THEN '20%'
                                    END
                                WHEN 3 THEN
                                    CASE answer_num
                                        WHEN 1 THEN '2018'
                                        WHEN 2 THEN '2016'
                                        WHEN 3 THEN '2017'
                                        WHEN 4 THEN '2019'
                                    END
                                WHEN 4 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Businesses with annual turnover exceeding 375,000 SAR'
                                        WHEN 2 THEN 'All businesses regardless of size'
                                        WHEN 3 THEN 'Only large corporations'
                                        WHEN 4 THEN 'Only exporters'
                                    END
                                WHEN 5 THEN
                                    CASE answer_num
                                        WHEN 1 THEN '375,000 SAR'
                                        WHEN 2 THEN '500,000 SAR'
                                        WHEN 3 THEN '1,000,000 SAR'
                                        WHEN 4 THEN '250,000 SAR'
                                    END
                            END
                        WHEN 2 THEN
                            CASE question_num
                                WHEN 1 THEN
                                    CASE answer_num
                                        WHEN 1 THEN '20-30 business days'
                                        WHEN 2 THEN '5 business days'
                                        WHEN 3 THEN '60 business days'
                                        WHEN 4 THEN '90 business days'
                                    END
                                WHEN 2 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Commercial registration, financial statements, and ID documents'
                                        WHEN 2 THEN 'Only commercial registration'
                                        WHEN 3 THEN 'Only financial statements'
                                        WHEN 4 THEN 'No documents required'
                                    END
                                WHEN 3 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Yes, if turnover is between 187,500 and 375,000 SAR'
                                        WHEN 2 THEN 'No, only mandatory registration is allowed'
                                        WHEN 3 THEN 'Yes, any business can register'
                                        WHEN 4 THEN 'Only with special permission'
                                    END
                                WHEN 4 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'A unique 15-digit number assigned to VAT-registered businesses'
                                        WHEN 2 THEN 'A tax payment reference'
                                        WHEN 3 THEN 'A business license number'
                                        WHEN 4 THEN 'A bank account number'
                                    END
                                WHEN 5 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Within 30 days of exceeding the threshold'
                                        WHEN 2 THEN 'Immediately upon starting business'
                                        WHEN 3 THEN 'Within 90 days of exceeding the threshold'
                                        WHEN 4 THEN 'At the end of the fiscal year'
                                    END
                            END
                        WHEN 3 THEN
                            CASE question_num
                                WHEN 1 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Monthly or quarterly depending on turnover'
                                        WHEN 2 THEN 'Only annually'
                                        WHEN 3 THEN 'Only monthly'
                                        WHEN 4 THEN 'Weekly'
                                    END
                                WHEN 2 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Last day of the month following the tax period'
                                        WHEN 2 THEN 'First day of the month'
                                        WHEN 3 THEN '15th of the month'
                                        WHEN 4 THEN 'No specific deadline'
                                    END
                                WHEN 3 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Sales, purchases, output VAT, and input VAT'
                                        WHEN 2 THEN 'Only total sales'
                                        WHEN 3 THEN 'Only VAT amount'
                                        WHEN 4 THEN 'Only business name'
                                    END
                                WHEN 4 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Yes, within specific timeframes'
                                        WHEN 2 THEN 'No, returns are final'
                                        WHEN 3 THEN 'Only with ZATCA approval'
                                        WHEN 4 THEN 'Only for the current year'
                                    END
                                WHEN 5 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'VAT charged on sales'
                                        WHEN 2 THEN 'VAT paid on purchases'
                                        WHEN 3 THEN 'VAT refund'
                                        WHEN 4 THEN 'VAT penalty'
                                    END
                            END
                        WHEN 4 THEN
                            CASE question_num
                                WHEN 1 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Minimum 5% of unpaid tax or SAR 1,000-10,000'
                                        WHEN 2 THEN 'No penalty'
                                        WHEN 3 THEN 'Fixed SAR 500'
                                        WHEN 4 THEN 'Only a warning'
                                    END
                                WHEN 2 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Tax invoices, credit notes, import/export documents'
                                        WHEN 2 THEN 'Only invoices'
                                        WHEN 3 THEN 'Only receipts'
                                        WHEN 4 THEN 'No records required'
                                    END
                                WHEN 3 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'At least 6 years'
                                        WHEN 2 THEN '1 year'
                                        WHEN 3 THEN '3 years'
                                        WHEN 4 THEN 'Forever'
                                    END
                                WHEN 4 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'An examination of VAT records by ZATCA'
                                        WHEN 2 THEN 'A tax payment'
                                        WHEN 3 THEN 'A registration process'
                                        WHEN 4 THEN 'A refund request'
                                    END
                                WHEN 5 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Penalties and interest charges apply'
                                        WHEN 2 THEN 'Nothing happens'
                                        WHEN 3 THEN 'Automatic extension granted'
                                        WHEN 4 THEN 'Only a reminder is sent'
                                    END
                            END
                        WHEN 5 THEN
                            CASE question_num
                                WHEN 1 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Supplies subject to 0% VAT rate'
                                        WHEN 2 THEN 'Supplies with no VAT'
                                        WHEN 3 THEN 'Exempt supplies'
                                        WHEN 4 THEN 'Supplies at standard rate'
                                    END
                                WHEN 2 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Zero-rated allows input VAT recovery, exempt does not'
                                        WHEN 2 THEN 'No difference'
                                        WHEN 3 THEN 'Exempt is better for business'
                                        WHEN 4 THEN 'Zero-rated is only for exports'
                                    END
                                WHEN 3 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Yes, input VAT can be recovered'
                                        WHEN 2 THEN 'No, input VAT cannot be recovered'
                                        WHEN 3 THEN 'Only partially'
                                        WHEN 4 THEN 'Only with special permission'
                                    END
                                WHEN 4 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'Financial services, residential property rental'
                                        WHEN 2 THEN 'All services'
                                        WHEN 3 THEN 'Exports'
                                        WHEN 4 THEN 'Food items'
                                    END
                                WHEN 5 THEN
                                    CASE answer_num
                                        WHEN 1 THEN 'A mechanism where the recipient accounts for VAT'
                                        WHEN 2 THEN 'A refund process'
                                        WHEN 3 THEN 'A penalty system'
                                        WHEN 4 THEN 'A registration method'
                                    END
                            END
                    END,
                    CASE answer_num WHEN 1 THEN true ELSE false END,  -- First answer is correct
                    answer_num - 1
                );
            END LOOP;
            
        END LOOP;
        
    END LOOP;
    
    -- Enroll user in course
    INSERT INTO enrollments (user_id, course_id, enrolled_at, progress, status)
    VALUES (1, v_course_id, NOW(), 0, 'ACTIVE')
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ Setup Complete!';
    RAISE NOTICE '- User changed to TAXPAYER';
    RAISE NOTICE '- Course created with 5 modules';
    RAISE NOTICE '- 25 quiz questions added (5 per module)';
    RAISE NOTICE '- User enrolled in course';
    RAISE NOTICE '';
    RAISE NOTICE '🎯 Final Exam: Complete all 5 modules to unlock final exam with all 25 questions!';
    RAISE NOTICE '📊 Passing Score: 70%% (175/250 points)';
    RAISE NOTICE '🏆 Certificate: Automatically generated upon passing';
    
END $$;

-- Verification queries
SELECT '=== USER TYPE ===' as info;
SELECT id, username, full_name, user_type FROM users WHERE id = 1;

SELECT '=== COURSE INFO ===' as info;
SELECT id, title, description FROM courses WHERE title = 'VAT and Tax Compliance Course';

SELECT '=== MODULES ===' as info;
SELECT 
    m.id,
    m.title,
    m."order" + 1 as module_number,
    COUNT(q.id) as quiz_questions,
    SUM(q.points) as total_points
FROM modules m
LEFT JOIN questions q ON q.module_id = m.id AND q.is_practice = false
WHERE m.course_id = (SELECT id FROM courses WHERE title = 'VAT and Tax Compliance Course' LIMIT 1)
GROUP BY m.id, m.title, m."order"
ORDER BY m."order";

SELECT '=== FINAL EXAM SUMMARY ===' as info;
SELECT 
    c.title as course,
    COUNT(q.id) as total_final_exam_questions,
    SUM(q.points) as total_points,
    ROUND(SUM(q.points) * 0.7) as passing_score
FROM courses c
JOIN modules m ON m.course_id = c.id
JOIN questions q ON q.module_id = m.id AND q.is_practice = false
WHERE c.title = 'VAT and Tax Compliance Course'
GROUP BY c.id, c.title;

SELECT '=== ENROLLMENT ===' as info;
SELECT 
    e.id,
    u.username,
    c.title as course,
    e.progress,
    e.status
FROM enrollments e
JOIN users u ON u.id = e.user_id
JOIN courses c ON c.id = e.course_id
WHERE e.user_id = 1;
