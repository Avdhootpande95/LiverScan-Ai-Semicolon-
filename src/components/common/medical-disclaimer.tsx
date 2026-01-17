import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function MedicalDisclaimer() {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="font-headline">Medical Disclaimer</AlertTitle>
      <AlertDescription>
        This tool is for educational and screening purposes only and does not
        replace professional medical diagnosis. Consult a healthcare provider for any health concerns.
      </AlertDescription>
    </Alert>
  );
}
