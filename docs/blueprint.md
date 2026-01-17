# **App Name**: LiverScan AI

## Core Features:

- CT Scan Upload and Analysis: Allow users to upload liver CT scan images (DICOM, PNG, JPG) and use an AI/ML model (CNN-based medical imaging model) to analyze the CT scan, classifying results into 'No tumor detected', 'Possible benign tumor', or 'Possible malignant tumor'.
- Confidence Display: Display the confidence percentage and a visual heatmap highlighting suspicious regions in the CT scan analysis.  Clearly state that results are AI-assisted and not a medical diagnosis.
- Blood Report Upload and Analysis: Allow users to upload blood reports (PDF, Image, Manual input), extract lab values using OCR and structured parsing, and automatically identify abnormal values (LFT, CBC, AFP, bilirubin, ALT, AST).
- Abnormal Value Explanation Tool: Explain which blood report values are abnormal, what they could indicate, and possible associated diseases (liver inflammation, fatty liver, anemia, infection). The LLM will use reasoning as a tool to provide comprehensive result explanations.
- Health Insights & Guidance: Provide possible health issues based on combined CT scan + blood report analysis and lifestyle improvements (diet, hydration, exercise), advising when to consult a specialist (hepatologist, oncologist).
- Firebase Integration: Utilize Firebase Authentication (email & Google login), Firebase Storage for medical files, and Firestore for reports and history. Enforce secure handling of medical data with user-specific access control and file encryption.
- Medical Disclaimer: Display a clear medical disclaimer on every result page: 'This tool is for educational and screening purposes only and does not replace professional medical diagnosis.'

## Style Guidelines:

- Primary color: Black (#000000) for the main UI elements.
- Secondary color: Neon ice blue (#CCFFFF) for accents and highlights to create a modern, high-tech feel.
- Background color: White (#FFFFFF) to provide contrast and ensure readability.
- Body font: 'PT Sans' (sans-serif) for a clean and modern user interface.
- Headline font: 'Space Grotesk' (sans-serif) for clear section headings, data labels, and concise explanations, pairing effectively with 'PT Sans'.
- Use recognizable medical icons. Employ visual cues (green = normal, yellow = borderline, red = abnormal) for scan and report values.
- Maintain a clean, sectioned layout with CT scan uploads, blood report uploads, and analysis results each in its own distinct area.
- Incorporate subtle animations (e.g., fade-in effects) during data loading and analysis.