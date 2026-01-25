import { cva, type VariantProps } from "class-variance-authority";

// Base card variants (style/variant collapses to "card")
export const cardStyleVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm", {
  variants: {
    variant: {
      default: "border-border",
      outlined: "border-border shadow-none",
      filled: "border-transparent bg-muted/50",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Sub-entity variants → card-header, card-title, etc.
export const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6");

export const cardTitleVariants = cva("text-2xl font-semibold leading-none tracking-tight");

export const cardDescriptionVariants = cva("text-sm text-muted-foreground");

export const cardContentVariants = cva("p-6 pt-0");

export const cardFooterVariants = cva("flex items-center p-6 pt-0");

export interface CardHeaderProps extends VariantProps<typeof cardHeaderVariants> {}
export interface CardTitleProps extends VariantProps<typeof cardTitleVariants> {}
export interface CardDescriptionProps extends VariantProps<typeof cardDescriptionVariants> {}
export interface CardContentProps extends VariantProps<typeof cardContentVariants> {}
export interface CardFooterProps extends VariantProps<typeof cardFooterVariants> {}
export type CardVariantProps = VariantProps<typeof cardStyleVariants> & VariantProps<typeof cardHeaderVariants> & VariantProps<typeof cardTitleVariants> & VariantProps<typeof cardDescriptionVariants> & VariantProps<typeof cardContentVariants> & VariantProps<typeof cardFooterVariants>;
export type CardProps = CardVariantProps & CardHeaderProps & CardTitleProps & CardDescriptionProps & CardContentProps & CardFooterProps;
