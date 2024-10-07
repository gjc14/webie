import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Database',
        // adminRoutes: [
        //     {
        //         label: 'Database',
        //         to: 'db',
        //         iconName: 'database',
        //     },
        // ],
    }
}

export default config
