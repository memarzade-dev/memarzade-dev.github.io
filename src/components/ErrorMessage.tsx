import { motion } from 'motion/react';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({ 
  message = 'Something went wrong. Please try again.', 
  onRetry,
  fullScreen = false 
}: ErrorMessageProps) {
  const content = (
    <motion.div
      className="flex flex-col items-center gap-6 p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <AlertCircle className="w-16 h-16 text-[rgb(var(--color-error))]" />
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Oops!</h3>
        <p className="text-[rgb(var(--color-text-muted))] max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgb(var(--color-bg-base))] z-50">
        {content}
      </div>
    );
  }

  return content;
}
