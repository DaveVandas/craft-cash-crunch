import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (value: number) => void;
  allowDecimals?: boolean;
}

/**
 * A numeric input that handles the "highlight and delete" UX properly.
 * When the user clears the field, it shows empty instead of "0",
 * allowing them to type a new number without the leading 0 issue.
 */
const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, value, onChange, allowDecimals = true, ...props }, ref) => {
    // Track the display value as a string to handle empty state
    const [displayValue, setDisplayValue] = React.useState<string>(
      value === 0 ? '' : String(value)
    );

    // Sync display value when external value changes (e.g., from presets)
    React.useEffect(() => {
      // Only update if the numeric value actually changed
      const currentNumeric = displayValue === '' ? 0 : parseFloat(displayValue);
      if (currentNumeric !== value) {
        setDisplayValue(value === 0 ? '' : String(value));
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      
      // Allow empty string
      if (rawValue === '') {
        setDisplayValue('');
        onChange(0);
        return;
      }

      // Validate the input
      const regex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
      if (!regex.test(rawValue)) {
        return;
      }

      setDisplayValue(rawValue);
      
      // Parse and emit the numeric value
      const numericValue = allowDecimals ? parseFloat(rawValue) : parseInt(rawValue, 10);
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode={allowDecimals ? "decimal" : "numeric"}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
        {...props}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";

export { NumericInput };
