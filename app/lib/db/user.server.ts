import { Prisma, User } from '@prisma/client'
import { UserRole, UserStatus } from '~/schema/database'
import { prisma } from './_db.server'

export const getUsers = async (): Promise<{ users: User[] }> => {
	const users = await prisma.user.findMany()
	return { users }
}

export const getAdminUsers = async (): Promise<{ users: User[] }> => {
	const users = await prisma.user.findMany({ where: { role: 'ADMIN' } })
	return { users }
}

export const getUser = async (email: string): Promise<{ user: User | null }> => {
	const user = await prisma.user.findFirst({ where: { email } })
	return { user }
}

export const getUserById = async (id: string): Promise<{ user: User | null }> => {
	const user = await prisma.user.findFirst({ where: { id } })
	return { user }
}

export const createUser = async (email: string, role: UserRole, status: UserStatus): Promise<{ user: User }> => {
	const user = await prisma.user.create({
		data: {
			email,
			role,
			status,
		},
	})
	return { user }
}

export const updateUser = async (props: {
	id: string
	data: Prisma.UserUpdateManyMutationInput
}): Promise<{ user: User }> => {
	const { email, name, role, status } = props.data

	const user = await prisma.user.update({
		where: { id: props.id },
		data: {
			email,
			name,
			role,
			status,
		},
	})
	return { user }
}

export const deleteUser = async (id: Prisma.UserWhereUniqueInput): Promise<{ user: User }> => {
	const user = await prisma.user.delete({
		where: id,
	})
	return { user }
}
