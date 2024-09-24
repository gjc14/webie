import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function parseArgs() {
	const args = process.argv.slice(2) // Slice node and script, only get the arguments

	let email = undefined
	args.forEach(arg => {
		if (arg.startsWith('--email=')) {
			email = arg.split('=')[1]
		}
	})
	return { email }
}

function isEmailValid(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

async function checkAndCreateAdmin() {
	try {
		// 查詢是否已經存在 admin
		const admin = await prisma.user.findFirst({
			where: { role: 'ADMIN' },
		})

		if (!admin) {
			console.log('CheckAdmin: Admin user does not exist. Creating...')

			// Get email from arguments
			const args = parseArgs()

			// Check if email exists
			const email = args.email || process.env.EMAIL
			if (!email) {
				console.error('CheckAdmin: Fail to create first admin user.')
				console.warn('You should provide your email via "--".\nRun: "npm run dev --email=your@ema.il" instead.')
				return process.exit(1)
			}

			// Check if email is valid
			if (!isEmailValid(email)) {
				console.error('CheckAdmin: Invalid email format.')
				return process.exit(1)
			}

			// Create admin user
			const newAdmin = await prisma.user.create({
				data: {
					email,
					role: 'ADMIN',
					status: 'ACTIVE',
				},
			})
			console.log('\nCheckAdmin: Admin user created:', newAdmin)
			console.warn(`\n* * * \nAdmin user created: ${newAdmin.email}\n* * *\n`)
		} else {
			console.log('CheckAdmin: Admin user already exists.\n')
		}
	} catch (error) {
		console.error('CheckAdmin: Error checking/creating admin user:', error)
	} finally {
		await prisma.$disconnect()
	}
}

checkAndCreateAdmin()
