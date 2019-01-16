import { getConfig, setConfig, resetConfig } from '../config'

const initialConfig = {
    initialState: {
        pending: false,
        error: false,
        data: []
    }
}

describe('config', () => {
    it('get config', () => {
        const config = getConfig()

        expect(config).toMatchObject(initialConfig)
    })

    it('resets config', () => {
        setConfig({
            initialState: {}
        })

        let config = getConfig()

        expect(config).toMatchObject({
            initialState: {}
        })

        resetConfig()

        config = getConfig()

        expect(config).toMatchObject(initialConfig)
    })

    it('set config, deep merge', () => {
        setConfig({
            initialState: {},
            newConfig: {
                data: 1
            }
        })

        const config = getConfig()

        expect(config).toMatchObject({
            initialState: {},
            newConfig: {
                data: 1
            }
        })

        resetConfig()
    })
})
