import { cva, type VariantProps } from "class-variance-authority";

// Image base variants
export const imageBaseVariants = cva("block", {
  variants: {
    withPlaceholder: {
      "with-placeholder": "bg-muted",
      "no-placeholder": "",
    },
  },
  defaultVariants: {
    withPlaceholder: "no-placeholder",
  },
});

// Image fit variants 
export const imageFitVariants = cva("", {
  variants: {
    fit: {
      contain: "object-contain",
      cover: "object-cover",
      fill: "object-fill",
      "scale-down": "object-scale-down",
      none: "object-none"
    }
  },
  defaultVariants: {
    fit: "cover"
  }
});

// Image position variants
export const imagePositionVariants = cva("", {
  variants: {
    position: {
      center: "object-center",
      top: "object-top",
      "right-top": "object-top object-right",
      right: "object-right",
      "right-bottom": "object-bottom object-right",
      bottom: "object-bottom",
      "left-bottom": "object-bottom object-left",
      left: "object-left",
      "left-top": "object-top object-left"
    }
  },
  defaultVariants: {
    position: "center"
  }
});

// Aspect ratio variants
export const aspectRatioVariants = cva("", {
  variants: {
    aspect: {
      auto: "",
      square: "aspect-square",
      video: "aspect-video"
    }
  },
  defaultVariants: {
    aspect: "auto"
  }
});

export interface ImageFitProps extends VariantProps<typeof imageFitVariants> {}
export interface ImagePositionProps extends VariantProps<typeof imagePositionVariants> {}
export interface AspectRatioProps extends VariantProps<typeof aspectRatioVariants> {} 
export interface ImageBaseProps extends VariantProps<typeof imageBaseVariants> {}