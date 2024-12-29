import type { PapaConfig } from '../utils/get-plugin-configs.server'

const config = (): PapaConfig => {
    return {
        pluginName: 'Blog',
    }
}

export default config
