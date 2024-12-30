import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData, useSubmit } from '@remix-run/react'
import { useEffect, useState } from 'react'

import { Label } from '~/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select'
import { prisma, S3 } from '~/lib/db/_db.server'
import { capitalize, ConventionalActionResponse } from '~/lib/utils'
import {
    AdminActions,
    AdminHeader,
    AdminSectionWrapper,
    AdminTitle,
} from '~/routes/_papa.admin/components/admin-wrapper'
import {
    FileMeta,
    FileMetaSchema,
} from '../_papa.admin.api.object-storage/schema'
import { FileGrid } from './components/file-grid'

const displayOptions = ['all', 'image', 'video', 'audio', 'file'] as const

export const action = async ({ request }: ActionFunctionArgs) => {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 })
    }

    const formData = await request.formData()
    const newFileMetaString = formData.get('newFileMeta')

    if (!newFileMetaString || typeof newFileMetaString !== 'string') {
        return new Response('Invalid file metadata', { status: 400 })
    }

    const {
        success,
        data: newFileMetaData,
        error,
    } = FileMetaSchema.safeParse(JSON.parse(newFileMetaString))
    if (!success) {
        return {
            err: 'Invalid file metadata',
        } satisfies ConventionalActionResponse
    }

    try {
        await prisma.objectStorage.update({
            where: {
                id: newFileMetaData.id,
                key: newFileMetaData.key,
            },
            data: {
                name: newFileMetaData.name,
                description: newFileMetaData.description,
            },
        })
        return {
            msg: 'File updated',
            data: newFileMetaData,
        } satisfies ConventionalActionResponse
    } catch (error) {
        console.log('Error updating file', error)
        return {
            err: 'Failed to update file',
        } satisfies ConventionalActionResponse
    }
}

import { loader } from '../_papa.admin.assets.resource/route'
export { loader } from '../_papa.admin.assets.resource/route'

export default function AdminAsset() {
    const submit = useSubmit()
    const { files } = useLoaderData<typeof loader>()
    const [filesState, setFilesState] = useState(files)
    const [display, setDisplay] = useState('all')

    const filesDisplayed = filesState.filter(file => {
        if (display === 'all') return true
        if (display === 'file') {
            const fileGeneralType = file.type.split('/')[0]
            return !['image', 'video', 'audio'].includes(fileGeneralType)
        }
        const fileGeneralType = file.type.split('/')[0]
        return fileGeneralType === display
    })

    useEffect(() => {
        setFilesState(files)
    }, [files])

    return (
        <AdminSectionWrapper>
            <AdminHeader>
                <AdminTitle
                    title="Assets"
                    description="Manage all your assets on Papa platform"
                ></AdminTitle>
                <AdminActions>
                    <Label htmlFor="asset-filter">Filter by</Label>
                    <Select
                        defaultValue="all"
                        onValueChange={v => {
                            setDisplay(v)
                        }}
                    >
                        <SelectTrigger id="asset-filter" className="w-[120px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {displayOptions.map(option => (
                                <SelectItem key={option} value={option}>
                                    {capitalize(option)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </AdminActions>
            </AdminHeader>
            <FileGrid
                files={filesDisplayed}
                onFileUpdate={fileMeta => {
                    setFilesState(
                        filesState.map(file =>
                            file.id === fileMeta.id ? fileMeta : file
                        )
                    )
                    submit(
                        { newFileMeta: JSON.stringify(fileMeta) },
                        {
                            method: 'POST',
                            navigate: false,
                        }
                    )
                }}
            />
        </AdminSectionWrapper>
    )
}
