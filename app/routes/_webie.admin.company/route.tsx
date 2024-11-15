import { NavLink, Outlet, useOutletContext } from '@remix-run/react'

import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'
import { useAdminContext } from '../_webie.admin/route'

const AdminCompanyRoutes = [
    { to: '.', title: 'Profile' },
    { to: 'billing', title: 'Billing' },
    { to: 'notification', title: 'Notification' },
    { to: 'security', title: 'Security' },
]

export default function AdminCompany() {
    const admin = useAdminContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle>Company</AdminTitle>
            </AdminHeader>
            <nav className="flex gap-2 border-b">
                {AdminCompanyRoutes.map((route, i) => (
                    <AdminCompanyLink
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

const AdminCompanyLink = ({ to, title }: { to: string; title: string }) => {
    return (
        <NavLink to={to} className="group flex items-center gap-2">
            <p className="text-sm">{title}</p>
        </NavLink>
    )
}
