import { vitePlugin as remix } from '@remix-run/dev'
import { flatRoutes } from 'remix-flat-routes'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_relativeSplatPath: true,
                v3_throwAbortReason: true,
                v3_singleFetch: true,
                v3_lazyRouteDiscovery: true,
            },
            routes: async defineRoutes => {
                // TODO: Exclude papa.config.ts
                return flatRoutes(
                    ['routes', ...getPluginRoutes()],
                    defineRoutes
                )
            },
        }),
        tsconfigPaths(),
    ],
    ssr: {
        noExternal: ['lucide-react', 'react-dropzone'],
    },
})

/**
 * Get all plugin folder which match *.plugin in directory /app/routes/plugins as flat route.
 */
import * as fs from 'fs'
import * as path from 'path'

const pluginsDir = path.join(__dirname, 'app', 'routes', 'plugins')

function getPluginRoutes(): string[] {
    try {
        const files = fs.readdirSync(pluginsDir)
        return files
            .filter(file => file.endsWith('.plugin'))
            .map(file => path.join('routes', 'plugins', file))
    } catch (error) {
        console.error('Error reading plugins directory:', error)
        return []
    }
}
