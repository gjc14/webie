import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Blog',
        adminRoutes: [
            {
                title: 'Posts',
                url: 'posts',
                iconName: 'pen',
            },
            {
                title: 'Taxonomies',
                url: 'taxonomy',
                iconName: 'tag',
            },
        ],
    }
}

export default config
