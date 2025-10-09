#  Portal

This repository contains the frontend code for the SmartLivingNEXT portal. The portal provides a web interface for managing Eclipse Data Connector (EDC) resources. 

## How to run this image
```shell
docker run -it --rm --name portal registry.int.smartlivingnext.de/registry/public/portal:latest
```

## Development

The portal is a frontend-only application built with Vite and React. For development, configure your Vite proxy to route API calls directly to your EDC management API.

### Running locally
```shell
cd frontend
npm install
npm run dev
```

### Configuration

Configure the EDC connection in your Vite development proxy or directly in the frontend application. The frontend communicates directly with the EDC management API.

The runtime behavior of the portal can be adjusted via the `config.js` file that is served next to the built assets (see `frontend/public/config.js` for the template). Set `title`, toggle feature availability flags, and brand the top navigation bar by defining per-theme logo entries (including arbitrary `sx` styling) inside the `theme` section—no rebuild required.

For color and typography branding, use the `theme` section to override the default light and dark Material UI palettes at runtime:

```javascript
var config = {
	// ...existing flags...
	theme: {
		light: {
			palette: {
				primary: { main: "#0043ce" },
				background: { default: "#ffffff" }
			},
			logo: {
				src: "/assets/logo-light.svg",
				alt: "Portal logo",
				sx: {
					height: 40,
					width: "auto",
					objectFit: "contain"
				}
			},
			typography: {
				fontFamily: "Inter, sans-serif"
			},
			spacing: 8,
			sidebarWidth: 280
		},
		dark: {
			palette: {
				primary: { main: "#8c54ff" },
				background: { default: "#0c0a14" }
			},
			logo: {
				src: "/assets/logo-dark.svg",
				alt: "Portal logo",
				sx: {
					height: 40,
					filter: "brightness(1.2)"
				}
			}
		}
	}
}
```

Only the keys you supply are overridden; everything else falls back to the defaults defined in `theme.tsx`.

## Production Deployment

The production build uses nginx to serve the static frontend files. An optional nginx proxy configuration is provided for routing API calls to EDC services.

## Authors

Sebastian Alberternst <sebastian.alberternst@dfki.de>

## License

MIT 

