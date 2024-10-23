import { Separator } from '~/components/ui/separator'
import {
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'

export default function AdminGAI() {
    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle description="Generative AI powers all the content generating for you!">
                    Generative AI
                </AdminTitle>
            </AdminHeader>
            <Separator />
            <h3>OpenAI</h3>
            <h3>Google AI</h3>
        </AdminSectionWrapper>
    )
}
