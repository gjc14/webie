/**
 * Read all the plugin configs from the `app/routes/plugins/*.plugin/webie.config.ts`
 */
export const getPluginConfigs = async (): Promise<WebieConfig[]> => {
    const modules = import.meta.glob(
        '/app/routes/plugins/*.plugin/webie.config.ts',
        {
            import: 'default',
        }
    )

    const configs = []

    for (const path in modules) {
        try {
            const mod = await modules[path]()

            if (typeof mod !== 'function') {
                throw new TypeError(`Invalid Webie config type ${typeof mod}`)
            }

            const config = mod()
            const { success, error, data } = WebieConfigSchema.safeParse(config)

            if (!success) {
                throw new TypeError(`Invalid Webie config type: ${error}`)
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

const WebieConfigSchema = z.object({
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
            })
        )
        .optional(),
    dependencies: z.array(z.string()).optional(),
})
export type WebieConfig = z.infer<typeof WebieConfigSchema>
