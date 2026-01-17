import { config } from 'dotenv';
config();

import '@/ai/flows/provide-health-insights.ts';
import '@/ai/flows/explain-abnormal-values.ts';
import '@/ai/flows/chat-about-blood-values.ts';
