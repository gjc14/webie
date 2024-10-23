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
                        title: 'Content AI',
                        url: 'ai',
                    },
                ],
            },
        ],
    }
}

export default config
