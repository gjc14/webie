import { NavLink, Outlet, useOutletContext } from '@remix-run/react'

import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { useAdminContext } from '../_webie.admin/route'

const AdminAccountRoutes = [
    { to: '.', title: 'Profile' },
    { to: 'billing', title: 'Billing' },
    { to: 'notification', title: 'Notification' },
    { to: 'security', title: 'Security' },
]

export default function AdminAccount() {
    const admin = useAdminContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle>Account</AdminTitle>
            </AdminHeader>
            <nav className="flex gap-2 border-b">
                {AdminAccountRoutes.map((route, i) => (
                    <AdminAccountLink
                        key={i}
                        to={route.to}
                        title={route.title}
                    />
                ))}
            </nav>
            <Outlet context={admin} />
        </AdminSectionWrapper>
    )
}

export const useAccountContext = () => {
    return useOutletContext<typeof useAdminContext>()
}

const AdminAccountLink = ({ to, title }: { to: string; title: string }) => {
    return (
        <NavLink to={to} className="group flex items-center gap-2">
            <p className="text-sm">{title}</p>
        </NavLink>
    )
}
