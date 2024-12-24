/**
 * Read all the plugin configs from the `app/routes/plugins/*.plugin/papa.config.ts`
 */
export const getPluginConfigs = async (): Promise<PapaConfig[]> => {
    const modules = import.meta.glob(
        '/app/routes/plugins/*.plugin/papa.config.ts',
        {
            import: 'default',
        }
    )

    const configs = []

    for (const path in modules) {
        try {
            const mod = await modules[path]()

            if (typeof mod !== 'function') {
                throw new TypeError(`Invalid Papa config type ${typeof mod}`)
            }

            const config = mod()
            const { success, error, data } = PapaConfigSchema.safeParse(config)

            if (!success) {
                throw new TypeError(`Invalid Papa config type: ${error}`)
            }

            configs.push(data)
        } catch (error) {
            console.error(`Failed to load config from plugin ${path}. ${error}`)
        }
    }

    return configs
}

/**
 * Define the type for Plugin Config
 */
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { z } from 'zod'

const iconOptions = Object.keys(dynamicIconImports) as Array<
    keyof typeof dynamicIconImports
>

const PapaConfigSchema = z.object({
    pluginName: z.string(),
    /**
     * Used to generate button for `Admin` nav bar
     */
    adminRoutes: z
        .array(
            z.object({
                /**
                 * Which will show in the `Admin` nav bar
                 */
                title: z.string(),
                /**
                 * The path relative to the `admin` route.
                 */
                url: z.string(),
                /**
                 * Icon name from `lucide-react`
                 * zod enum should have at least one value
                 */
                iconName: z.enum([iconOptions[0], ...iconOptions.slice(1)]),
                /**
                 * The sub menu
                 */
                sub: z
                    .array(
                        z.object({
                            title: z.string(),
                            url: z.string(),
                        })
                    )
                    .optional(),
            })
        )
        .optional(),
    dependencies: z.array(z.string()).optional(),
})
export type PapaConfig = z.infer<typeof PapaConfigSchema>
export type PapaAdminMenuItem = NonNullable<PapaConfig['adminRoutes']>[number]
