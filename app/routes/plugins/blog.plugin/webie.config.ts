import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Blog',
    }
}

export default config
