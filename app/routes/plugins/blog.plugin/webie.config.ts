import type { WebieConfig } from '~/lib/webie/get-plugin-configs.server'

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
    }
}

export default config
