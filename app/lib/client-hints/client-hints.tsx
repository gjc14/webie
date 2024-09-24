/**
 * This file contains utilities for using client hints for user preference which
 * are needed by the server, but are only known by the browser.
 */
import { clientHint as colorSchemeHint } from './color-schema'
import { getHintUtils } from './index'

const hintsUtils = getHintUtils(
	{ theme: colorSchemeHint }
	// add other hints here
)

export const { getHints } = hintsUtils

/**
 * @returns inline script element that checks for client hints and sets cookies
 * if they are not set then reloads the page, or if any cookie was set to an
 * inaccurate value.
 */
export function ClientHintCheck() {
	return (
		<script
			dangerouslySetInnerHTML={{
				__html: hintsUtils.getClientHintCheckScript(),
			}}
		/>
	)
}
