export interface Page {
    name: string
    url: string
    soon?: boolean
}

export const siteRoutes: string[] = [
    // ...Company.map(page => page.url),    // Page[]
    // ...Policies.map(page => `/policies/${page.url}`),   // Page[]
]

export const Footer = () => {
    return (
        <footer className="w-full py-3 px-6 mt-auto flex flex-col-reverse items-center justify-center gap-2 lg:flex-row lg:gap-8 border-t">
            <p className="text-sm text-primary">
                Built somewhere on the 🌏. © 2024{' '}
                <a
                    href="https://webie.dev"
                    aria-label="Go to webie"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Go to the Webie website"
                    className="hover:underline"
                >
                    Webie
                </a>
            </p>
        </footer>
    )
}
