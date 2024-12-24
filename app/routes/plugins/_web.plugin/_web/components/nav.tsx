import { NavLink } from '@remix-run/react'
import { motion } from 'framer-motion'
import { ThemeToggle } from '~/components/theme-toggle'

export const Nav = () => {
    return (
        <nav className="fixed z-10 w-max flex top-8 left-[50%] -translate-x-[50%] items-center gap-6 rounded-lg border-[1px] border-muted-foreground py-2 px-3.5 text-sm text-muted-foreground bg-primary-foreground/50 backdrop-blur-sm shadow-lg">
            <NavLink
                to="/"
                className="flex items-center gap-2"
                aria-label="go to home /"
            >
                {/* If your using an image, set your logo by putting your logo image in /public/logos folder, and activate the following. Remember to change the name of your logo file */}
                {/* <div className="bg-[url('/logos/mylogo-dark-size300.png')] dark:bg-[url('/logos/mylogo-light-size300.png')] bg-cover bg-center w-10 h-3.5" /> */}
                <span>🥔</span>
                <span className="hidden">Home</span>
            </NavLink>

            {/* Add your own routes here */}
            <CustomNav to="/blog">Blog</CustomNav>
            <CustomNav to="/cv">CV</CustomNav>
            <ThemeToggle className="border-0 rounded-full p-0" />
        </nav>
    )
}

const CustomNav = ({
    children,
    to,
}: {
    children: React.ReactNode
    to: string
}) => {
    return (
        <NavLink
            to={to}
            rel="nofollow"
            aria-label={`link to ${to}`}
            className="block overflow-hidden"
        >
            {({ isActive }) => {
                return (
                    <motion.div
                        whileHover={{ y: -20 }}
                        transition={{ ease: 'backInOut', duration: 0.5 }}
                        className="h-[20px] w-auto"
                    >
                        <span
                            className={`flex h-[20px] items-center ${
                                isActive ? 'text-primary' : ''
                            }`}
                        >
                            {children}
                        </span>
                        <span
                            className={`flex h-[20px] items-center text-primary ${
                                isActive ? 'text-primary' : ''
                            }`}
                        >
                            {children}
                        </span>
                    </motion.div>
                )
            }}
        </NavLink>
    )
}
