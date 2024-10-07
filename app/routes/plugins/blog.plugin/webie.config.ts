import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Blog',
        adminRoutes: [
            {
                label: 'Posts',
                to: 'posts',
                iconName: 'pen',
            },
            {
                label: 'Taxonomies',
                to: 'taxonomy',
                iconName: 'tag',
            },
        ],
        dependencies: ['_web'],
    }
}

export default config
