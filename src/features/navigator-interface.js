import { DDGPromise } from '../utils'
import { defineProperty } from '../wrapper-utils'
import ContentFeature from '../content-feature'

function injectNavigatorInterface (args) {
    try {
        // @ts-expect-error https://app.asana.com/0/1201614831475344/1203979574128023/f
        if (navigator.duckduckgo) {
            return
        }
        if (!args.platform || !args.platform.name) {
            return
        }
        defineProperty(Navigator.prototype, 'duckduckgo', {
            value: {
                platform: args.platform.name,
                isDuckDuckGo () {
                    return DDGPromise.resolve(true)
                },
                taints: new Set(),
                taintedOrigins: new Set()
            },
            enumerable: true,
            configurable: false,
            writable: false
        })
    } catch {
        // todo: Just ignore this exception?
    }
}

export default class NavigatorInterface extends ContentFeature {
    load (args) {
        if (this.matchDomainFeatureSetting('privilegedDomains').length) {
            injectNavigatorInterface(args)
        }
    }

    init (args) {
        injectNavigatorInterface(args)
    }
}
