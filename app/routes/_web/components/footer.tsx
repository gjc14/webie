import { Link } from '@remix-run/react'

export const Footer = () => {
    return (
        <footer className="w-full py-3 px-6 mt-16 flex flex-col-reverse items-center justify-center gap-2 lg:flex-row lg:gap-8 border-t">
            <p className="text-sm text-primary">
                Built somewhere on the 🌏. © Webie 2024
            </p>
        </footer>
    )
}
