export interface DateTimeInputProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  min?: string;
  max?: string;
}