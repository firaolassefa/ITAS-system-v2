-- Add External Tax Education PDFs to Resources Table
-- Run this SQL in your Neon PostgreSQL database

INSERT INTO resources (
    title, 
    description, 
    resource_type, 
    file_path, 
    file_name, 
    file_size, 
    mime_type, 
    category, 
    audience, 
    status,
    version,
    is_latest_version,
    archived,
    download_count,
    view_count,
    uploaded_at, 
    updated_at
)
VALUES 
(
    'OECD Tax Administration Report',
    'Comprehensive report on tax administration practices and taxpayer services from OECD',
    'PDF',
    'https://web-archive-storage.oecd.org/aemint-web-archive-prod/web-archive/6e/6e618c8b2493dab17e9852d42366e025f070779c3153466d0b84f05987e30bf4.pdf',
    'oecd-tax-administration-report.pdf',
    0,
    'application/pdf',
    'INCOME_TAX',
    'ALL',
    'PUBLISHED',
    1,
    true,
    false,
    0,
    0,
    NOW(),
    NOW()
),
(
    'Tax Education and Awareness Study',
    'Research paper on tax education and awareness for potential taxpayers in Ethiopia',
    'PDF',
    'http://www.repository.smuc.edu.et/bitstream/123456789/3347/1/FOR%20PDF%20After%20dr%20simone%20signed%20ALL%20%20ENDALE.pdf',
    'tax-education-awareness-ethiopia.pdf',
    0,
    'application/pdf',
    'INCOME_TAX',
    'ALL',
    'PUBLISHED',
    1,
    true,
    false,
    0,
    0,
    NOW(),
    NOW()
),
(
    'Taxpayer Assistance and Information Education',
    'CIAT publication on taxpayer assistance, information, and education strategies',
    'PDF',
    'https://www.ciat.org/Biblioteca/Revista/Revista_6/taxpayer_assistance_information_education_pounder_trinidad_y_tobago.pdf',
    'taxpayer-assistance-ciat.pdf',
    0,
    'application/pdf',
    'INCOME_TAX',
    'ALL',
    'PUBLISHED',
    1,
    true,
    false,
    0,
    0,
    NOW(),
    NOW()
),
(
    'Tax Awareness and Tax Education: A Perception Study',
    'Academic research on tax awareness and education from potential taxpayers perspective',
    'PDF',
    'https://www.ijbel.com/wp-content/uploads/2014/12/ACC-37-Tax-awareness-and-tax-education-a-perception-of-potential-taxpayers.pdf',
    'tax-awareness-perception-study.pdf',
    0,
    'application/pdf',
    'INCOME_TAX',
    'ALL',
    'PUBLISHED',
    1,
    true,
    false,
    0,
    0,
    NOW(),
    NOW()
),
(
    'Tax Compliance and Awareness Research',
    'Conference paper on tax compliance, awareness, and education strategies',
    'PDF',
    'https://www.econstor.eu/bitstream/10419/56066/3/Amran_Lai_conference-paper.pdf',
    'tax-compliance-research.pdf',
    0,
    'application/pdf',
    'INCOME_TAX',
    'ALL',
    'PUBLISHED',
    1,
    true,
    false,
    0,
    0,
    NOW(),
    NOW()
);

-- Verify the resources were added
SELECT id, title, resource_type, file_path, uploaded_at 
FROM resources 
WHERE file_path LIKE 'http%'
ORDER BY uploaded_at DESC;
