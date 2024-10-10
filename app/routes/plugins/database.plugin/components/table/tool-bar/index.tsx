import { Link } from '@remix-run/react'
import { Settings } from 'lucide-react'
import { ReactNode } from 'react'

import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { SerializedLoaderData } from '../../../_webie.db.$table/route'
import { webieColType } from '../../../schema/table'
import { AddColumnPopover } from './add-column'

const ToolBarWrapper = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="w-full h-fit flex items-center gap-1 p-1 bg-primary-foreground rounded-md border border-border">
            {children}
        </div>
    )
}

type ToolBarProps = {
    tableConfig: SerializedLoaderData['tableConfig']
    isDirty: boolean
    createRow: () => void
}

const ToolBar = ({ tableConfig, isDirty, createRow }: ToolBarProps) => {
    return (
        <ToolBarWrapper>
            <Button
                size={'sm'}
                variant={'ghost'}
                form="rowDataForm"
                disabled={!isDirty}
            >
                Save
            </Button>

            <Separator orientation="vertical" className="h-4/5" />

            {/* Function area */}
            <Button size={'sm'} variant={'ghost'} onClick={createRow}>
                Add row
            </Button>

            {/* Config area */}
            <div className="ml-auto flex items-center justify-end gap-1.5">
                <Link to={'edit'} state={{ tableConfig }}>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        className="h-auto p-2"
                    >
                        <Settings size={16} />
                    </Button>
                </Link>

                <ThemeToggle className="ml-auto mr-3 scale-90" />
            </div>
        </ToolBarWrapper>
    )
}

type ToolBarEditModeProps = {
    isDirty: boolean
    createColumn: (type: webieColType) => void
}

const ToolBarEditMode = ({ isDirty, createColumn }: ToolBarEditModeProps) => {
    return (
        <ToolBarWrapper>
            {/* Function area */}
            <AddColumnPopover
                onTypeSelect={type => {
                    createColumn(type)
                }}
            >
                <Button variant="ghost" size="sm">
                    Add column
                </Button>
            </AddColumnPopover>

            {/* Config area */}
            <div className="ml-auto flex items-center justify-end gap-1.5">
                <Button size={'sm'} form="tableConfigForm" disabled={!isDirty}>
                    Save
                </Button>
                <Link to={'..'} relative="path" replace={true}>
                    <Button size={'sm'} variant={'ghost'}>
                        Cancel
                    </Button>
                </Link>

                <ThemeToggle className="ml-auto mr-3 scale-90" />
            </div>
        </ToolBarWrapper>
    )
}

export { ToolBar, ToolBarEditMode }
