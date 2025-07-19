// src/components/ui/dynamic-form.tsx

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

// Tipagem para cada campo do formulário
export interface FormFieldConfig {
  name: string;
  label: string;
  type:
    | 'input'
    | 'number'
    | 'select'
    | 'textarea'
    | 'switch'
    | 'checkbox'
    | 'range';
  placeholder?: string;
  description?: string;
  options?: { value: string; label: string }[]; // Para 'select'
}

// Props do componente DynamicForm
interface DynamicFormProps {
  formSchema: z.ZodObject<any, any, any>;
  formFields: FormFieldConfig[];
  onSubmit: (values: z.infer<any>) => void;
  defaultValues: Record<string, any>;
  submitButtonText?: string;
}

export function DynamicForm({
  formSchema,
  formFields,
  onSubmit,
  defaultValues,
  submitButtonText = 'Enviar',
}: DynamicFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const renderField = (fieldConfig: FormFieldConfig, rhfField: any) => {
    switch (fieldConfig.type) {
      case 'input':
        return <Input placeholder={fieldConfig.placeholder} {...rhfField} />;
      case 'number':
        return (
          <Input
            type="number"
            placeholder={fieldConfig.placeholder}
            {...rhfField}
            onChange={(e) => rhfField.onChange(parseInt(e.target.value, 10))}
          />
        );
      case 'textarea':
        return <Textarea placeholder={fieldConfig.placeholder} {...rhfField} />;
      case 'select':
        return (
          <Select
            onValueChange={rhfField.onChange}
            defaultValue={rhfField.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={fieldConfig.placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fieldConfig.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'switch':
        return (
          <FormControl>
            <Switch
              checked={rhfField.value}
              onCheckedChange={rhfField.onChange}
            />
          </FormControl>
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={rhfField.value}
                onCheckedChange={rhfField.onChange}
              />
            </FormControl>
            <FormLabel>{fieldConfig.label}</FormLabel>
          </div>
        );
      case 'range':
        return (
          <FormControl>
            <Slider
              defaultValue={[rhfField.value]}
              onValueChange={(value) => rhfField.onChange(value[0])}
              max={100}
              step={1}
            />
          </FormControl>
        );
      default:
        return <Input {...rhfField} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {formFields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field }) => (
              <FormItem>
                {/* Checkbox é um caso especial que renderiza o label ao lado */}
                {fieldConfig.type !== 'checkbox' && (
                  <FormLabel>{fieldConfig.label}</FormLabel>
                )}

                {renderField(fieldConfig, field)}

                {fieldConfig.description && (
                  <FormDescription>{fieldConfig.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit">{submitButtonText}</Button>
      </form>
    </Form>
  );
}
