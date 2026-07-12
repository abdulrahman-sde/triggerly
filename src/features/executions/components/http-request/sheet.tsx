"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const httpMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores",
    }),
  endpoint: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  method: z.enum(httpMethods),
  body: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function HttpRequestSheet({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => void;
  defaultValues?: Partial<FormValues>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      method: "GET",
      endpoint: "",
      variableName: "",
      body: "",
      ...defaultValues,
    },
  });

  const method = form.watch("method");
  const showBody = method === "POST" || method === "PUT" || method === "PATCH";

  useEffect(() => {
    if (open) {
      form.reset({
        method: "GET",
        endpoint: "",
        variableName: "",
        body: "",
        ...defaultValues,
      });
    }
  }, [open, defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure HTTPS Request</SheetTitle>
          <SheetDescription>
            Configure the details for your HTTPS request node.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="grid gap-4 px-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="variableName">Variable Name</Label>
              <Input
                id="variableName"
                placeholder="e.g. responseData"
                {...form.register("variableName")}
              />
              <p className="text-xs text-muted-foreground">
                Reference this node's response downstream via{" "}
                <code className="text-[10px]">{`{{variableName.httpresponse.data}}`}</code>
              </p>
              {form.formState.errors.variableName && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.variableName.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">Method</Label>
              <Select
                value={form.watch("method")}
                onValueChange={(value) =>
                  form.setValue("method", value as FormValues["method"])
                }
              >
                <SelectTrigger id="method" className="w-full">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {httpMethods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                HTTP method for the request
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endpoint">Endpoint</Label>
              <Input
                id="endpoint"
                placeholder="https://api.example.com/data"
                {...form.register("endpoint")}
              />
              <p className="text-xs text-muted-foreground">
                Use{" "}
                <code className="text-[10px]">{`{{variableName.httpresponse.data}}`}</code>{" "}
                to reference data from previous nodes
              </p>
              {form.formState.errors.endpoint && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.endpoint.message}
                </p>
              )}
            </div>

            {showBody && (
              <div className="grid gap-2">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  placeholder='{"key": "value"}'
                  className="min-h-[100px] font-mono text-xs"
                  {...form.register("body")}
                />
                <p className="text-xs text-muted-foreground">
                  Use{" "}
                  <code className="text-[10px]">{`{{variableName.httpresponse.data}}`}</code>{" "}
                  to reference data from previous nodes
                </p>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto">
            <Button type="submit">Save</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
