// components/ui/input.tsx
"use client"

import * as React from "react"
import { cn } from "../../lib/utils"
import { X, Check } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  onClear?: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, onClear, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [value, setValue] = React.useState(
      props.value || props.defaultValue || "",
    )
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useImperativeHandle(ref, () => inputRef.current!)

    const handleClear = () => {
      setValue("")
      onClear?.()
      inputRef.current?.focus()

      // Trigger change event
      const event = new Event("change", { bubbles: true })
      inputRef.current?.dispatchEvent(event)
    }

    return (
      <div className="w-full space-y-1.5">
        
        <div className="relative">
          <input
            type={type}
            className={cn(
              "w-full px-3 py-2 rounded-lg",
              "bg-[#11224e]",
              "border border-zinc-200 ",
              "text-sm text-white",
              "placeholder:text-white",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2",
              error && "border-destructive focus:ring-destructive/20",
              success && "border-success focus:ring-success/20",
              !error && !success && "focus:ring-primary/20",
              isFocused && !error && !success && "border-primary",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              className,
            )}
            ref={inputRef}
            onChange={(e) => {
              setValue(e.target.value)
              props.onChange?.(e)
            }}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            value={value}
            {...props}
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2",
                "p-1 rounded-md",
                "text-muted-foreground hover:text-foreground",
                "transition-colors",
              )}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Status indicator */}
          {(error || success) && (
            <div className="absolute -right-6 top-1/2 -translate-y-1/2">
              {error ? (
                <X className="h-4 w-4 text-destructive" />
              ) : (
                <Check className="h-4 w-4 text-success" />
              )}
            </div>
          )}
        </div>

        {/* Error/Success message */}
        {(error || success) && (
          <p
            className={cn(
              "text-sm",
              error ? "text-destructive" : "text-success",
            )}
          >
            {error || success}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
