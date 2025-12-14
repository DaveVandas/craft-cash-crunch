import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface SalaryInputProps {
  onSalaryChange: (salary: number) => void;
  currentSalary: number;
}

const SalaryInput = ({ onSalaryChange, currentSalary }: SalaryInputProps) => {
  const [inputValue, setInputValue] = useState(currentSalary ? currentSalary.toString() : '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    const numValue = parseInt(value) || 0;
    onSalaryChange(numValue);
  };

  const formatDisplay = (value: string) => {
    if (!value) return '';
    return parseInt(value).toLocaleString();
  };

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Your Annual Salary
        </CardTitle>
        <CardDescription>
          Enter your yearly income to see how it compares to the world's wealthiest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
            $
          </span>
          <Input
            type="text"
            inputMode="numeric"
            value={formatDisplay(inputValue)}
            onChange={handleChange}
            placeholder="50,000"
            className="pl-10 text-3xl h-16 font-mono bg-background border-border/50 focus:border-primary"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Don't worry, we don't store this. It's just for the comparison.
        </p>
      </CardContent>
    </Card>
  );
};

export default SalaryInput;
