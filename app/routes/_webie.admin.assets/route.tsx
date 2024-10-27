import { useState } from 'react'
import { Label } from '~/components/ui/label'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_webie.admin/components/admin-wrapper'

export default function AdminAsset() {
    const [display, setDisplay] = useState('all')
    const [open, setOpen] = useState(false)

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle description="Manage all your assets on Webie platform">
                    Assets
                </AdminTitle>
                <AdminActions>
                    <Label htmlFor="asset-filter">Filter by</Label>
                    <Select defaultValue="all">
                        <SelectTrigger id="asset-filter" className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="images">Images</SelectItem>
                            <SelectItem value="videos">Videos</SelectItem>
                            <SelectItem value="audios">Audios</SelectItem>
                            <SelectItem value="files">Files</SelectItem>
                        </SelectContent>
                    </Select>
                </AdminActions>
            </AdminHeader>
        </AdminSectionWrapper>
    )
}
