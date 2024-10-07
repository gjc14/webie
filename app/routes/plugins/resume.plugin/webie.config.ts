import type { WebieConfig } from '../utils/get-plugin-configs.server'

const config = (): WebieConfig => {
    return {
        pluginName: 'Resume',
        dependencies: ['_web'],
    }
}

export default config
