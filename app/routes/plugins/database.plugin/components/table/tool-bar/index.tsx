import { Link, useFetcher, useNavigate } from '@remix-run/react'
import { Settings } from 'lucide-react'
import { ReactNode } from 'react'

import { ThemeToggle } from '~/components/theme-toggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { useTable } from '../../../lib/hooks/table'
import { AddColumnPopover } from './add-column'
import { ToolBarAlert } from './tool-bar-alert'

const ToolBarWrapper = ({ children }: { children?: ReactNode }) => {
    return (
        <div className="w-full h-fit flex items-center gap-1 p-1 bg-primary-foreground rounded-md border border-border">
            {children}
        </div>
    )
}

type ToolBarProps = {
    onSaveRows: () => void
}

const ToolBar = ({ onSaveRows }: ToolBarProps) => {
    const { addRow, isRowsDirty } = useTable()

    return (
        <ToolBarWrapper>
            {/* Form part */}

            <Button
                size={'sm'}
                variant={'ghost'}
                onClick={onSaveRows}
                disabled={!isRowsDirty}
            >
                Save
            </Button>

            <Separator orientation="vertical" className="h-4/5" />

            {/* Function area */}
            <Button size={'sm'} variant={'ghost'} onClick={addRow}>
                Add row
            </Button>

            {/* Config area */}
            <div className="ml-auto flex items-center justify-end gap-1.5">
                <Link to={'edit'} state={{}}>
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

const ToolBarEditMode = () => {
    const fetcher = useFetcher()
    const navigate = useNavigate()
    const { tableConfigState, isTableConfigDirty, addColumn } = useTable()

    return (
        <ToolBarWrapper>
            {/* Function area */}
            <AddColumnPopover
                onTypeSelect={type => {
                    addColumn(type)
                }}
            >
                <Button variant="ghost" size="sm">
                    Add column
                </Button>
            </AddColumnPopover>

            {/* Config area */}
            <fetcher.Form
                id="tableConfigForm"
                onSubmit={e => {
                    e.preventDefault()

                    const formData = new FormData(e.currentTarget)

                    const tableConfigString = JSON.stringify(tableConfigState)
                    formData.set('tableConfig', tableConfigString)

                    fetcher.submit(formData, {
                        method: 'POST',
                    })
                }}
            />
            <div className="ml-auto flex items-center justify-end gap-1.5">
                <Button
                    size={'sm'}
                    form="tableConfigForm"
                    disabled={!isTableConfigDirty}
                >
                    Save
                </Button>
                {isTableConfigDirty ? (
                    <ToolBarAlert
                        promptTitle={'Discard changes'}
                        promptMessage={
                            'Are you sure you want to discard changes?'
                        }
                        executeMessage={'Discard'}
                        execute={() => {
                            // No need to reset the tableConfig, the table main page will reset the whole table
                            navigate('..', {
                                replace: true,
                                relative: 'path',
                            })
                        }}
                    >
                        <Button size={'sm'} variant={'ghost'}>
                            Discard
                        </Button>
                    </ToolBarAlert>
                ) : (
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() =>
                            navigate('..', {
                                replace: true,
                                relative: 'path',
                            })
                        }
                    >
                        Discard
                    </Button>
                )}

                <ThemeToggle className="ml-auto mr-3 scale-90" />
            </div>
        </ToolBarWrapper>
    )
}

export { ToolBar, ToolBarEditMode }
