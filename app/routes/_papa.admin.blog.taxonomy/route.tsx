import { PlusCircle } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import { DataTable } from '~/routes/_papa.admin/components/data-table'
import { TaxonomyDialog } from '~/routes/_papa.admin/components/taxonomy'
import { useAdminBlogContext } from '../_papa.admin.blog/route'
import { categoryColumns, tagColumns } from './components/columns'

export default function AdminTaxonomy() {
    const { tags, categories } = useAdminBlogContext()

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Taxonomy"
                    description="SEO data is connect to post or route. You could set in either here or in post or route."
                ></AdminTitle>
                <AdminActions>
                    <TaxonomyDialog tags={tags} categories={categories}>
                        <Button size={'sm'}>
                            <PlusCircle size={16} />
                            <p className="text-xs">Create Taxonomy</p>
                        </Button>
                    </TaxonomyDialog>
                </AdminActions>
            </AdminHeader>
            <Separator />
            <h3>Tags</h3>
            <DataTable columns={tagColumns} data={tags}>
                {table => (
                    <Input
                        placeholder="Filter tags..."
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
            <Separator />
            <h3>Categories</h3>
            <DataTable columns={categoryColumns} data={categories}>
                {table => (
                    <Input
                        placeholder="Filter category..."
                        value={
                            (table
                                .getColumn('name')
                                ?.getFilterValue() as string) ?? ''
                        }
                        onChange={event =>
                            table
                                .getColumn('name')
                                ?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
            </DataTable>
        </AdminSectionWrapper>
    )
}
