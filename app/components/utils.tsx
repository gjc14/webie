import { IconProps } from '@radix-ui/react-icons/dist/types'
import { LucideIcon, LucideProps } from 'lucide-react'
import { forwardRef } from 'react'

export const convertRadixToLucideIcon = (
    IconComponent: React.ForwardRefExoticComponent<
        IconProps & React.RefAttributes<SVGSVGElement>
    >
): LucideIcon => {
    return forwardRef<SVGSVGElement, LucideProps>((props, ref) => {
        const { children, ...restProps } = props
        return <IconComponent {...restProps} ref={ref} />
    })
}
