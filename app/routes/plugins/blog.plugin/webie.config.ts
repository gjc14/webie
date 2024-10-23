import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Blog',
        adminRoutes: [
            {
                title: 'Blog',
                url: 'blog',
                iconName: 'pen',
                sub: [
                    {
                        title: 'Taxonomies',
                        url: 'taxonomy',
                    },
                    {
                        title: 'Generative AI',
                        url: 'generative',
                    },
                ],
            },
        ],
    }
}

export default config
