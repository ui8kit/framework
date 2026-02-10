import { ElementType, forwardRef, ReactNode } from "react";
import { cn } from "../../lib/utils";
import { resolveUtilityClassName, ux, type UtilityPropBag, type UtilityPropPrefix } from "../../lib/utility-props";

type ContainerDomProps = Omit<React.HTMLAttributes<HTMLElement>, UtilityPropPrefix>;

export type ContainerProps = ContainerDomProps & UtilityPropBag & {
  component?: ElementType;
  className?: string;
  children?: ReactNode;
};

const defaultProps = ux({
  max: 'w-7xl',
  mx: 'auto',
  px: '4'
});

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({
    component = "div",
    children,
    className,
    ...props
  }, ref) => {
    const { utilityClassName, rest } = resolveUtilityClassName(props);

    const Element = component as ElementType;

    // Use provided data-class or default to "container"
    const dataClass = (rest as any)['data-class'] || 'container';

    // When flex layout props (flex, gap, items, justify) are used, add display: flex
    // so gap/items/justify work. flex="col" alone gives flex-col but not display: flex.
    const needsFlex =
      'flex' in props || 'gap' in props || 'items' in props || 'justify' in props;

    return (
      <Element
        ref={ref}
        data-class={dataClass}
        className={cn(
          defaultProps,
          needsFlex && 'flex',
          utilityClassName,
          className
        )}
        {...rest}
      >
        {children}
      </Element>
    );
  }
);

Container.displayName = "Container"; 